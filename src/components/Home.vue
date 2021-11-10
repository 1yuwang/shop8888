<template>
    <el-container>
      <el-header>
        <div>
          <img src="../assets/logo.png" width="60">
          <span>后台管理系统</span>
        </div>
        <div>
          <el-button type="info" @click="loginOut">退出</el-button>
        </div>
      </el-header>
      <el-container>
        <el-aside :width="isCollapse ? '60px' : '200px'">
          <!-- 收起导航栏 -->
          <div @click="isCollapse=!isCollapse" style="color: #fff; background: rgb(74, 80, 100); cursor: pointer">|||</div>
          <el-menu
            :default-active="activePath"
            class="el-menu-vertical-demo"
            background-color="rgb(55, 61, 65)"
            text-color="#fff"
            avtive-text-color="#409eff"
            :unique-opened="true"
            :router="true"
            :collapse="isCollapse"
            :collapse-transition="false"
          >
            <el-sub-menu :index="item.id+ ''" v-for="item in menuList" :key="item.id">
              <template #title>
                <i :class="objIcon[item.id]" style="margin-right: 10px"></i>
                <span>{{item.authName}}</span>
              </template>
              <el-menu-item :index="'/' + item2.path"
                            v-for="item2 in item.children" 
                            :key="item2.id"
                            @click="changeActive('/' + item2.path)">
                <i class="el-icon-menu"></i>
                <span>{{item2.authName}}</span>
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
  export default {
    data() {
      return {
        menuList: [],
        // 匹配icon图标
        objIcon: {
          '125': 'iconfont icon-icon_user',
          '103': 'iconfont icon-shangpin',
          '101': 'iconfont icon-danju',
          '102': 'iconfont icon-tijikongjian',
          '145': 'iconfont icon-baobiao'
        },
        isCollapse: false,
        // 当前激活菜单的index值
        activePath: ''
      }
    },
    methods: {
      loginOut() {
        window.sessionStorage.removeItem('token');
        this.$router.push({
          name: 'Login'
        })
      },
      getMenuList() {
        this.$http.get('menus').then(res => {
          console.log(res)
          if(res.data.meta.status !== 200) this.$message.error('请求导航栏失败')
          this.menuList = res.data.data
        })
      },
      // 点击二级菜单激活当前的index值
      changeActive(path) {
        // 保存当前点击的path
        window.localStorage.setItem('path', path)
        this.activePath = path
      }

    },
    created() {
      this.getMenuList()
      this.activePath = window.localStorage.getItem('path');
    }
  }
</script>

<style scoped>
  .el-container {
    height:100%
  }
 .el-header {
    background: rgb(55, 61, 65);
    display: flex;
    justify-content:space-between;
    color: #fff;
    font-size: 22px;
    line-height: 56px
 }

 .el-header img{
   vertical-align: middle;
 }

  .el-aside {
    background: rgb(51, 55, 68);
  }

  .el-main {
    background: rgb(234, 237, 241);
  }
</style>