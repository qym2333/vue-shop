<template>
  <el-container class="home-container">
    <el-header>
      <div class="left">
        <img class="logo1" src="../assets/login-1.png" alt="" :style="isCollapse?'display:none':'display:block'">
        <img class="logo2" src="../assets/login-2.png" alt="" :style="isCollapse?'display:block':'display:none'">
      </div>
      <span>后台管理系统</span>
      <el-button plain @click="onLogout" size="small" class="btn-quit"><i class="el-icon-switch-button"></i></el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse?'64px':'200px' ">
        <el-menu :default-active="activeIndex" unique-opened :collapse="isCollapse" :collapse-transition="false" router>
          <el-submenu :index="item.id.toString()" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconList[item.path]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children" :key="subitem.id">
              <i class="el-icon-menu"></i>
              <span>{{subitem.authName}}</span>
            </el-menu-item>
          </el-submenu>
          <div class="btn-collapse" @click="isCollapse=!isCollapse">
            <i :class="isCollapse ? 'el-icon-open':'el-icon-turn-off'"></i>
          </div>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      iconList: {},
      isCollapse: false,
      activeIndex: ''
    }
  },

  created () {
    this.getMenu()
    this.activeIndex = this.$route.path
  },

  methods: {
    // 账号退出
    onLogout () {
      sessionStorage.removeItem('token')
      this.$router.push('/login')
      this.$message.success('账号退出……')
    },
    // 获取菜单内容
    async getMenu () {
      const { data: res } = await this.$axios.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      res.data.forEach(element => {
        switch (element.path) {
          case 'goods':
            this.iconList.goods = 'el-icon-shopping-bag-2'
            break
          case 'orders':
            this.iconList.orders = 'el-icon-s-order'
            break
          case 'rights':
            this.iconList.rights = 'el-icon-key'
            break
          case 'users':
            this.iconList.users = 'el-icon-user'
            break
          case 'reports':
            this.iconList.reports = 'el-icon-data-line'
            break
        }
      })
    }
  }
}

</script>

<style scoped lang='less'>
.home-container {
  height: 100%;
  .el-header {
    position: relative;
    display: flex;
    height: 56px !important;
    justify-content: space-between;
    align-items: center;
    // background-color: #0e8bff;
    border-bottom: 2px solid #0e8bff;
    .btn-quit {
      i {
        font-size: 20px;
      }
    }
    span {
      padding-left: 60px;
      font-size: 24px;
      color: #0e8bff;
      margin-left: 10px;
    }
    .left {
      display: flex;
      align-items: center;

      img {
        position: absolute;
        display: none;
        &.logo1 {
          top: 10px;
          left: 60px;
          width: 248/4px;
          height: 234/4px;
          z-index: 9;
        }
        &.logo2 {
          top: 20px;
          left: 8px;
          width: 222/4.5px;
          height: 180/4.5px;
          z-index: 9;
        }
      }
    }
  }
  .el-container {
    .el-aside {
      // background-color: #0e8bff;
      .btn-collapse {
        background-color: #0e8bff;
        text-align: center;
        i {
          padding: 10px 0;
          color: #fff;
          font-size: 20px;
          cursor: pointer;
          user-select: none;
        }
      }
      .el-menu {
        height: 100%;
      }
    }
    // .el-main {
    //   background-color: #f3f3f3;
    // }
  }
}
</style>
