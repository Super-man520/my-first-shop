<template>
  <div class="users">
    <!-- 面包屑 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- <span class="line"></span> -->
  <!-- 搜索框 -->
  <el-input placeholder="请输入搜索关键字" class="input-with-select search" v-model="query">
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
    <el-button type="success" plain @click="addUser">添加用户</el-button>
  <!-- 表格 -->
  <!-- prop属性来对应对象的键名 label属性定义表格的列名 data注入数据 -->
   <el-table :data="userList" style="width: 100%" >
    <el-table-column prop="username" label="姓名" width="200"></el-table-column>
    <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
    <el-table-column prop="mobile" label="电话" width="200"></el-table-column>
     <el-table-column prop="state" label="用户状态" width="200">
     <!-- 作用域插槽 可以获取到 row, column, $index 和 store 的数据-->
     <template v-slot:default="obj">
       <!-- {{obj.row}} -->
       <el-switch
          v-model="obj.row.mg_state"
          active-color="#13ce66"
          inactive-color="#ff4949" @change="updateState(obj.row.id,obj.row.mg_state)">
      </el-switch>
     </template>
     </el-table-column>
     <el-table-column prop="handle" label="操作">
        <template v-slot:default="obj">
       <el-row>
          <el-button type="primary" icon="el-icon-edit" plain @click="editUser(obj.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain @click="deleteUser(obj.row)"></el-button>
          <el-button type="success" icon="el-icon-check" plain @click="assigningUser(obj.row)">分配角色</el-button>
       </el-row>
       </template>
     </el-table-column>
  </el-table>
<!-- 分页 -->
<template>
   <div class="block">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPage">
    </el-pagination>
  </div>
</template>
<!-- 修改用户的显示框 -->
<el-dialog title="修改用户" :visible.sync="showEdit" width="30%">
  <el-form :model="form" status-icon :rules="rules" ref="form">
    <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
      <el-button ref="button" disabled>{{form.text}}</el-button>
    </el-form-item>
    <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
      <el-input v-model="form.email" autocomplete="off"></el-input>
    </el-form-item>
     <el-form-item label="手机" :label-width="formLabelWidth" prop="mobile">
      <el-input v-model="form.mobile" autocomplete="off" maxlength="11"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="showEdit = false">取 消</el-button>
    <el-button type="primary" @click="sureEdit(form)">确 定</el-button>
  </div>
</el-dialog>
<!-- 分配用户角色的显示框 -->
<el-dialog title="分配角色" :visible.sync="showEdit2" width="30%">
  <el-form :model="form2">
    <el-form-item label="用户名" :label-width="formLabelWidth">
      <el-button disabled>{{form2.user}}</el-button>
    </el-form-item>
    <el-form-item label="角色列表" :label-width="formLabelWidth">
      <!-- roleRid绑定角色id可以默认显示 -->
      <el-select v-model="form2.roleRid" placeholder="请选择角色名" clearable>
        <el-option v-for="item in options" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="showEdit2 = false">取 消</el-button>
    <el-button type="primary" @click="sureAssign">确 定</el-button>
  </div>
</el-dialog>
<!-- 添加用户 -->
<el-dialog title="添加用户" :visible.sync="showEdit3" width="30%">
  <el-form :model="form3" status-icon :rules="rules" ref="form3">
    <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
      <el-input v-model="form3.username" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
      <el-input v-model="form3.password" autocomplete="off" type="password"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
      <el-input v-model="form3.email" autocomplete="off"></el-input>
    </el-form-item>
     <el-form-item label="手机" :label-width="formLabelWidth" prop="mobile">
      <el-input v-model="form3.mobile" autocomplete="off" maxlength="11"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="cancelAdd">取 消</el-button>
    <el-button type="primary" @click="sureAdd(form3)">确 定</el-button>
  </div>
</el-dialog>
  </div>
</template>

<script>
// import axios from 'axios'
export default {
  data () {
    return {
      options: [],
      id: null,
      // url: 'http://localhost:8888/api/private/v1/users/',
      query: '',
      userList: [],
      // 查询参数query  当前页码 pagenum  每页显示个数pagesize
      pagenum: 1,
      pagesize: 2,
      totalPage: null,
      // 用户数据
      showEdit: false,
      showEdit2: false,
      showEdit3: false,
      // 邮箱校验格式
      regEmail: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
      // 手机校验格式
      regMobile: /^1[3456789]\d{9}$/,
      form: {
        email: '',
        mobile: '',
        text: ''
      },
      form2: {
        user: '',
        // 角色id
        roleRid: '',
        // 用户id
        id: ''
      },
      form3: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      formLabelWidth: '120px',
      // size: 'mini'
      rules: {
        email: [
          { required: true, message: '请输入用户邮箱', trigger: ['change', 'blur'] },
          { min: 10, max: 28, message: '长度在 10 到 28 个字符', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '请输入用户电话', trigger: ['change', 'blur'] },
          { min: 10, max: 11, message: '长度在 11 个字符', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  // created: 会将data中的数据注入到当前实例上, 此时实例上已经有数据了
  created () {
    this.getUserList()
  },
  methods: {
    // 一进入页面即要发送axios
    getUserList () {
      // var $url = this.url
      this.$axios.get('users', {
        // this.$axios.get(url[, config]) params 是即将与请求一起发送的 URL 参数
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
        // `headers` 是即将被发送的自定义请求头
        // headers: {
        //   // 需将token一起发送
        //   Authorization: localStorage.getItem('token')
        // }
      }).then(res => {
        console.log(res)
        const { data, meta } = res
        if (meta.status === 200) {
          this.totalPage = data.total
          this.userList = data.users
          this.$message.success(meta.msg)
        } else {
          this.$message(meta.msg)
        }
      })
    },
    // 搜索关键字
    search () {
      console.log(this.query)
      this.pagenum = 1
      this.getUserList()
      this.query = ''
    },
    // 分页
    handleSizeChange (val) {
      // 查询参数query  当前页码 pagenum  每页显示个数pagesize
      this.pagesize = val
      // console.log(val)
      // console.log(`每页 ${val} 条`)
      this.getUserList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      // console.log(val)
      // console.log(`当前页: ${val}`)
      this.getUserList()
    },
    // 更新用户状态
    updateState (id, state) {
      console.log(id, state)
      var $url = `users/${id}/state/${state}`
      this.$axios.put($url, {
        // `headers` 是即将被发送的自定义请求头
        // headers: {
        //   // 需将token一起发送
        //   Authorization: localStorage.getItem('token')
        // }
      }).then(res => {
        console.log(res)
        const { meta } = res
        if (meta.status === 200) {
          this.$message.success(meta.msg)
        }
      })
    },
    // 修改用户显示框的内容
    editUser (info) {
      console.log(info)
      this.id = info.id
      this.showEdit = true
      this.form.text = info.username
      this.form.email = info.email
      this.form.mobile = info.mobile
    },
    // 点击确定修改
    sureEdit (form) {
      if (!this.regEmail.test(this.form.email)) {
        this.$message.error('邮箱格式错误')
        return
      }
      if (!this.regMobile.test(this.form.mobile)) {
        this.$message.error('请输入有效手机号')
        return
      }
      this.$refs.form.validate((vaild) => {
        if (!vaild) return
        console.log(this.form)
        this.$axios.put(`users/${this.id}`, this.form).then(res => {
          console.log(res)
          const { meta } = res
          if (meta.status === 200) {
            this.getUserList()
            this.$message.success(meta.msg)
          } else {
            this.$message.error(meta.msg)
          }
        })
        this.showEdit = false
      })
    },
    // 删除用户
    deleteUser (info) {
      console.log(info)
      // 弹出消息确认框
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(info.id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.$axios.delete(`users/${info.id}`).then(res => {
          console.log(res)
          const { meta } = res
          if (meta.status === 200) {
            this.$message.success(meta.msg)
            // 如果当前页只有一条数据  删除后当前页为空
            if (this.userList.length === 1 && this.pagenum > 1) {
              this.pagenum--
            }
            this.getUserList()
          } else {
            this.$message.error(meta.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 分配用户
    assigningUser (info) {
      this.form2.id = info.id
      this.form2.user = info.username
      console.log(info)
      this.showEdit2 = true
      // 根据个人id查询不同的角色id
      this.$axios.get(`users/${info.id}`).then(res => {
        console.log(res)
        const { data, meta } = res
        if (meta.status === 200) {
          // 如果是新添加用户，默认没有角色，就是-1  如果为空 则显示placholder的内容
          // console.log(data.rid)
          this.form2.roleRid = data.rid === -1 ? '' : data.rid
        }
      })
      this.$axios.get('roles').then(res => {
        console.log(res)
        const { data, meta } = res
        if (meta.status === 200) {
          this.options = data
        } else {
          this.$message.error(meta.msg)
        }
      })
    },
    sureAssign () {
      // 先判断用户角色id是狗为''
      const { id, roleRid } = this.form2
      if (roleRid === '') {
        this.$message.warning('请选择用户角色')
      } else {
        this.$axios.put(`users/${id}/role`, {
          rid: roleRid
        }).then(res => {
          console.log(res)
          const { meta } = res
          if (meta.status === 200) {
            this.$message.success(meta.msg)
            this.getUserList()
            this.showEdit2 = false
          } else {
            this.$message.error(meta.msg)
          }
        })
      }
    },
    // 添加用户
    addUser () {
      this.showEdit3 = true
    },
    cancelAdd () {
      this.showEdit3 = false
      this.$refs.form3.resetFields()
    },
    sureAdd (info) {
      if (!this.regEmail.test(this.form3.email)) {
        this.$message.error('邮箱格式错误')
        return
      }
      if (!this.regMobile.test(this.form3.mobile)) {
        this.$message.error('请输入有效手机号')
        return
      }
      this.showEdit3 = false
      console.log(info)
      this.$axios.post('users', info).then(res => {
        console.log(res)
        const { meta } = res
        if (meta.status === 201) {
          // this.pagenum = 1
          // 跳转到当前页
          this.totalPage++
          this.pagenum = Math.ceil(this.totalPage / this.pagesize)
          this.getUserList()
          this.$message.success(meta.msg)
          this.$refs.form3.resetFields()
        } else {
          this.$message.warning(meta.msg)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 20px;
  .el-table-column {
  text-align: center;
  }
}
  .block {
    margin-top: 15px;
  }
  .search {
    width: 300px;
    margin-right: 10px;
    margin-top: 20px;
  }
  .line {
  position: absolute;
  width: 85%;
  height: 3px;
  background-color: #888;
  top: 125px;
  right: 12px;
}
.el-breadcrumb {
  padding-bottom: 10px;
  border-bottom: 1px solid #666;
}
</style>
<style lang="less">
 th,
 td {
   text-align: center !important;
 }
</style>
