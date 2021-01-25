<template>
  <div class="login-box" v-loading.fullscreen.lock="loginLoading">
    <!-- 登陆表单 -->
    <div class="login-form">
      <h2>Welcome Home!</h2>
      <el-form ref="loginFormRef" :model="loginForm" label-width="0" :rules="rules">
        <!-- 用户名 -->
        <el-form-item class="user" prop="username">
          <el-input placeholder="Name" prefix-icon="el-icon-user" v-model="loginForm.username" clearable></el-input>
        </el-form-item>
        <img src="../assets/login-1.png" alt="" class="change">
        <!-- 密码 -->
        <el-form-item class="pwd" prop="password">
          <el-input placeholder="Password" prefix-icon="el-icon-lock" v-model="loginForm.password" show-password clearable></el-input>
        </el-form-item>
        <img src="../assets/login-2.png" alt="" class="change">
        <!-- 按钮 -->
        <el-form-item class="btn">
          <el-button type="primary" @click="onLogin">sign in</el-button>
        </el-form-item>
        <img src="../assets/login-0.png" alt="" class="avatar">
        <el-form-item class="add">
          <span @click="toCreateForm">(sign up)</span>
          <span @click="resetLoginForm">(reset)</span>
        </el-form-item>
        <img src="../assets/login-0.png" alt="" class="avatar">
      </el-form>
    </div>
    <!-- 注册页面模态框 -->
    <transition name="fade">
      <section class="create" v-if="isShow">
        <div class="create-form">
          <h3>创建账号</h3>
          <el-form ref="createFormRef" :model="loginForm" label-width="0" :rules="rules">
            <!-- 用户名 -->
            <el-form-item class="user" prop="username">
              <el-input placeholder="Name" v-model="loginForm.username" clearable></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item class="pwd" prop="password">
              <el-input placeholder="Password" v-model="loginForm.password" show-password clearable></el-input>
            </el-form-item>
            <!-- 确认密码 -->
            <el-form-item class="pwd" prop="password">
              <el-input placeholder="Password" v-model="loginForm.password" show-password clearable></el-input>
            </el-form-item>
            <!-- 按钮 -->
            <el-form-item class="btn">
              <el-button type="primary">sign in</el-button>
            </el-form-item>
          </el-form>
          <p>
            <span class="el-icon-warning"></span> 管理员账号只能创建一次,
            请牢记账号和密码！
          </p>
          <span @click="closeCreate" class="el-icon-circle-close"></span>
        </div>
      </section>
    </transition>
    <!-- 底部提示 -->
    <div class="hint">永远相信美好的事情即将发生...</div>
  </div>

</template>

<script>
export default {
  data () {
    return {
      loginLoading: false,
      isShow: false,
      // 登录单数据
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则
      rules: {
        username: [
          { required: true, message: 'name', trigger: 'blur' },
          { min: 2, max: 6, message: '2~6 character', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'password', trigger: 'blur' },
          { min: 6, max: 16, message: '6~16 characte', trigger: 'blur' }
        ]
      }
    }
  },

  created () { },

  methods: {
    // 重置表单
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    // 打开注册页面
    toCreateForm () {
      this.isShow = !this.isShow
    },
    // 关闭注册页面
    closeCreate () {
      this.isShow = false
    },
    // 去登陆
    onLogin () {
      // this.loginLoading = true
      this.$refs.loginFormRef.validate(async flag => {
        if (!flag) return console.log('failed')
        const { data: res } = await this.$axios.post('login', this.loginForm)
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg)
        } else {
          this.$message.success('登录成功')
          sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        }
      })
    }
  }
}

</script>
<style lang='less'>
.login-box {
  background-color: #2e9dc9;
  width: 100%;
  height: 100%;
  img.change {
    display: none;
  }
  .el-input {
    input {
      width: 100%;
      // height: 44px;
      border-radius: 4px;
      border: 1px solid #eee;
      font-size: 14px;
      // padding: 0 12px;
      color: #606060;
      transition: all 0.3s;
      outline: none;
      &:hover {
        border-color: #0b9aff;
      }
    }
  }

  .login-form {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 380px;
    padding: 40px 0 24px;
    background: #fff;
    border-radius: 10px;
    text-align: center;
    transform: translate(-50%, -50%);
    box-shadow: 0 2px 10px #e6e6e6;
    z-index: 9;
    h2 {
      font-size: 22px;
      color: #0b9aff;
      letter-spacing: 2px;
      margin: 10px 0 24px;
    }
    img {
      position: absolute;
      top: -80px;
      left: 50%;
      width: 120px;
      height: 95px;
      transform: translate(-50%, 0);
    }
    .el-form {
      padding: 0 50px;
      .el-form-item {
        &.add {
          margin-bottom: 0;
          .el-form-item__content {
            display: flex;
            justify-content: space-evenly;
            span {
              font-size: 12px;
              color: #dad4d4;
              margin-top: 6px;
              cursor: pointer;
              transition: all 0.3s;
              text-transform: uppercase;
              &:hover {
                color: #0b9aff;
              }
            }
          }
        }
        &.btn {
          margin-bottom: 0;
          button {
            border: none;
            color: #fff;
            background: #0b9aff;
            height: 40px;
            font-size: 16px;
            border-radius: 4px;
            cursor: pointer;
            display: block;
            width: 100%;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.3s;
            outline: none;
            margin-top: 10px;
            &:hover {
              background: #0486e2;
            }
          }
        }
        &:focus-within {
          & ~ img {
            display: none;
          }
          & + img {
            display: block;
          }
        }
        .el-input();
        &.user + img {
          width: 120px;
          height: 113px;
        }
        &.pwd + img {
          top: -60px;
          width: 103px;
          height: 84px;
        }
      }
    }
  }
  .create {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    &::before {
      content: '';
      background: rgba(0, 0, 0, 0.5);
      display: block;
      height: 100%;
      width: 100%;
      position: absolute;
    }
    .create-form {
      background: #fff;
      width: 430px;
      z-index: 99;
      padding: 40px 50px 20px;
      border-radius: 10px;
      box-shadow: 0 2px 10px #e6e6e6;
      position: relative;
      h3 {
        text-align: center;
        color: #409eff;
        font-size: 20px;
        margin-bottom: 40px;
        font-weight: 400;
        letter-spacing: 2px;
      }
      p {
        font-size: 12px;
        color: #b5b5b5;
        margin-top: 40px;
        text-align: center;
      }
      .el-form {
        .el-form-item {
          &.btn {
            button {
              border: none;
              color: #fff;
              background: #0b9aff;
              height: 40px;
              font-size: 16px;
              border-radius: 4px;
              cursor: pointer;
              display: block;
              width: 100%;
              text-transform: uppercase;
              letter-spacing: 1px;
              transition: all 0.3s;
              outline: none;
              margin-top: 10px;
              &:hover {
                background: #0486e2;
              }
            }
          }
        }
        .el-input();
      }
    }
    .el-icon-circle-close {
      position: absolute;
      right: 15px;
      top: 15px;
      font-size: 18px;
      color: #d2d2d2;
      cursor: pointer;
      transition: all 0.3s;
      &:hover {
        color: #0486e2;
      }
    }
  }
}
.hint {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 12px;
  text-align: center;
  letter-spacing: 1px;
  z-index: 99;
}
// 过渡效果
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

@media screen and (max-width: 600px) {
  .login-form {
    max-width: 90%;
    width: 400px;
    .form-item {
      padding: 0 40px;
    }
  }
  .create .create-form {
    max-width: 90%;
    width: 400px;
    padding: 40px 30px 20px;
  }
}
</style>
