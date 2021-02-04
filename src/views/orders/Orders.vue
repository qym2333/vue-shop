<template>
  <div>
    <!-- 面包屑导航 -->
    <el-card class="box-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <el-card class="box-card">
      <el-row :gutter="20">
        <!-- 搜索区域 -->
        <el-col :span="8">
          <el-input placeholder="请输入内容" prefix-icon="el-icon-search" clearable @keyup.enter.native="getGoodsList">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 列表区域 -->
      <el-table :data="ordersList" style="width: 100%">
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" align="center"></el-table-column>
        <el-table-column label="是否付款" align="center" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status==='1'" type="success">已支付</el-tag>
            <el-tag v-else type="danger">未支付</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" align="center" width="80"></el-table-column>
        <el-table-column label="下单时间" align="center">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template>
            <el-tooltip class="item" effect="dark" content="修改收货地址" placement="top" enterable>
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="editAddrDialogVisible=true"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="查看物流信息" placement="top" enterable>
              <el-button type="success" size="mini" icon="el-icon-location" @click="showExpressDialog"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryData.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryData.pagesize" layout="total, sizes, prev, pager, next" :total="total">
      </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog title="修改收货地址" :visible.sync="editAddrDialogVisible" width="50%">
      <el-form ref="addressFormRef" :model="addressForm" label-width="80px">
        <el-form-item label="省市区/县">
          <el-cascader v-model="cityValue" :options="cityData"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAddrDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddrDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查看物流进度对话框 -->
    <el-dialog title="查看物流进度" :visible.sync="expressDialogVisible" width="50%">

      <el-timeline :reverse="true">
        <el-timeline-item v-for="(item, index) in expressList" :key="index" :timestamp="item.time" :color="index===expressList.length-1?'#0bbd87':''">
          {{item.content}}
        </el-timeline-item>
      </el-timeline>

      <span slot="footer" class="dialog-footer">
        <el-button @click="expressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="expressDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cityData from '../citydata'
export default {
  data () {
    return {
      queryData: {
        pagenum: 1,
        pagesize: 5
      },
      ordersList: [],
      total: 0,
      editAddrDialogVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      cityData: cityData,
      cityValue: [],
      expressDialogVisible: false,
      expressList: []
    }
  },

  created () {
    this.getOrderList()
  },

  methods: {
    async getOrderList () {
      const { data: res } = await this.$axios.get('orders', {
        params: this.queryData
      })
      if (res.meta.status !== 200) return this.$message.error('订单列表获取失败')
      this.ordersList = res.data.goods
      this.total = res.data.total
    },
    // 分页操作 每页数量
    handleSizeChange (val) {
      this.queryData.pagesize = val
      this.getOrderList()
    },
    // 分页操作 页码
    handleCurrentChange (val) {
      this.queryData.pagenum = val
      this.getOrderList()
    },
    // 查看物流信息
    async showExpressDialog () {
      this.expressDialogVisible = true
      const { data: res } = await this.$axios.get('http://localhost:8080/api/express')
      if (res.meta.status !== 200) return this.$message.error('物流信息获取失败！')
      this.expressList = res.data
    }
  }
}
</script>

<style scoped lang='less'>
.el-cascader {
  width: 100%;
}
</style>
