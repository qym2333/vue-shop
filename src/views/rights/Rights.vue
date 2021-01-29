<template>
  <div>
    <!-- 面包屑导航 -->
    <el-card class="box-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <!-- 列表区域 -->
    <el-card class="box-card">
      <el-table :data="rightsList" style="width: 100%" stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="等级">
          <template slot-scope="scope">
            <el-tag :type="rightLevel[scope.row.level].type">等级{{rightLevel[scope.row.level].text}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightsList: [],
      rightLevel: this.level()
    }
  },

  created () {
    this.getRightsList()
  },

  methods: {
    level () {
      return [
        { type: 'primary', text: '一' },
        { type: 'success', text: '二' },
        { type: 'warning', text: '三' }
      ]
    },
    async getRightsList () {
      const { data: res } = await this.$axios.get('rights/list')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rightsList = res.data
    }
  }
}
</script>

<style scoped lang='less'>
</style>
