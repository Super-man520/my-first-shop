<template>
  <div class="index">
    <el-container class="index">
      <el-header>
        <div class="logo">
          <img src="../assets/0010.jpg" alt />
        </div>
        <div class="title">
          <h1>电商后台管理系统</h1>
        </div>
        <div class="logout">
         <i class="el-icon-s-custom" style="color:#e92322"></i> 欢迎光临~
          <a href="javascript:void(0);" @click="logout">退出</a>
        </div>
      </el-header>
      <el-container>
        <i class="el-icon-s-unfold unfold" v-show="flag" @click="showAside"></i>
        <i class="el-icon-s-fold fold" v-show="!flag" @click="hideAside"></i>
        <el-aside width="200px" ref="myAside">
          <!-- unique-opened只展开一个子菜单  router当前页可跳转  default-active默认高亮-->
          <el-menu
            router
            unique-opened
            default-active="1"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
          >
            <!-- index标识-->
            <el-submenu index="1">
              <!-- 标题 -->
              <template v-slot:title>
                <i class="el-icon-location"></i>
                <span>用户管理</span>
              </template>
              <!-- index配置路径 -->
              <el-menu-item index="/users">
                <i class="el-icon-menu"></i>用户管理
              </el-menu-item>
            </el-submenu>
            <el-submenu index="2">
              <template v-slot:title>
                <i class="el-icon-location"></i>
                <span>权限管理</span>
              </template>
              <el-menu-item index="/roles">
                <i class="el-icon-menu"></i>角色列表
              </el-menu-item>
              <el-menu-item index="/rights">
                <i class="el-icon-menu"></i>权限列表
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      flag: false
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    logout () {
      // console.log(123)
      // 点击退出按钮，弹出确认按钮
      // this.$confirm(提示内容,提示内容,配置对象).then(...).catch(...)  确认走then  取消走catch
      this.$confirm('你确认要退出么?', '温馨提示', {
        // 这两项默认显示
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '退出成功!'
          })
          // 销毁本地的token
          localStorage.removeItem('token')
          this.$router.push({ name: 'login' })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '退出取消'
          })
        })
    },
    hideAside () {
      this.flag = !this.flag
      this.$refs.myAside.$el.style.marginLeft = '-200px'
    },
    showAside () {
      this.flag = !this.flag
      this.$refs.myAside.$el.style.marginLeft = '0'
    }
  }
}
</script>

<style lang="less" scoped>
.index {
  height: 100%;
  .el-header {
    background-color: #888;
    display: flex;
    height: 80px !important;
    line-height: 80px;
    .logo {
      width: 180px;
      img {
        display: block;
        height: 40px;
        margin: 0 auto;
        margin-top: 20px;
      }
    }
    .title {
      flex: 1;
      text-align: center;
      h1 {
        color: #555;
      }
    }
    .logout {
      width: 180px;
      font-weight: 700;
      text-align: right;
      a {
        display: inline-block;
        color: #daa520;
      }
    }
  }
  .el-aside {
    background-color: #545c64;
    transition: all 1s;
    .el-menu {
      border: none;
    }
  }
  .unfold,
  .fold {
    font-size: 32px;
    color: #e92322;
    position: absolute;
    z-index: 99;
    bottom: 0;
    left: 160px;
  }
  .el-main {
    background-color: #ccc;
  }
}
</style>
