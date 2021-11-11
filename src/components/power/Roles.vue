<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" style="margin-bottom: 10px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rolesList" border style="width: 100%; margin: 10px 0">
        <el-table-column type="expand" />
        <el-table-column type="index" />
        <el-table-column prop="roleName" label="角色名称" width="180" />
        <el-table-column prop="roleDesc" label="角色描述" width="180" />
        <el-table-column>
          <!-- <template #default="props">
            <el-tag v-if="props.row.level == - '0'">一级</el-tag>
            <el-tag v-else-if="props.row.level === '1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>-->
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: []
    }
  },
  methods: {
    // 获取角色列表
    getRolesList() {
      this.$http.get('roles').then(res => {
        console.log(res)
        this.rolesList = res.data.data
      })
    },

  },
  created() {
    this.getRolesList()
  }
}
</script>

<style scoped>
</style>