<template>
  <div class="goods-add">
    <!-- 进度条 -->
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
     </el-steps>
     <!-- tab栏   tab-click  tab被选中时触发-->
    <el-tabs tab-position="left" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="1">
        <el-form ref="form" :model="form" label-width="80px" :rules="rules" status-icon>
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="form.goods_name" placeholder="请输入商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="form.goods_price" placeholder="请输入商品价格"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="form.goods_weight" placeholder="请输入商品重量"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="form.goods_number" placeholder="请输入商品数量"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" >
            <div class="block">
              <el-cascader
                :props="props"
                v-model="form.goods_cat"
                :options="options"></el-cascader>
            </div>
          </el-form-item>
        </el-form>
        <el-button type="success" style="margin-top: 20px" @click="nextStep1">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="2">
        <el-upload
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          name="file"  multiple show-file-list :on-success="successUpload"
          :headers="headers">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <el-button type="success" style="margin-top: 20px" @click="nextStep2">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="3">
         <quill-editor v-model="form.goods_introduce"></quill-editor>
         <el-button type="success" style="margin-top: 20px" @click="addGoods">添加</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      active: 0,
      activeName: '1',
      form: {
        goods_name: '',
        goods_cat: [], // goods_cat给级联数据绑定
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: []
      },
      dialogImageUrl: '',
      dialogVisible: false,
      headers: {
        Authorization: localStorage.getItem('token')
      },
      rules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: ['blur', 'change'] }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: ['blur', 'change'] }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: ['blur', 'change'] }
        ],
        goods_number: [
          { required: true, message: '请输入商品分类', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    this.$axios.get('categories?type=3').then(res => {
      console.log(res)
      const { meta, data } = res
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.options = data
      } else {
        this.$message.error(meta.msg)
      }
    })
  },
  methods: {
    nextStep1 () {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.$message.warning('请输入完整内容')
        } else {
          this.active++
          this.activeName = this.active + 1 + ''
          // if (this.active > 1) {
          //   this.$refs.nextBtn.$el.innerText = '提交'
          // }
        }
      })
    },
    nextStep2 () {
      if (this.form.pics.length <= 0) {
        this.$message.error('请上传照片')
      } else {
        this.active++
        this.activeName = this.active + 1 + ''
      }
    },
    // tab切换
    handleClick (tab) {
      // console.log(tab)
      this.active = +tab.index
    },
    // 图片上传
    handleRemove (file, fileList) {
      console.log(file, fileList)
      const filePath = file.response.data.tmp_path
      // 删除数组
      this.form.pics = this.form.pics.filter(item => item.pic !== filePath)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    successUpload (response, file, fileList) {
      // console.log(response)
      const { data, meta } = response
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.form.pics.push({
          pic: data.tmp_path
        })
        console.log(this.form.pics)
      } else {
        this.$message.error(meta.msg)
      }
      // console.log(file)
    },
    addGoods () {
      if (this.form.goods_introduce.trim().length === 0) {
        this.$message.error('请输入商品描述')
      } else {
        this.$axios.post('goods', {
          ...this.form,
          goods_cat: this.form.goods_cat.join(',')
        }).then(res => {
          console.log(res)
          const { meta } = res
          if (meta.status === 201) {
            this.$router.push('/goods')
            this.$message.success(meta.msg)
          } else {
            this.$message.error(meta.msg)
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
 .goods-add {
  //  width: 100%;
   height: 100%;
   background-color: #fff;
   .el-tabs {
     margin-top: 20px;
     .el-form {
       padding-right: 30px;
     }
   }
 }
 .quill-editor {
  background-color: #fff;
  ::v-deep .ql-editor {
    min-height: 300px;
  }
}
</style>
