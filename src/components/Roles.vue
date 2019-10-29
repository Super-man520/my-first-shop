<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- <span class="line"></span> -->
    <!-- 添加角色 -->
    <el-button plain type="success" class="add-role" @click="addRole">添加角色</el-button>
    <!-- 表格 -->
    <!-- 通过 data 属性注入数组, prop 定义键名 label定义列名 stripe可以创建带斑马纹的表格-->
    <!-- 设置type="expand" he scoped slot可以开启展开行功能 -->
    <el-table :data="roleList" stripe style="width: 100%">
    <el-table-column type="expand" width="120">
     <template v-slot:default="{ row }">
       <span v-if="row.children.length===0">暂无权限</span>
       <!-- 栅格系统el-row每一行 el-col代表竖行 共24份-->
       <!-- {{row}} -->
       <!-- 第一层 -->
       <el-row v-for="level1 in row.children" :key="level1.id" class="level1">
          <el-col :span="4"><el-tag type="success" closable @close="delTag(row,level1.id)">
            {{level1.authName}}</el-tag>
          </el-col>
          <el-col :span="20">
            <!-- 第二层 -->
            <el-row v-for="level2 in level1.children" :key="level2.id" class="level2">
              <el-col :span="4">
                <el-tag type="warning" closable @close="delTag(row,level2.id)">
               {{level2.authName}}</el-tag>
              </el-col>
              <el-col :span="20">
                <!-- 第三层 -->
                  <el-col :span="4" v-for="level3 in level2.children" :key="level3.id" class="level3"><el-tag type="danger" closable @close="delTag(row,level3.id)">
                   {{level3.authName}}</el-tag></el-col>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
     </template>
    </el-table-column>
    <el-table-column type="index" width="120"></el-table-column>
    <el-table-column prop="roleName" label="角色名称" width="200"></el-table-column>
    <el-table-column prop="roleDesc" label="描述" width="200"></el-table-column>
    <el-table-column prop="handle" label="操作">
      <template v-slot:default="{row}">
       <el-row>
          <el-button type="primary" icon="el-icon-edit" plain @click="showEdit(row)" size="small"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain @click="deleteUser(row)" size="small"></el-button>
          <el-button type="success" icon="el-icon-check" plain @click="showAssigning(row)" size="small">分配角色</el-button>
       </el-row>
       </template>
    </el-table-column>
  </el-table>
  <!-- 添加角色的弹出框 -->
  <el-dialog title="添加角色" :visible.sync="showAddRole" width="30%">
  <el-form :model="form" status-icon :rules="rules" ref="form">
    <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
      <el-input v-model="form.roleName" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="角色描述" :label-width="formLabelWidth" prop="roleDesc">
      <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="cancelAddRole">取 消</el-button>
    <el-button type="primary" @click="sureAddRole(form)">确 定</el-button>
  </div>
  </el-dialog>
  <!-- 修改角色弹出框 -->
  <el-dialog title="修改角色" :visible.sync="editRole" width="30%">
    <el-form :model="form2" :rules="rules" status-icon ref="form2">
      <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
         <el-input v-model="form2.roleName" autocomplete="off"></el-input>
      </el-form-item>
       <el-form-item label="角色描述" :label-width="formLabelWidth" prop="roleDesc">
         <el-input v-model="form2.roleDesc" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="cancelEditRole">取 消</el-button>
    <el-button type="primary" @click="sureEditRole(form2)">确 定</el-button>
  </div>
</el-dialog>
<!-- 分配权限的弹出框 -->
<el-dialog title="分配权限" :visible.sync="assigningUser" width="30%">
  <span>这是一段信息</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="assigningUser = false">取 消</el-button>
    <el-button type="primary" @click="assigningUser = false">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
// import axios from 'axios'
export default {
  data () {
    return {
      roleList: [],
      showAddRole: false,
      editRole: false,
      assigningUser: false,
      form: {
        roleName: '',
        roleDesc: ''
      },
      form2: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      formLabelWidth: '120px',
      rules: {
        roleName: [
          { required: true, message: '请输入活动名称', trigger: ['blur', 'change'] },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: ['blur', 'change'] }
        ],
        roleDesc: [
          { required: true, message: '请输入活动名称', trigger: ['blur', 'change'] },
          { min: 6, max: 28, message: '长度在 6 到 28 个字符', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    getRolesList () {
      // var $url = `http://localhost:8888/api/private/v1/roles`
      this.$axios.get('roles', {
        // `headers` 是即将被发送的自定义请求头
        // headers: {
        //   // 需将token一起发送
        //   Authorization: localStorage.getItem('token')
        // }
      }).then(res => {
        const { data, meta } = res
        console.log(data, meta)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.roleList = data
        } else {
          this.$message.warning(meta.msg)
        }
      })
    },
    // 删除标签
    delTag (row, rightId) {
      console.log(row)
      const roleId = row.id
      console.log(roleId, rightId)
      this.$axios.delete(`roles/${roleId}/rights/${rightId}`).then(res => {
        console.log(res)
        const { data, meta } = res
        if (meta.status === 200) {
          this.$message.warning(meta.msg)
          // 这里不需要更新列表，只需要更新表格内容即可   后台返回了数据因此不需要发送axios
          row.children = data
          // this.getRolesList()
        } else {
          this.$message.error(meta.msg)
        }
      })
    },
    // 弹出添加
    addRole () {
      this.showAddRole = true
    },
    // 确定添加
    sureAddRole (form) {
      console.log(form)
      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.$message.error('错误警告')
        } else {
          this.$axios.post('roles', this.form).then(res => {
            console.log(res)
            const { meta } = res
            if (meta.status === 201) {
              this.$message.success('添加成功')
              // this.$refs.form.resetFields()
              this.showAddRole = false
              this.getRolesList()
            } else {
              this.$message.error(meta.msg)
            }
          })
        }
      })
    },
    // 取消添加
    cancelAddRole () {
      this.showAddRole = false
      this.$message.warning('取消添加')
      this.$refs.form.resetFields()
    },
    // 显示修改角色框
    showEdit (info) {
      this.editRole = true
      this.form2.id = info.id
      this.form2.roleName = info.roleName
      this.form2.roleDesc = info.roleDesc
      console.log(this.form2.id)
    },
    cancelEditRole () {
      this.editRole = false
      this.$refs.form2.resetFields()
    },
    sureEditRole (formInfo) {
      console.log(formInfo)
      const { id } = this.form2
      this.$refs.form2.validate((valid) => {
        if (!valid) {
          this.$message.error('修改错误，请重试')
        } else {
          this.$axios.put(`roles/${id}`, this.form2).then(res => {
            console.log(res)
            const { meta } = res
            if (meta.status === 200) {
              this.$message.success(meta.msg)
              this.editRole = false
              this.getRolesList()
            }
          })
        }
      })
    },
    // 删除角色
    deleteUser (info) {
      this.$confirm('此操作将会删除此项内容', '温馨提示', {
        type: 'warning'
      }).then(() => {
        // console.log(info.id)
        this.$axios.delete(`roles/${info.id}`).then(res => {
          console.log(res)
          const { meta } = res
          if (meta.status === 200) {
            this.$message.success('操作成功')
            this.getRolesList()
          } else {
            this.$message.error(meta.msg)
          }
        })
      }).catch(() => {
        this.$message.error('操作取消')
      })
    },
    // 显示分配权限的框
    showAssigning (info) {
      console.log(info)
      this.assigningUser = true
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
  margin: 16px 0 16px;
}
.el-breadcrumb {
  padding-bottom: 10px;
  border-bottom: 1px solid #666;
}
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .level1 {
    padding-bottom: 10px;
    border-bottom: 1px dotted #e92322;
  }
  .level3 {
    margin-bottom: 10px;
  }
</style>
