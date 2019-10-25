<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <span class="line"></span>
    <!-- 添加角色 -->
    <el-button plain type="success" class="add-role" >添加角色</el-button>
    <!-- 表格 -->
    <!-- 通过 data 属性注入数组, prop 定义键名 label定义列名 stripe可以创建带斑马纹的表格-->
    <el-table :data="roleList" stripe style="width: 100%">
    <el-table-column type="index" width="120"></el-table-column>
    <el-table-column prop="roleName" label="角色名称" width="200"></el-table-column>
    <el-table-column prop="roleDesc" label="描述" width="200"></el-table-column>
    <el-table-column prop="handle" label="操作">
      <template v-slot:default="obj">
       <el-row>
          <el-button type="primary" icon="el-icon-edit" plain @click="editUser(obj.row)" size="small"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain @click="deleteUser(obj.row)" size="small"></el-button>
          <el-button type="success" icon="el-icon-check" plain @click="assigningUser(obj.row)" size="small">分配角色</el-button>
       </el-row>
       </template>
    </el-table-column>
  </el-table>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      roleList: []
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    getRolesList () {
      var $url = `http://localhost:8888/api/private/v1/roles`
      axios.get($url, {
        // `headers` 是即将被发送的自定义请求头
        headers: {
          // 需将token一起发送
          Authorization: localStorage.getItem('token')
        }
      }).then(res => {
        const { data, meta } = res.data
        console.log(data, meta)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.roleList = data
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.line {
  position: absolute;
  width: 85%;
  height: 3px;
  background-color: #888;
  top: 125px;
  right: 12px;
}
.add-role {
  margin: 26px 0 16px;
}
</style>
