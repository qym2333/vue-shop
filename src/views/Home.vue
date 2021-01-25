<template>
  <el-container class="home-container">
    <el-header>
      <div class="left">
        <img src="../assets/login-0.png" alt="">
        <span>后台管理系统</span>
      </div>
      <el-button plain @click="onLogout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu default-active="2">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
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
.home-container {
  height: 100%;
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // background-color: #0e8bff;
    border-bottom: 2px solid #0e8bff;
    .left {
      display: flex;
      align-items: center;
      span {
        font-size: 24px;
        color: #0e8bff;
        margin-left: 10px;
      }
      img {
        width: 250/4px;
        height: 198/4px;
      }
    }
  }
  .el-container {
    .el-aside {
      // background-color: #0e8bff;
      .el-menu {
        height: 100%;
      }
    }
  }
}
</style>
