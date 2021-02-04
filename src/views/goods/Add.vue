<template>
  <div>
    <!-- 面包屑导航 -->
    <el-card class="box-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加商品</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <el-card class="box-card">
      <el-alert title="添加商品信息" type="info" show-icon :closable="false">
      </el-alert>
      <el-steps align-center :active="activeIndex-0" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 添加商品表单 -->
      <el-form :model="addGoodsForm" label-width="180" ref="addGoodsFormRef" label-position="top" :rules="addGoodsFormRules">
        <el-tabs :before-leave="beforeLeave" v-model="activeIndex" tab-position="left" @tab-click="handleTabClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name" placeholder="请输入商品名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="选择商品分类" prop="goods_number">
              <el-cascader v-model="addGoodsForm.goods_cat" :options="cateList" :props="cascaderProps" @change="cascaderChange" clearable></el-cascader>
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="商品价格（元）" prop="goods_price">
                  <el-input type="number" v-model="addGoodsForm.goods_price" placeholder="请输入商品价格"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="商品重量（千克）" prop="goods_weight">
                  <el-input type="number" v-model="addGoodsForm.goods_weight" placeholder="请输入商品重量"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="商品数量" prop="goods_number">
                  <el-input v-model="addGoodsForm.goods_number" placeholder="请输入商品数量"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="val" v-for="(val,index) in item.attr_vals" :key="index" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" :key="item.attr_id" v-for="item in onlyData">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload action="http://115.159.87.220:8888/api/private/v1/upload" :headers="headersObj" :on-preview="handlePreview" :on-remove="handleRemove" :on-success="uploadSuccess" list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addGoodsForm.goods_introduce"></quill-editor>
            <el-button type="primary" @click="addGoodsSubmit">Submit</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog :visible.sync="previewImgDialogVisible" width="50%">
      <img :src="previewSrc" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
export default {
  data () {
    return {
      activeIndex: 0,
      // 添加商品表单对象
      addGoodsForm: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_cat: [513, 523, 529],
        pics: [], // 当前的商品图片路径 {”pic":"/xxx"}
        goods_introduce: ''
      },
      addGoodsFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ]
      },
      // 商品分类列表
      cateList: [],
      cascaderProps: {
        // expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id'
      },
      manyData: [],
      onlyData: [],
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewImgDialogVisible: false,
      previewSrc: ''
    }
  },

  created () {
    this.getCateList()
  },

  methods: {
    // 获取分类列表
    async getCateList () {
      const { data: res } = await this.$axios.get('/categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data
    },
    cascaderChange () {
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.addGoodsForm.goods_cat = []
      }
    },
    // 离开标签页之前
    beforeLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.error('请先选择三级商品分类')
        return false
      }
      return true
    },
    // 点击切换标签页
    handleTabClick () {
      const id = this.addGoodsForm.goods_cat[2]
      if (this.activeIndex === '1' && this.manyData.length === 0) {
        this.paramsTab(id, 'many')
      } else if (this.activeIndex === '2' && this.onlyData.length === 0) {
        this.paramsTab(id, 'only')
      }
    },
    // 商品属性参数标签页
    async paramsTab (id, type) {
      const { data: res } = await this.$axios.get(`categories/${id}/attributes`, {
        params: {
          sel: type
        }
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      if (type === 'many') {
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
      }
      type === 'many' ? this.manyData = res.data : this.onlyData = res.data
    },
    // 点击移除图片
    handleRemove (file) {
      const tempPath = file.response.data.tmp_path
      const index = this.addGoodsForm.pics.findIndex(item => { return item.pic === tempPath })
      this.addGoodsForm.pics.splice(index, 1)
    },
    // 点击预览大图
    handlePreview (file) {
      this.previewImgDialogVisible = true
      this.previewSrc = 'http://115.159.87.220:8888/' + file.response.data.tmp_path
    },
    // 图片上传
    uploadSuccess (res) {
      this.addGoodsForm.pics.push({
        pic: res.data.tmp_path
      })
    },
    addGoodsSubmit () {
      this.$refs.addGoodsFormRef.validate(async flag => {
        if (!flag) return this.$message.info('还有内容没写完。')
        const formData = cloneDeep(this.addGoodsForm)
        formData.goods_cat = formData.goods_cat.join(',')
        formData.attrs = []
        this.manyData.forEach(element => {
          const newInfo = {
            attr_id: element.attr_id,
            attr_value: element.attr_vals.join(' ')
          }
          formData.attrs.push(newInfo)
        })
        this.onlyData.forEach(element => {
          const newInfo = {
            attr_id: element.attr_id,
            attr_value: element.attr_vals
          }
          formData.attrs.push(newInfo)
        })
        const { data: res } = await this.$axios.post('goods', formData)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.$router.push('/goods')
      })
    }
  }
}
</script>

<style scoped lang='less'>
.el-steps {
  margin: 15px 0;
}
.el-cascader {
  width: 100%;
}
.el-checkbox {
  margin: 8px;
}
.el-dialog {
  img {
    width: 100%;
  }
}
.quill-editor {
  margin-bottom: 15px;
  border-radius: 4px;
}
</style>
