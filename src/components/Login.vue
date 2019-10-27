<template>
<div class="login">
  <img src="../assets/01.jpg" alt="" class="logo">
  <!-- form表单提供了校验功能，只需要通过rules属性传入校验规则，并将form-item的prop属性设置为需要校验的字段即可 status-icon反馈图标-->
  <el-form :model="form" :rules="rules" label-width="100px" class="demo-ruleForm" ref="form" status-icon>
  <el-form-item label="username" prop="username">
    <!-- .native可以给组件根元素注册原生事件 -->
    <el-input v-model="form.username" type="text" placeholder="username" @keyup.enter.native="loginBtn"></el-input>
  </el-form-item>
  <el-form-item label="password" prop="password">
    <el-input v-model="form.password" type="password" placeholder="password" @keyup.enter.native="loginBtn"></el-input>
  </el-form-item>
  <el-form-item>
  <el-button type="success" class="loginBtn" @click="loginBtn">login</el-button>
  <el-button type="danger" class="resetBtn" @click="resetForm">reset</el-button>
</el-form-item>
</el-form>
</div>
</template>

<script>
// import axios from 'axios'
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      // trigger 触发时  blur失去焦点
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['change', 'blur'] },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: ['change', 'blur'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['change', 'blur'] },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  methods: {
    loginBtn () {
      this.$refs.form.validate((valid, obj) => {
        // console.log(obj)
        if (!valid) {
          this.$message({
            showClose: true,
            message: '页面发生错误',
            type: 'warning',
            duration: 1200
          })
          return
        }
        // axios.post(url, data).then(response).catch(error)  catch错误函数
        // 发送ajax
        this.$axios({
          method: 'post',
          // url: 'http://localhost:8888/api/private/v1/login',
          url: 'login',
          data: this.form
        }).then(res => {
          // 解构
          console.log(res)
          const { meta, data } = res
          if (meta.status === 200) {
            // 登录成功存储token到本地
            localStorage.setItem('token', data.token)
            this.$message({
              message: meta.msg,
              type: 'success',
              // 弹窗显示时间
              duration: 1200
            })
            this.$router.push('/index')
          } else {
            this.$message.error(meta.msg)
          }
        })
      })
    },
    // 要重置表单，需要获取表单的值，利用ref和$refs的方法，调用resetFields
    resetForm () {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;
  position: relative;
  // 组件定义的规范: 组件的根元素类名 和 组件名同
  .logo {
    width: 100px;
    height: 100px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 90px;
    border-radius: 50%;
    border: 5px solid #e92322;
  }
  .el-form {
    background-color: #fff;
    padding: 80px 50px 30px;
    margin: 150px auto 0;
    border-radius: 20px;
    width: 36%;
  }
  .loginBtn {
    margin-right: 30px;
  }
}
</style>
