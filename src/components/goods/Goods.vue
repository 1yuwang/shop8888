<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 10px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card align="left">
      <!-- 搜索头部input框 -->
      <el-row :gutter="15">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable
            @clear="getGoodsList"
          >
            <template #append>
              <el-button @click="getGoodsList">搜索</el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" @click="targetAdd">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" border style="width: 100%">
        <el-table-column type="index" />
        <el-table-column prop="goods_name" label="商品名称" width="515" />
        <el-table-column prop="goods_price" label="商品价格" width="100" />
        <el-table-column prop="goods_weight" label="商品重量" width="100" />
        <el-table-column prop="add_time" label="创建时间" width="150">
          <template #default="props">{{ showDate(props.row.add_time) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="170">
          <template #default="props">
            <el-button type="primary" size="mini">编辑</el-button>
            <el-button type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:currentPage="queryInfo.pagenum"
        :page-sizes="[100, 200, 400, 600]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { formatDate } from '../../common/utils.js'
export default {
  data() {
    return {
      value: '',
      // 请求商品列表参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 保存商品列表数据
      goodsList: [],
      total: 0
    }
  },
  methods: {
    // 获取商品列表数据
    getGoodsList() {
      this.$http.get('goods', { params: this.queryInfo }).then(res => {
        this.goodsList = res.data.data.goods;
        this.total = res.data.data.total
      })
    },
    // 当前页面发生改变触发
    handleCurrentChange(newnum) {
      this.queryInfo.pagenum = newnum;
      this.getGoodsList()
    },
    // 当页面数据个数发生改变触发
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getGoodsList()
    },
    showDate(value) {
      let date = new Date(value * 1000);
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    },
    targetAdd() {
      this.$router.push({
        name: 'AddGoods'
      })
    }

  },
  created() {
    this.getGoodsList()
  },





}
</script>

<style scoped>
</style>