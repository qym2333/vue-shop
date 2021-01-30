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
      <el-button type="primary" size="mini">添加分类</el-button>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cateList: {}, // 商品分类列表
      queryData: {
        type: [], // 获得某级分类列表
        pagenum: 1, // 当前页码值
        pagesize: 5 // 每页显示多少条
      },
      total: 0 // 分类总数
    }
  },

  created () {
    this.getCateList()
  },

  methods: {
    async getCateList () {
      const { data: res } = await this.$axios.get('/categories', {
        params: this.queryData
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data.result
      this.total = res.data.total
    }
  }
}
</script>

<style scoped lang='less'>
</style>
