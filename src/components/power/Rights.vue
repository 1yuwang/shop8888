<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" style="margin-bottom: 10px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-table :data="rightsList" border style="width: 100%; margin: 10px 0">
        <el-table-column type="index" />
        <el-table-column prop="authName" label="权限名称" width="180" />
        <el-table-column prop="path" label="路径" />
        <el-table-column prop="level" label="权限等级">
          <template #default="props">
            <el-tag v-if="props.row.level == - '0'">一级</el-tag>
            <el-tag v-else-if="props.row.level === '1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: []
    }
  },
  methods: {
    // 获取权限列表
    getRightsList() {
      this.$http.get('rights/list').then(res => {
        this.rightsList = res.data.data;
      })
    }
  },
  created() {
    this.getRightsList()
  }
}
</script>

<style scoped>
</style>