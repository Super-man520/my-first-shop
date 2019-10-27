<template>
  <div class="goods">
    <el-button type="success" plain>添加商品</el-button>
  <el-table :data="goodsList" stripe style="width: 100%" size="medium">
    <el-table-column type="index" label="序号" width="200"></el-table-column>
    <el-table-column prop="goods_name" label="商品名称" width="200"></el-table-column>
    <el-table-column prop="goods_price" label="商品价格" width="200"></el-table-column>
    <el-table-column prop="goods_weight" label="商品重量" width="200"></el-table-column>
    <el-table-column prop="add_time" label="创建时间" width="200"></el-table-column>
    <el-table-column prop="handle" label="操作">
      <template v-slot:default="{row}">
        <el-row>
           <el-button type="primary" icon="el-icon-edit" plain size="small"></el-button>
           <el-button type="success" icon="el-icon-delete" plain size="small"></el-button>
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
      goodsList: []
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
