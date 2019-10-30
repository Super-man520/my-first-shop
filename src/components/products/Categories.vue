<template>
<div class="categories">
  <el-button type="success" plain @click="showAddCategories">添加分类</el-button>
  <!-- 表格 -->
    <el-table :data="categoriesList" style="width: 100%" row-key="cat_id" border
     :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 1)">
    <el-table-column prop="cat_name" label="分类名称" width="220"></el-table-column>
    <el-table-column label="是否有效" width="220">
       <template v-slot:default="{row}">
         <span v-if="row.cat_deleted===false">是</span>
         <span v-else>否</span>
      </template>
    </el-table-column>
    <el-table-column prop="cat_level" label="排序" width="220"> </el-table-column>
    <el-table-column label="操作" prop="handle">
      <template v-slot:default="{row}">
      <el-row>
        <el-button type="primary" icon="el-icon-edit" circle plain size="small" @click="showCategories(row)"></el-button>
        <el-button type="danger" icon="el-icon-delete" circle plain size="small" @click="delCategories(row)"></el-button>
      </el-row>
      </template>
    </el-table-column>
  </el-table>
   <!-- 分页标签 -->
   <div class="block">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum"
      :page-sizes="[3, 6, 9, 12]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalPage">
    </el-pagination>
  </div>
  <!-- 显示编辑的框 -->
  <el-dialog title="编辑分类" :visible.sync="editCategories" width="30%">
  <el-form :model="form" ref="form" :rules="rules" status-icon >
    <el-form-item label="分类名称" :label-width="formLabelWidth" prop="cat_name">
      <el-input v-model="form.cat_name" autocomplete="off"></el-input>
    </el-form-item>
     <el-form-item label="是否有效" :label-width="formLabelWidth">
      <el-button disabled type="success">{{form.isDelete}}</el-button>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="editCategories = false">取 消</el-button>
    <el-button type="primary" @click="sureEditCategories">确 定</el-button>
   </div>
  </el-dialog>
  <!-- 添加分类框 -->
  <el-dialog title="添加分类" :visible.sync="addCategories" width="30%">
  <el-form :model="form2" ref="form2" :rules="rules" status-icon>
    <el-form-item label="分类名称" :label-width="formLabelWidth" prop="cat_name">
      <el-input v-model="form2.cat_name" autocomplete="off"></el-input>
    </el-form-item>
     <el-form-item label="父级名称" :label-width="formLabelWidth">
        <div class="block">
          <!-- option指定数据  props指定value label    clearable输入框可清空-->
           <el-cascader v-model="form2.cat_pid" :options="options" @change="handleChange" :props="props" clearable></el-cascader>
        </div>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="addCategories = false">取 消</el-button>
    <el-button type="primary" @click="sureAddCategories">确 定</el-button>
   </div>
  </el-dialog>
</div>
</template>
<script>
export default {
  data () {
    return {
      options: [],
      props: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        checkStrictly: true
      },
      loading: false,
      // pagenum 当前页  pagesize每页个数   totalPage总页数
      categoriesList: [],
      type: 3,
      pagenum: 1,
      pagesize: 3,
      totalPage: null,
      id: '',
      formLabelWidth: '120px',
      editCategories: false,
      addCategories: false,
      form: {
        cat_name: '',
        isDelete: ''
      },
      form2: {
        cat_name: '',
        cat_pid: []
        // cat_level: 1
      },
      rules: {
        cat_name: [
          { required: true, message: '此项必填', trigger: ['blur', 'change'] },
          { min: 6, max: 20, message: '字符6~20之间', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    this.getCategoriesList()
  },
  methods: {
    getCategoriesList () {
      this.loading = true
      this.$axios.get('categories', {
        params: {
          type: this.type,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      }).then(res => {
        console.log(res)
        const { data, meta } = res
        if (meta.status === 200) {
          this.loading = false
          this.categoriesList = data.result
          this.options = data.result
          this.$message.success(meta.msg)
          this.totalPage = data.total
          // this.children = data.result.children
        } else {
          this.$message.error(meta.msg)
        }
      })
    },
    // 分页
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.getCategoriesList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getCategoriesList()
    },
    // 显示添加分类
    showAddCategories () {
      this.addCategories = true
    },
    handleChange (val) {
      console.log(val)
      // 分类父id
      this.id = val[0]
      console.log(this.id)
    },
    sureAddCategories () {
      console.log(this.id)
      this.$refs.form2.validate((valid) => {
        if (!valid) {
          this.$message.error('添加失败')
        } else {
          // const cat_level = 1
          this.$axios.post(`categories`, {
            cat_pid: this.id,
            cat_name: this.form2.cat_name,
            // cat_level: this.form2.cat_level
            cat_level: 1
          }).then(res => {
            console.log(res)
            const { meta } = res
            if (meta.status === 201) {
              this.$message.success(meta.msg)
              this.getCategoriesList()
              this.addCategories = false
            } else {
              this.$message.error(meta.msg)
            }
          })
        }
      })
    },
    // 显示编辑框
    showCategories (info) {
      console.log(info)
      this.form.isDelete = info.cat_deleted ? '否' : '是'
      this.editCategories = true
      this.id = info.cat_id
      this.form.cat_name = info.cat_name
    },
    sureEditCategories () {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.$message.error('内部错误')
        } else {
          this.$axios.put(`categories/${this.id}`, this.form).then(res => {
            console.log(res)
            const { meta } = res
            if (meta.status === 200) {
              this.$message.success(meta.msg)
              this.getCategoriesList()
              this.editCategories = false
            } else {
              this.$message.error(meta.msg)
            }
          })
        }
      })
    },
    // 删除分类
    delCategories (info) {
      this.$confirm('你确定要删除么?此操作不可修复', '温馨提示', {
        type: 'success'
      }).then(() => {
        this.$axios.delete(`/categories/${info.cat_id}`).then(res => {
          const { meta } = res
          if (meta.status === 200) {
            this.$message.success(meta.msg)
            if (this.pagenum > 1 && this.categoriesList.length === 1) {
              this.pagenum--
            }
            this.getCategoriesList()
          } else {
            this.$message(meta.msg)
          }
        })
      }).catch(() => {
        this.$message.error('内部错误')
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .el-table {
    margin: 10px 0;
  }
</style>
