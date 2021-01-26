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
          <el-input placeholder="请输入内容" prefix-icon="el-icon-search">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <!-- 添加按钮 -->
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-plus" plain></el-button>
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <el-table :data="usersList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="用户名" width="100"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="联系方式"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="150"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="100">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)"></el-button>
            <el-tooltip class="item" effect="light" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" size="mini" icon="el-icon-setting" @click="handleRoles(scope.$index, scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryData.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryData.pagesize" layout="total, sizes, prev, pager, next" :total="total" :hide-on-single-page="true">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryData: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      usersList: [], // 用户列表
      total: 0 // 数据总数
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
    handleEdit (index, row) {
      console.log(index, row)
    },
    handleDelete (index, row) {
      console.log(index, row)
    },
    handleSizeChange (val) {
      this.queryData.pagesize = val
      this.getUsersList()
    },
    handleCurrentChange (val) {
      this.queryData.pagenum = val
      this.getUsersList()
    }
  }
}
</script>

<style scoped lang='less'>
</style>
