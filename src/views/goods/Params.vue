<template>
  <div>
    <!-- 面包屑导航 -->
    <el-card class="box-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品参数</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>

    <el-card class="box-card">
      <el-alert title="注意：只允许为第三级分类添加参数！" type="warning" show-icon :closable="false">
      </el-alert>

      <el-form style="margin:15px 0;">
        <el-form-item label="选择商品分类" label-width="100px">
          <el-cascader v-model="cascaderValue" :options="cateList" :props="cascaderProps" @change="cascaderChange" clearable></el-cascader>
        </el-form-item>
      </el-form>

      <el-tabs tab-position="left" v-model="activeName" @tab-click="handleTabsClick">
        <!-- 动态参数 -->
        <el-tab-pane label="配置动态参数" name="many">
          <el-button :type="isBtnDisabled ? 'info' :'primary'" size="mini" :disabled="isBtnDisabled" @click="addParamsDialogVisible=true">添加参数</el-button>
          <el-table :data="manyTableData" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable>{{item}}</el-tag>

                <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新参数</el-button>

              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="分类名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 编辑按钮 -->
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
                <!-- 删除按钮 -->
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 静态属性 -->
        <el-tab-pane label="配置静态属性" name="only">
          <el-button :type="isBtnDisabled ? 'info' :'primary'" size="mini" :disabled="isBtnDisabled" @click="addParamsDialogVisible=true">添加属性</el-button>
          <el-table :data="onlyTableData" style="width: 100%">
            <el-table-column type="expand">

            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="分类名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 编辑按钮 -->
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
                <!-- 删除按钮 -->
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

    </el-card>
    <!-- 添加属性参数弹框 -->
    <el-dialog :title="'添加' + paramsText" :visible.sync="addParamsDialogVisible" width="30%" @close="closeDialog('addParamsFormRef')">
      <!-- 添加参数属性表单 -->
      <el-form ref="addParamsFormRef" :model="addParamsForm" label-width="80px" :rules="addParamsFormRules">
        <el-form-item :label="paramsText" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改属性参数弹框 -->
    <el-dialog :title="'修改' + paramsText" :visible.sync="editParamsDialogVisible" width="30%" @close="closeDialog('editParamsFormRef')">
      <!-- 编辑参数属性表单 -->
      <el-form ref="editParamsFormRef" :model="editParamsForm" label-width="80px" :rules="editParamsFormRules">
        <el-form-item :label="paramsText" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <transition name="fade">
      <loading v-if="isLoading"></loading>
    </transition>

  </div>
</template>

<script>
import Loading from '@/components/Loading'

export default {
  components: { Loading },
  data () {
    return {
      isLoading: false,
      cateList: [],
      // 级联选择器
      cascaderValue: [],
      cascaderProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id'
      },
      // 选项卡
      activeName: 'many',
      // 属性参数
      manyTableData: [],
      onlyTableData: [],
      addParamsDialogVisible: false,
      editParamsDialogVisible: false,
      // 添加属性参数表单对象
      addParamsForm: {
        attr_name: ''
      },
      addParamsFormRules: {
        attr_name: [
          {
            required: true, message: '请输入名称', trigger: 'blur'
          }
        ]
      },
      // 编辑表单对象
      editParamsForm: {
        attr_name: ''
      },
      editParamsFormRules: {
        attr_name: [
          {
            required: true, message: '请输入名称', trigger: 'blur'
          }
        ]
      },
      inputVisible: false
    }
  },

  created () {
    this.getCateList()
    this.getParms()
  },
  computed: {
    // 选择第三级时 添加按钮可用
    isBtnDisabled () {
      return this.cascaderValue.length !== 3
    },
    // 获取第三级分类的id
    cateId () {
      return this.cascaderValue[2]
    },
    paramsText () {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    }
  },
  methods: {
    // 获取分类列表
    async getCateList () {
      const { data: res } = await this.$axios.get('/categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data
    },
    // 根据分类id 获取该类下的参数或者属性
    async getParms () {
      if (this.cascaderValue.length !== 3) {
        this.cascaderValue = []
        return
      }
      this.isLoading = true
      const { data: res } = await this.$axios.get(`categories/${this.cateId}/attributes`, {
        params: {
          sel: this.activeName
        }
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      res.data.forEach(element => {
        element.attr_vals = element.attr_vals === '' ? [] : element.attr_vals.split(' ')
      })
      this.activeName === 'many' ? this.manyTableData = res.data : this.onlyTableData = res.data
      this.isLoading = false
    },
    cascaderChange () {
      this.getParms()
    },
    // 标签页切换
    handleTabsClick () {
      this.getParms()
    },
    // 关闭添加对话框
    closeDialog (formName) {
      this.$refs[formName].resetFields()
    },
    // 提交添加表单
    handleAddSubmit () {
      this.$refs.addParamsFormRef.validate(async flag => {
        if (!flag) return
        const { data: res } = await this.$axios.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addParamsForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getParms()
        this.addParamsDialogVisible = false
      })
    },
    // 显示编辑框
    showEditDialog (row) {
      this.editParamsDialogVisible = true
      this.editParamsForm = JSON.parse(JSON.stringify(row))
    },
    // 提交编辑表单
    handleEditSubmit () {
      this.$refs.editParamsFormRef.validate(async flag => {
        if (!flag) return
        const { data: res } = await this.$axios.put(`categories/${this.cateId}/attributes/${this.editParamsForm.attr_id}`, {
          attr_name: this.editParamsForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.editParamsDialogVisible = false
        this.getParms()
      })
    },
    // 删除参数
    handleDelete (row) {
      const attrId = row.attr_id // 当前分类id
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$axios.delete(`categories/${this.cateId}/attributes/${attrId}`)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getParms()
      }).catch(err => err)
    },
    // 添加参数属性输入框失去焦点或回车
    handleInputConfirm () {
      this.inputVisible = false
    },
    // 添加新参数点击事件
    showInput () {
      this.inputVisible = true
    }
  }
}
</script>

<style scoped lang='less'>
.el-cascader {
  width: 300px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
