<template>
  <div class="login">
    <div class="login-content">
      <div class="login-logo">
        <img src="../assets/logo.png">
      </div>
      <el-form
        ref="form"
        :model="loginForm"
        :rules="rules"
        class="login-box"

      >
        <el-form-item prop="username">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="signIn">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {request} from '../network/index.js'
  export default {
    data() {
      return {
        loginForm: {
          username: 'admin',
          password: '123456'
        },
        rules: {
           username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
           password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 6, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
        }
      } 
    },
    methods: {
      signIn() {
        this.$refs.form.validate(valid => {
          if(!valid) return
          this.$http.post('login', this.loginForm).then(res => {
            if(res.data.meta.status !== 200) this.$message.error(res.data.meta.msg)
            this.$message.success('登录成功')
            // 保存当前的token
            window.sessionStorage.setItem('token', res.data.data.token);
            // 登录成功跳转到home页面
            this.$router.push({
              name: 'Home'
            })
          })
        })
      }
    }
  }
</script>

<style scoped>
  .login {
    height: 100%;
    background:rgb(43, 75, 107)
  }

  .login-content {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 450px;
    height: 300px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 0 5px 1px #ccc;
    transform: translate(-50%, -50%)
  }

  .login-logo {
    position: absolute;
    left: 50%;
    padding: 10px;
    background: #fff;
    border-radius: 50%;
    border: 1px solid #eee;
    box-shadow: 0 0 2px 3px #fff;
    transform: translate(-50%, -50%)

  }

  .login-logo img {
    width: 130px;
    border-radius: 50%;
    background: rgb(238, 238, 238)
  }

  .login-box {
    width: 100%;
    position: absolute;
    bottom: 0;
    padding: 0 20px;
    box-sizing: border-box
  }

  .btns {
    text-align: right;
  }
</style>