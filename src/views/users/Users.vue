<template>
  <div>
    <!-- 面包屑导航 -->
    <el-card class="box-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <!-- 搜索区域 -->
        <el-col :span="8">
          <el-input v-model="queryData.query" placeholder="请输入内容" prefix-icon="el-icon-search" clearable @clear="getUsersList()" @keypress.native.enter="getUsersList()">
            <el-button slot="append" icon="el-icon-search" @click="getUsersList()"></el-button>
          </el-input>
        </el-col>
        <!-- 添加按钮 -->
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-plus" plain @click="addDialogVisible = true"></el-button>
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <el-table :data="usersList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="联系方式"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="handleUserStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="180" fixed="right">
          <template slot-scope="scope">
            <div class="opt-btn-list">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUserEdit(scope.row)"></el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleUserDelete(scope.row.id)"></el-button>
              <el-tooltip class="item" effect="light" content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" size="mini" icon="el-icon-setting" @click="handleUserRoles(scope.row)"></el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryData.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryData.pagesize" layout="total, sizes, prev, pager, next" :total="total">
      </el-pagination>
      <!-- 添加用户对话框 -->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="40%" @close="$refs.addUserFormRef.resetFields()">
        <!-- model用来记录整个表单的数据 -->
        <el-form ref="addUserFormRef" :rules="addUserRules" :model="addUserForm" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addUserForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addUserForm.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUserForm.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addUserForm.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleUserAdd">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户对话框 -->
      <el-dialog :title="editUserForm.username" :visible.sync="editDialogVisible" width="40%" @close="$refs.editUserFormRef.resetFields()">
        <el-form ref="editUserFormRef" :rules="addUserRules" :model="editUserForm" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="editUserForm.username" autocomplete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUserForm.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editUserForm.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleUserEditSave">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    // 邮箱自定义校验规则
    const checkEmail = (rule, value, cb) => {
      // rule 当前校验规则
      // value 当前需要检验的值：输入框的值
      // cb 回调
      const reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
      if (!reg.test(value)) {
        return cb(new Error('Wrong Format'))
      }
      cb()
    }
    // 手机号自定义校验规则
    const checkMobile = (rule, value, cb) => {
      const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57]|19[89])[0-9]{8}$/
      if (!reg.test(value)) {
        return cb(new Error('Wrong Format'))
      }
      cb()
    }
    return {
      queryData: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      usersList: [], // 用户列表
      total: 0, // 数据总数
      // 添加对话框显示
      addDialogVisible: false,
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUserRules: {
        username: [
          { required: true, message: 'name', trigger: 'blur' },
          { min: 2, max: 6, message: '2~6 character', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'password', trigger: 'blur' },
          { min: 6, max: 16, message: '6~16 character', trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'email', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: 'mobile', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 编辑对话框显示
      editDialogVisible: false,
      editUserForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      }
    }
  },

  created () {
    this.getUsersList()
  },

  methods: {
    // 获取用户列表
    async getUsersList () {
      const { data: res } = await this.$axios.get('users', {
        // 给后台传递的参数
        params: this.queryData
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.usersList = res.data.users
      this.total = res.data.total
    },
    // 分页操作 改变每页大小
    handleSizeChange (val) {
      this.queryData.pagesize = val
      this.getUsersList()
    },
    // 改变页码
    handleCurrentChange (val) {
      this.queryData.pagenum = val
      this.getUsersList()
    },
    // 分配用户角色
    handleUserRoles (row) {
      console.log(row)
    },
    // 修改用户状态
    async handleUserStateChange (row) {
      const { id, mg_state: state } = row
      const { data: res } = await this.$axios.put(`users/${id}/state/${state}`)
      if (res.meta.status !== 200) {
        row.mg_state = !row.mg_state
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    // 添加用户
    handleUserAdd () {
      this.$refs.addUserFormRef.validate(async flag => {
        if (flag) {
          const { data: res } = await this.$axios.post('users', this.addUserForm)
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
          this.$message.success(res.meta.msg)
          this.addDialogVisible = false
          this.getUsersList()
        }
      })
    },
    // 编辑用户
    handleUserEdit (row) {
      this.editDialogVisible = true
      this.editUserForm = JSON.parse(JSON.stringify(row))
      // const { username, email, mobile } = row
      // this.editUserForm = { id: row.id, username, email, mobile }
    },
    // 确认编辑用户
    handleUserEditSave () {
      this.$refs.editUserFormRef.validate(async flag => {
        const { email, mobile, id } = this.editUserForm
        if (flag) {
          const { data: res } = await this.$axios.put(`users/${id}`, { email, mobile })
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.editDialogVisible = false
          this.$message.success(res.meta.msg)
          this.getUsersList()
        }
      })
    },
    // 删除用户
    handleUserDelete (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        console.log(id)
        // 点击了确认
        const { data: res } = await this.$axios.delete('users/' + id)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getUsersList()
      }).catch(() => {
        // this.$message.error('err')
      })
    }
  }
}
</script>

<style scoped lang='less'>
</style>
