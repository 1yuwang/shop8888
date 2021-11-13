<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 10px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card align="left">
      <!-- 消息提示 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" show-icon></el-alert>
      <p>
        选择商品分类:
        <el-cascader
          v-model="value"
          :options="getCategosList"
          :props="cateProps"
          @change="handleChange"
          placeholder="请选择"
        ></el-cascader>
      </p>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary">添加参数</el-button>
          <br />
          <el-table :data="manyArr" border style="width: 100%">
            <el-table-column type="expand" />
            <el-table-column type="index" />
            <el-table-column prop="attr_name" label="参数名称" />
            <el-table-column prop="address" label="操作">
              <template #default="props">
                <el-button type="primary">编辑</el-button>
                <el-button type="warning">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button type="primary">添加参数</el-button>
          <br />
          <el-table :data="onlyArr" border style="width: 100%">
            <el-table-column type="expand" />
            <el-table-column type="index" />
            <el-table-column prop="attr_name" label="参数名称" />
            <el-table-column prop="address" label="操作">
              <template #default="props">
                <el-button type="primary">编辑</el-button>
                <el-button type="warning">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 保存分类列表
      getCategosList: [],
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 当前选择分类的id列表
      value: [],
      // 此时选中的tabs值 many or only
      activeName: 'many',
      // 存储动态参数
      manyArr: [],
      // 存储静态参数
      onlyArr: []
    }
  },
  methods: {
    // 获取分类列表
    getCategoryList() {
      this.$http.get('categories').then(res => {
        this.getCategosList = res.data.data
      })
    },
    // 当选择分类的时候触发
    handleChange() {
      // console.log(this.value)
      // 发送后台请求，获取当前的静态参数或者动态参数
      this.$http.get(`categories/${this.value[this.value.length - 1]}/attributes`, { params: { sel: this.activeName } }).then(res => {
        if (this.activeName === 'many') {
          this.manyArr = res.data.data
        } else if (this.activeName === 'only') {
          this.onlyArr = res.data.data
        }
      })
    },
    // 切换tabs栏， 改变activeName
    handleClick() {
      // console.log(this.activeName)
      this.handleChange()
    }
  },
  created() {
    this.getCategoryList()
  }
  // mounted() {
  //   this.getCategorys()
  // }
}
</script>

<style scoped>
</style>