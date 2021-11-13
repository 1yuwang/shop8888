<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" style="margin-bottom: 10px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rolesList" border style="width: 100%; margin: 10px 0" width="180">
        <el-table-column type="expand">
          <template #default="props">
            <el-row
              :class="['border-bd', index1 === 0 ? 'border-bt' : '']"
              v-for="(item1, index1) in props.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="10">
                <el-tag closable>{{ item1.authName }}</el-tag>
              </el-col>
              <!-- 渲染二级 三级权限 -->
              <el-col :span="14">
                <el-row class="border-bd" v-for="item2 in item1.children" :key="item2.id">
                  <el-col :span="5">
                    <el-tag type="success" closable>{{ item2.authName }}</el-tag>
                  </el-col>
                  <el-col :span="19">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                    >{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" />
        <el-table-column prop="roleName" label="角色名称" width="180" />
        <el-table-column prop="roleDesc" label="角色描述" width="180" />
        <el-table-column label="操作">
          <template #default="props">
            <el-button type="primary" size="mini">编辑</el-button>
            <el-button type="danger" size="mini">删除</el-button>
            <el-button type="warning" size="mini" @click="showRights(props.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限dialog -->
    <el-dialog title="分配权限" v-model="rightsDialogVisible" width="30%" @close="closeRightsDialog">
      <!--树形控件 -->
      <el-tree
        :data="rightsList"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="showCheckArr"
        :props="rightsProps"
        ref="treeRights"
      />

      <span slot="footer" class="dialog-footer">
        <el-button @click="rightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// function fun(ele, arr) {
//   if (!ele.children) {
//     return arr.push(ele.id)
//   }
//   // 递归
//   ele.children.forEach(item => fun(item, arr))
// }
export default {
  data() {
    return {
      rolesList: [],
      // 控制分配权限dialog显示/隐藏
      rightsDialogVisible: false,
      // 存储所有的权限
      rightsList: [],
      // 展示选中的权限选项
      showCheckArr: [],
      // 属性选项
      rightsProps: {
        label: 'authName',
        children: 'children'
      },
      // 保存此时角色id
      roleId: ''
    }
  },
  methods: {
    // 获取角色列表
    getRolesList() {
      this.$http.get('roles').then(res => {
        this.rolesList = res.data.data
      })
    },
    // 点击分配权限按钮 弹出dialog对话框
    showRights(role) {
      // 保存角色id
      this.roleId = role.id
      // 请求后台接口,获取所有权限
      this.$http.get('rights/tree').then(res => {
        console.log(res)
        this.rightsList = res.data.data;
      })
      //把获取的权限用树形控件展示到dialog对话框
      // 把此时角色所拥有权限全部展示出来，:default-checked-keys
      // 把当前的角色放到getCheckedNodes中去递归循环，把得到的节点id放到showCheckArr数组中
      this.getCheckedNodes(role, this.showCheckArr)
      // 展示dialog对话框
      this.rightsDialogVisible = !this.rightsDialogVisible;
    },
    getCheckedNodes(role, arr) {
      if (!role.children) {
        return arr.push(role.id)
      }
      // 递归h
      role.children.forEach(item => this.getCheckedNodes(item, arr))
    },
    // 关闭分配权限dialog对话框时，上一次存放的节点id清空
    closeRightsDialog() {
      this.showCheckArr = []
    },
    // 点击确认按钮， 发送后台数据， 分配权限
    setRights() {
      // console.log(this.$refs.treeRights.getCheckedKeys())
      // console.log(this.$refs.treeRights.getHalfCheckedNodes())
      // 获取所有的全选节点id和半选节点id，并合并到一个数组
      let arrCheckAllKeys = [...this.$refs.treeRights.getCheckedKeys(), ...this.$refs.treeRights.getHalfCheckedNodes()].join(',')
      console.log(arrCheckAllKeys)
      this.$http.post(`roles/${this.roleId}/rights`, { rids: arrCheckAllKeys }).then(res => {
        console.log(res)
        if (res.data.meta.status !== 200) return

        //刷新角色列表
        this.getRolesList()
      })
      this.rightsDialogVisible = !this.rightsDialogVisible;
    }

  },
  created() {
    this.getRolesList()
  }
}
</script>

<style scoped>
.border-bd {
  border-bottom: 1px solid #ddd;
}

.el-row {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.border-bt {
  border-top: 1px solid #ddd;
}
</style>
