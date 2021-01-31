<template>
  <div>
    <!-- 面包屑导航 -->
    <el-card class="box-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <!-- 列表区域 -->
    <el-card class="box-card">
      <el-button type="primary" size="small" @click="showCreateDialog">添加角色</el-button>
      <el-table :data="rolesList" style="width: 100%" stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item,index) in scope.row.children" :key="item.id" class="vcenter" :class="[index===0?'top-border':'','bottom-border']">
              <!-- 一级权限 -->
              <el-col :span="4">
                <el-tag type="primary" closable @close="handleRightDelete(scope.row,item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="20">
                <el-row v-for="(subItem,index1) in item.children" :key="subItem.id" class="vcenter" :class="[index1===0?'':'top-border']">
                  <el-col :span="6">
                    <el-tag type="success" closable="" @close="handleRightDelete(scope.row,subItem.id)">{{subItem.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="16">
                    <el-tag v-for="third in subItem.children" :key="third.id" type="warning" closable @close="handleRightDelete(scope.row,third.id)">{{third.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色"></el-table-column>
        <el-table-column prop="roleDesc" label="说明"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <div class="opt-btn-list">
              <!-- 编辑按钮 -->
              <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
              <!-- 删除按钮 -->
              <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
              <!-- 分配权限按钮 -->
              <el-tooltip class="item" effect="light" content="分配权限" placement="top" :enterable="false">
                <el-button type="warning" size="mini" icon="el-icon-setting" @click="showRightsDialog(scope.row)"></el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限弹窗 -->
    <el-dialog title="提示" :visible.sync="rightsDialogVisible" width="45%" @close="closeRightsDialog">
      <el-tree :data="rights" show-checkbox node-key="id" ref="treeRef" highlight-current :props="defaultProps" default-expand-all :default-checked-keys="defKeys">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRightsSave">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="createRoleDialogVisible" width="40%" @close="closeCreateDialog">
      <!-- 添加角色表单 -->
      <el-form ref="newRoleFormRef" :model="newRoleForm" label-width="120px" :rules="newRoleFormRules">
        <el-form-item label=" 角色名称" prop="roleName">
          <el-input v-model="newRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="newRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createRoleSubmit">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    return {
      rolesList: [],
      rightsDialogVisible: false, // 添加权限弹框标记
      createRoleDialogVisible: false, // 添加角色弹框标记
      rights: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      defKeys: [], // 默认选中的权限id
      currentId: '', // 当前角色id
      newRoleForm: {
        roleName: '', // 新增角色名称
        roleDesc: '' // 新增角色描述
      },
      newRoleFormRules: {
        roleName: [
          { required: true, message: '角色名称不可为空', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ]
      }
    }
  },

  created () {
    this.getRolesList()
  },

  methods: {
    // 获取角色列表
    async getRolesList () {
      const { data: res } = await this.$axios.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rolesList = res.data
    },
    // 删除指定权限
    handleRightDelete (role, id) {
      this.$confirm('确认取消该权限？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$axios.delete(`roles/${role.id}/rights/${id}`)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('取消成功!')
        role.children = res.data
      }).catch(err => err)
    },

    // 打开分配权限弹框
    async showRightsDialog (row) {
      this.currentId = row.id
      this.rightsDialogVisible = true
      const { data: res } = await this.$axios.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rights = res.data
      this.getAllKeys(row)
    },
    // 获取第三级权限id
    getAllKeys (row) {
      if (!row.children) {
        return this.defKeys.push(row.id)
      }
      row.children.forEach(element => {
        this.getAllKeys(element)
      })
    },
    // 关闭权限对话框
    closeRightsDialog () {
      this.defKeys = []
    },
    // 点击确定保存分配的权限
    async assignRightsSave () {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()].join(',')
      const { data: res } = await this.$axios.post(`roles/${this.currentId}/rights`, {
        rids: keys
      })

      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.rightsDialogVisible = false
      this.defKeys = []
      this.getRolesList()
    },
    // 打开添加角色弹窗
    showCreateDialog () {
      this.createRoleDialogVisible = true
    },
    // 关闭添加角色弹窗
    closeCreateDialog () {
      this.resetForm('newRoleFormRef')
    },
    // 提交添加角色表单
    createRoleSubmit () {
      this.$refs.newRoleFormRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$axios.post('roles', this.newRoleForm)
          res.meta.status !== 201 ? this.$message.error(res.meta.msg) : this.$message.success(res.meta.msg)
          this.createRoleDialogVisible = false
          this.getRolesList()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置表单
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}

</script>

<style scoped lang='less'>
.el-table {
  .el-tag {
    margin: 0 0 8px 8px;
    cursor: pointer;
  }
  .el-icon-caret-right {
    font-size: 14px;
    color: gainsboro;
  }
}
.top-border {
  padding-top: 8px;
  border-top: 1px dotted #ebeef5;
}
.bottom-border {
  margin-bottom: 8px;
  border-bottom: 1px dotted #ebeef5;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
