<template>
  <div>
    <!-- 面包屑导航 -->
    <el-card class="box-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <el-card class="box-card">
      <el-row :gutter="20">
        <!-- 搜索区域 -->
        <el-col :span="8">
          <el-input placeholder="请输入内容" prefix-icon="el-icon-search" clearable @keyup.enter.native="getGoodsList" v-model="queryData.query" @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加按钮 -->
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-plus" plain @click="$router.push('/goods/add')"></el-button>
        </el-col>
      </el-row>

      <!-- 列表区域 -->
      <el-table :data="goodsList" style="width: 100%" stripe>
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" min-width="200">
        </el-table-column>
        <el-table-column prop="goods_price" label="价格（元）" width="120" align="center">
        </el-table-column>
        <el-table-column prop="goods_weight" label="重量" width="80" align="center">
        </el-table-column>
        <el-table-column label="创建时间" width="150" align="center">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryData.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryData.pagesize" layout="total, sizes, prev, pager, next" :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      total: 0,
      queryData: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      goodsList: []
    }
  },

  created () {
    this.getGoodsList()
  },

  methods: {
    // 获取商品列表
    async getGoodsList () {
      const { data: res } = await this.$axios.get('goods', {
        params: this.queryData
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 分页操作 每页数量
    handleSizeChange (val) {
      this.queryData.pagesize = val
      this.getGoodsList()
    },
    // 分页操作 页码
    handleCurrentChange (val) {
      this.queryData.pagenum = val
      this.getGoodsList()
    },
    // 删除商品
    handleDelete () {

    }
  }
}
</script>

<style scoped lang='less'>
</style>
