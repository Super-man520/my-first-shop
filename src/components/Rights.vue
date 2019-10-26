<template>
  <div>
      <!-- 面包屑 -->
    <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- <span class="line"></span> -->
    <!-- 表格 border带竖直方向的边框-->
    <el-table :data="rightsList" border style="width: 100%">
      <el-table-column type="index" label="序号" width="80" :index="indexMethod"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="200"></el-table-column>
      <el-table-column prop="path" label="路径" width="200"></el-table-column>
      <el-table-column prop="level" label="层级"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      rightsList: []
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    getRightsList () {
      var $url = `http://localhost:8888/api/private/v1/rights/tree`
      axios.get($url, {
        // `headers` 是即将被发送的自定义请求头
        // headers: {
        //   // 需将token一起发送
        //   Authorization: localStorage.getItem('token')
        // }
      }).then(res => {
        console.log(res)
        const { data, meta } = res
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.rightsList = data
        } else {
          this.$message.error(meta.msg)
        }
      })
    },
    indexMethod (index) {
      return index + 1
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
.el-table {
  margin-top: 32px;
}
.el-breadcrumb {
  padding-bottom: 10px;
  border-bottom: 1px solid #666;
}
</style>
