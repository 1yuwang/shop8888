<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 10px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card align="left">
      <el-alert title="添加商品" type="info" center show-icon></el-alert>
      <!-- /步骤条 -->
      <el-steps :space="200" :active="activeName * 1" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="动态参数"></el-step>
        <el-step title="静态参数"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tabs选项卡 -->
      <el-form v-model="addForm" ref="addFormRef" :rules="addFormRul">
        <el-tabs
          tab-position="left"
          v-model="activeName"
          :before-leave="beforeLeave"
          @tab-click="changeTabs"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number" min="0"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number" min="0"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number" min="0"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                :options="categoryList"
                v-model="addForm.goods_cat"
                :props="cateProps"
                @change="cateChange"
                placeholder="请选择商品"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="动态参数" name="1">
            <el-form-item v-for="item in manyArr" :label="item.attr_name" :ket="item.car_id">
              <el-checkbox-group v-model="attrVals">
                <el-checkbox :label="val" v-for="(val, i) in attrVals" :key="i" :border="true" />
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="静态参数" name="2">
            <el-form-item v-for="item in onlyArr" :label="item.attr_name" :ket="item.car_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="avatar-uploader"
              :action="url"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture-card"
              :headers="uploadHeader"
            >
              <div
                style="height: 100%; display: flex; align-items:center; justify-content: center"
              >点击上传</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品描述" name="4">商品描述</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 预览图片dialog对话框 -->
    <el-dialog v-model="preVisible" width="80%">
      <img :src="preViewUrl" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        // 存放图片
        pics: []
      },
      // 商品验证规则
      addFormRul: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请输入选择商品分类', trigger: 'blur' }],
      },
      // 保存当前商品分类
      categoryList: [],
      cateProps: {
        label: 'cat_name',
        children: 'children',
        value: "cat_id",
        checkStrictly: true
      },
      // 动态参数数据
      manyArr: [],
      attrVals: [],
      // 静态参数数据
      onlyArr: [],
      // 上传图片地址
      url: "http://127.0.0.1:8888/api/private/v1/upload",
      // 设置上传时的请求头
      uploadHeader: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览图片地址
      preViewUrl: '',
      preVisible: false

    }
  },
  methods: {
    // 获取所有的商品分类
    getCategories() {
      this.$http.get('categories').then(res => {
        this.categoryList = res.data.data
      })
    },
    // 当分类级联选择框发生变化触发
    cateChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // 当切换到下一个tabs选项之前触发
    beforeLeave(activeName, oldActiveName) {
      // if (oldActiveName == '0') {
      //   if (this.addForm.goods_cat.length == []) {
      //     this.$message.error('请选择商品分类');
      //     return false
      //   } else if (this.addForm.goods_name == '') {
      //     this.$message.error('请输入商品名称');
      //     return false
      //   } else if (this.addForm.goods_price == '') {
      //     this.$message.error('请选择商品价格');
      //     return false
      //   } else if (this.addForm.goods_weight == '') {
      //     this.$message.error('请选择商品重量');
      //     return false
      //   } else if (this.addForm.goods_number == '') {
      //     this.$message.error('请选择商品数量');
      //     return false
      //   }
      // }
    },
    // 切换tabs面板的时候触发
    changeTabs() {
      if (this.activeName == '1') {
        // 如果切换到动态参数面板,请求动态参数数据
        this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`, { params: { sel: 'many' } }).then(res => {
          // console.log(res)
          this.manyArr = res.data.data;
          this.attrVals = res.data.data[0].attr_vals.split(',');
        })
      } else if (this.activeName == '2') {
        // 如果切换到静态参数面板,请求静态参数数据
        this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`, { params: { sel: 'only' } }).then(res => {
          console.log(res)
          this.onlyArr = res.data.data;
          // this.attrVals = res.data.data[0].attr_vals.split(',');
        })
      }
    },
    // 预览图片钩 子
    handlePreview(file) {
      // console.log(file);
      this.preViewUrl = file.response.data.url;
      this.preVisible = !this.preVisible
    },
    // 删除图片钩子
    handleRemove(file) {
      var index = this.addForm.pics.findIndex(el => el.img == file.response.data.tmp_path);
      this.addForm.pics.splice(index, 1)
    },
    // 上传成功的钩子
    handleSuccess(file) {
      // console.log(file);
      this.addForm.pics.push({ img: file.data.tmp_path });
      // console.log(this.addForm.pics);
    }
  },
  created() {
    this.getCategories()
  }

}


</script>

<style scoped>
.el-steps {
  margin: 20px 0;
}
</style>