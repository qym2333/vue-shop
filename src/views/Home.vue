<template>
  <div>
    <el-button plain @click="onLogout">退出</el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },

  created () {

  },

  methods: {
    onLogout () {
      sessionStorage.removeItem('token')
      this.$router.push('/login')
      this.$message.success('账号退出……')
    }
  }
}
</script>

<style scoped lang='less'>
</style>
