<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 10px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <h1>该模块暂未开通</h1>
      <!-- <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>-->
      <!-- 树形表格组件 :data="categoriesList" :columns="columns" show-header show-index index-text="#" -->
      <!-- <tree :data="categoriesList" :columns="columns" show-header show-index index-text="#"></tree> -->
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // // 保存商品分类信息
      // categoriesList: [],
      // // 绑定各列数据
      // columns: [
      //   {
      //     lable: '分类名称',
      //     props: 'cat_name'
      //   }
      // ]
    }
  },
  methods: {
    // 获取商品分类信息
    // getCategoriesList() {
    //   this.$http.get('categories').then(res => {
    //     console.log(res)
    //     this.categoriesList = res.data.data
    //   })
    // }
  },
  created() {
    // this.getCategoriesList()
  }

}
</script>

<style scoped>
</style>