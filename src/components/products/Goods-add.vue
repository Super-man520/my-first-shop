<template>
  <div class="goods-add">
    <!-- 进度条 -->
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
     </el-steps>
     <el-button type="success" style="margin-top: 20px" @click="nextStep" ref="nextBtn">下一步</el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0
    }
  },
  methods: {
    nextStep () {
      this.active++
      if (this.active > 1) {
        this.$refs.nextBtn.$el.innerText = '提交'
      }
    }
  }
}
</script>

<style lang="less" scoped>
 .goods-add {
   width: 100%;
   height: 100%;
   background-color: #fff;
 }
</style>
