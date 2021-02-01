<template>
  <div>
    <!-- 面包屑导航 -->
    <el-card class="box-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <el-card class="box-card">
      <el-button type="primary" size="mini" @click="showDialog">添加分类</el-button>
      <tree-grid :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" :show-row-hover="false">
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i :class="scope.row.cat_deleted?'el-icon-error':'el-icon-success'" :style="scope.row.cat_deleted?'color:red':'color:green'"></i>
        </template>
        <!-- 排序 -->
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level===0">等级一</el-tag>
          <el-tag v-else-if="scope.row.cat_level===1" type="success">等级二</el-tag>
          <el-tag v-else type="warning">等级三</el-tag>
        </template>
        <!-- 设置 -->
        <template slot="option" slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="showDialog(scope.row)"></el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDeleteCate(scope.row)"></el-button>
        </template>
      </tree-grid>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryData.pagenum" :page-sizes="[5, 10, 15]" :page-size="queryData.pagesize" layout="total, sizes, prev, pager, next" :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="cateDialogVisible" width="45%" @close="closeDialog('cateFormRef')">
      <el-form :model="cateForm" :rules="cateRules" ref="cateFormRef">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="cateForm.cat_name" clearable></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader v-model="selectedKeys" :options="parentCate" :props="cascaderProps" @change="handleChange" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="cateSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editCateDialogVisible" width="45%" @close="closeDialog('editCateFormRef')">
      <el-form :model="cateForm" :rules="cateRules" ref="editCateFormRef">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="cateForm.cat_name" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cateList: [], // 商品分类列表
      queryData: {
        type: [], // 获得某级分类列表
        pagenum: 1, // 当前页码值
        pagesize: 5 // 每页显示多少条
      },
      total: 0, // 分类总数
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      }, {
        label: '是否有效',
        type: 'template',
        template: 'isOk'
      }, {
        label: '排序',
        type: 'template',
        template: 'sort'
      }, {
        label: '操作',
        type: 'template',
        template: 'option'
      }],
      cateDialogVisible: false, // 控制对话框显示或隐藏
      editCateDialogVisible: false,
      cateForm: {
        cat_id: '', // 当前分类id
        cat_name: '', // 分类名称
        cat_level: 0, // 分类等级
        cat_pid: 0 // 父分类id
      },
      // 表单校验规则
      cateRules: {
        // 分类名称
        cat_name:
          [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
            { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
          ]
      },
      parentCate: [], // 父级分类 1，2级
      selectedKeys: [], // 选中的分类值
      //  级联选择器配置对象
      cascaderProps: {
        value: 'cat_id', // 记录cat_id
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover', // 悬浮展开
        checkStrictly: true // 取消关联，可选任意一级
      }
    }
  },

  created () {
    this.getCateList()
  },

  methods: {
    async getCateList () {
      const { data: res } = await this.$axios.get('categories', {
        params: this.queryData
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange (val) {
      this.queryData.pagesize = val
      this.getCateList()
    },
    handleCurrentChange (val) {
      this.queryData.pagenum = val
      this.getCateList()
    },
    // 获取父级分类列表
    async getParentCate () {
      const { data: res } = await this.$axios.get('categories', {
        params: {
          type: 2
        }
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.parentCate = res.data
    },
    // 显示 添加分类弹框
    async showDialog (row) {
      if (!row.cat_id) {
        this.cateDialogVisible = true
        this.getParentCate()
      } else {
        this.editCateDialogVisible = true
        this.cateForm.cat_id = row.cat_id
        const { data: res } = await this.$axios.get(`categories/${row.cat_id}`)
        this.cateForm = res.data
      }
    },
    // 关闭弹框
    closeDialog (formName) {
      this.$refs[formName].resetFields()
      this.cateForm = {}
      this.selectedKeys = []
    },
    // 级联选择器 选择父级分类 改变时触发
    handleChange () {
      const len = this.selectedKeys.length
      // 有父级分类
      if (len > 0) {
        this.cateForm.cat_pid = this.selectedKeys[len - 1]
        this.cateForm.cat_level = len
      }
    },
    // 确定保存分类
    cateSubmit () {
      this.$refs.cateFormRef.validate(async flag => {
        if (!flag) return
        const { data: res } = await this.$axios.post('categories', this.cateForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.cateDialogVisible = false
        this.getCateList()
      })
    },
    editCateSubmit () {
      this.$refs.editCateFormRef.validate(async flag => {
        if (!flag) return
        const { data: res } = await this.$axios.put(`categories/${this.cateForm.cat_id}`, {
          cat_name: this.cateForm.cat_name
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.editCateDialogVisible = false
        this.getCateList()
      })
    },
    // 删除分类
    handleDeleteCate (row) {
      const catId = row.cat_id // 当前分类id
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$axios.delete(`categories/${catId}`)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getCateList()
      }).catch(err => err)
    }
  }
}
</script>

<style scoped lang='less'>
.zk-table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
