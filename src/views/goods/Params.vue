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
          <el-button :type="isBtnDisabled ? 'info' :'primary'" size="mini" :disabled="isBtnDisabled">添加参数</el-button>

        </el-tab-pane>

        <!-- 静态属性 -->
        <el-tab-pane label="配置静态属性" name="only">
          <el-button :type="isBtnDisabled ? 'info' :'primary'" size="mini" :disabled="isBtnDisabled">添加属性</el-button>

        </el-tab-pane>
      </el-tabs>

    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cateList: [],
      // 级联选择器
      cascaderValue: [1, 3, 6],
      cascaderProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id'
      },
      // 选项卡
      activeName: 'many'
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
      const { data: res } = await this.$axios.get(`categories/${this.cateId}/attributes`, {
        params: {
          sel: this.activeName
        }
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      console.log(res)
    },
    cascaderChange () {
      if (this.cascaderValue.length !== 3) {
        this.cascaderValue = []
        return
      }
      if (this.cateId) {
        this.getParms()
      }
    },
    // 标签页切换
    handleTabsClick () {
      console.log(this.cateId)
      console.log(this.activeName)
    }
  }
}
</script>

<style scoped lang='less'>
.el-cascader {
  width: 300px;
}
</style>
