<template>
  <div>
    <!-- 面包屑导航 -->
    <el-card class="box-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>数据报表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <el-card class="box-card">
      <div id="main"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  data () {
    return {

    }
  },

  created () {

  },

  mounted () {
    this.initEcharts()
  },

  methods: {
    async initEcharts () {
      const myChart = echarts.init(document.getElementById('main'))

      const { data: res } = await this.$axios.get('reports/type/1')
      // 取消两侧留白
      res.data.xAxis[0].boundaryGap = false
      // 添加鼠标经过图示
      res.data.tooltip = {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      }
      // 绘制图表
      myChart.setOption(res.data)
    }
  }
}
</script>

<style scoped lang='less'>
.box-card {
  #main {
    width: 800px;
    height: 450px;
  }
}
</style>
