<template>
  <div class="goods">
    <el-button type="success" plain native-type="submit" @click="goGoodsAdd">
      <!-- <router-link to="/goods-add">添加商品</router-link> -->
      添加商品
    </el-button>
  <el-table :data="goodsList" stripe style="width: 100%" size="medium">
    <el-table-column type="index" label="序号" width="200"></el-table-column>
    <el-table-column prop="goods_name" label="商品名称" width="200"></el-table-column>
    <el-table-column prop="goods_price" label="商品价格" width="200"></el-table-column>
    <el-table-column prop="goods_weight" label="商品重量" width="200"></el-table-column>
    <el-table-column label="创建时间" width="200">
      <template v-slot:default="{row}">
         {{row.add_time|timer}}
      </template>
    </el-table-column>
    <el-table-column prop="handle" label="操作">
      <template v-slot:default="{row}">
        <el-row>
           <el-button type="primary" icon="el-icon-edit" plain size="small" @click="showEdit(row)"></el-button>
           <el-button type="success" icon="el-icon-delete" plain size="small" @click="suredelete(row)"></el-button>
        </el-row>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <!-- pagesize每页的个数 current-page当前页-->
   <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum"
       :page-sizes="[2, 4, 6, 8]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalPage">
      </el-pagination>
    </div>
    <!-- 编辑显示的框 -->
    <el-dialog title="编辑商品" :visible.sync="showEditGoods" width="30%">
       <el-form :model="form" ref="form" label-width="100px" status-icon size="small" :rules="rules">
         <el-form-item label="商品名称" prop="goods_name">
           <el-input v-model="form.goods_name" autocomplete="off"></el-input>
        </el-form-item>
         <el-form-item label="商品价格" prop="goods_price">
           <el-input v-model="form.goods_price" autocomplete="off"></el-input>
        </el-form-item>
         <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="form.goods_weight" autocomplete="off"></el-input>
        </el-form-item>
    </el-form>
     <div slot="footer" class="dialog-footer">
      <el-button @click="showEditGoods = false">取 消</el-button>
       <el-button type="primary" @click="sureEditGoods">确 定</el-button>
     </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // pagenum当前页码  pagesize每页显示条数  totalPage总页数
      type: 1,
      pagenum: 1,
      pagesize: 6,
      totalPage: null,
      goodsList: [],
      // formLabelWidth: '120px',
      showEditGoods: false,
      form: {
        goods_name: '',
        goods_price: '',
        goods_weight: ''
      },
      rules: {
        goods_name: [
          { required: true, message: '请输入争取内容', trigger: ['blur', 'change'] },
          { min: 6, max: 22, message: '长度在6 ~ 22个字符之间', trigger: ['blur', 'change'] }
        ],
        goods_price: [
          { required: true, message: '请输入争取内容', trigger: ['blur', 'change'] },
          { min: 6, max: 22, message: '长度在6 ~ 22个字符之间', trigger: ['blur', 'change'] }
        ],
        goods_weight: [
          { required: true, message: '请输入争取内容', trigger: ['blur', 'change'] },
          { min: 6, max: 22, message: '长度在6 ~ 22个字符之间', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    getGoodsList () {
      this.$axios.get('goods', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      }).then(res => {
        console.log(res)
        const { data, meta } = res
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.totalPage = data.total
          this.goodsList = data.goods
        }
      })
    },
    // 分页
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.getGoodsList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getGoodsList()
    },
    // 跳转到goodsAdd
    goGoodsAdd () {
      this.$router.push('/goods-add')
    },
    // 弹出确定删除框
    suredelete (info) {
      // console.log(+Date.now())
      this.$confirm('此操作将永久删除，切不可恢复', '温馨提示', {
        type: 'error'
      }).then(() => {
        console.log(info.goods_id)
        this.$message.success('删除成功')
      }).catch(() => {
        this.$message.warning('内部错误')
      })
    },
    // 显示编辑框
    showEdit (info) {
      this.showEditGoods = true
      this.form.goods_name = info.goods_name
      this.form.goods_price = info.goods_price
      this.form.goods_weight = info.goods_weight
    },
    sureEditGoods () {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.$message.warning('修改错误')
        } else {
          this.showEditGoods = false
          this.$message.success('修改成功')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
    margin-top: 15px;
  }
.block {
  margin-top: 10px;
}
</style>
<style lang="less">
// .el-button[data-v-41e5e856] a{
//     color: #67C23A;
//     border-color: #c2e7b0;
//     display: block;
// }
// .el-button--success.is-plain:hover a {
//   color: #fff;
// }
</style>
