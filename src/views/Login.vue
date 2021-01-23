<template>
  <div class="login-box">
    <div class="form">
      <h2>Welcome Home!</h2>
      <div class="form-item">
        <div class="ipt user">
          <input type="text" placeholder="Name" />
          <img src="../assets/login-1.png" alt="" />
        </div>
        <div class="ipt pass">
          <input type="password" placeholder="Password" />
          <img src="../assets/login-2.png" alt="" />
        </div>
        <img src="../assets/login-0.png" alt="" />
        <button>sign in</button>
        <span class="add">(sign up)</span>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  data () {
    return {}
  },

  created () { },

  methods: {}
}
</script>

<style scoped lang='less'>
.login-box {
  background-color: #2e9dc9;
  width: 100%;
  height: 100%;
}
.form {
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
  .form-item {
    padding: 0 50px;
    div img {
      display: none;
    }
    .ipt:focus-within {
      & ~ img {
        display: none;
      }
      img {
        display: block;
      }
      &.user img {
        width: 120px;
        height: 113px;
      }
      &.pass img {
        width: 103px;
        height: 84px;
        top: -60px;
      }
    }
    img {
      position: absolute;
      top: -80px;
      left: 50%;
      width: 120px;
      height: 95px;
      transform: translate(-50%, 0);
    }
    .add {
      font-size: 12px;
      color: #dad4d4;
      display: block;
      margin-top: 6px;
      cursor: pointer;
      transition: all 0.3s;
      text-transform: uppercase;
      &:hover {
        color: #0b9aff;
      }
    }
  }
  input {
    width: 100%;
    height: 44px;
    border-radius: 4px;
    border: 1px solid #eee;
    margin-bottom: 12px;
    font-size: 14px;
    padding: 0 12px;
    color: #606060;
    transition: all 0.3s;
    outline: none;
    &:hover {
      border-color: #0b9aff;
    }
    &:focus-within + img {
      display: block;
    }
  }
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
  h2 {
    font-size: 22px;
    color: #0b9aff;
    letter-spacing: 2px;
    margin: 10px 0 24px;
  }
}
</style>
