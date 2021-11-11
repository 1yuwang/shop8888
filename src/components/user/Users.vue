<template>
  <div>
      <!-- 面包屑 -->
      <el-breadcrumb separator="/" style="margin-bottom: 10px">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card align="left">
        <!-- 搜索头部input框 -->
        <el-row :gutter="15">
          <el-col :span="8">
            <el-input
              v-model="queryInfo.query"
              placeholder="请输入内容"
              class="input-with-select"
              clearable
              @clear="getUserList"
            >
            
              <template #append>
                <el-button @click="getUserList">搜索</el-button>
              </template>
            </el-input>
          </el-col>
          <el-col :span="1">
            <el-button type="primary" @click="addUserVisible = true">添加用户</el-button>
          </el-col>
        </el-row>

        <!-- 渲染数据表格 -->
        <el-table :data="userList" border style="width: 100%; margin: 10px 0">
          <el-table-column type="index"/>
          <el-table-column prop="username" label="姓名" width="180" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="mobile" label="电话" />
          <el-table-column prop="role_name" label="角色" />
          <el-table-column prop="mg_state" label="状态">
            <template #default="props">
              <el-switch @change="changeStatus(props.row.id, $event)"
                v-model="props.row.mg_state"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template #default="props">
              <el-tooltip
                class="item"
                effect="dark"
                content="编辑"
                placement="top-start"
              >
                <el-button type="primary" size="mini" @click="editUser(props.row)">e</el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="删除"
                placement="top-start"
              >
              <el-button type="danger" size="mini" @click="removeUser(props.row)">d</el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="分配角色"
                placement="top-start"
              >
              <el-button type="warning" size="mini" @click="editRole(props.row)">s</el-button>
              </el-tooltip>
            </template>
          </el-table-column>/
        </el-table>
        <!-- 分页功能 -->
        <el-pagination
          v-model:currentPage="queryInfo.pagenum"
          :page-sizes="[1, 2, 3, 4]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="sizeChange"
          @current-change="currentChange"
        >
        </el-pagination>
      </el-card>

      <!-- 添加用户弹出输入框 -->
      <el-dialog
        title="添加用户"
        v-model="addUserVisible"
        width="50%"
        @close="closeAddUserDialog"
      >
        <el-form
          ref="addUserFormRef"
          :model="addUserForm"
          :rules="addUserFormRul"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addUserForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addUserForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="addUserVisible = false">取消</el-button>
            <el-button type="primary" @click="addUser"
              >确定</el-button
            >
          </span>
        </template>

      </el-dialog>
      <!-- 修改用户信息对话框 -->
      <el-dialog
        title="修改信息"
        v-model="editUserVisible"
        width="50%"
      >
        <el-form
          ref="editUserParamsRel"
          :model="editUserParams"
          :rules="editUserParamsRul"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editUserParams.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUserParams.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editUserParams.mobile"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="editUserVisible = false">取消</el-button>
            <el-button type="primary" @click="editUserInfo"
              >确定</el-button
            >
          </span>
        </template>
      </el-dialog>
      <!-- 分配角色dialog -->
	
      <!-- 修改用户diaolog对话框 -->
      
      <el-dialog align="left" title="修改用户" v-model="editRoleVisible" width="50%" >
        <!--主体部分 -->
        <div>
          <p>当前的用户:<strong>{{currentname}}</strong></p>
          <p>当前的角色:<strong>{{currentRol}}</strong></p>
          <span>分配新角色:</span> 
          <el-select v-model="selectVal" slot="prepend" placeholder="请选择">
            <el-option label="王者" value="王者"></el-option>
            <el-option label="黄铜" value="黄铜"></el-option>
            <el-option label="钻石" value="钻石"></el-option>
          </el-select>
        </div>
        
        <span slot="footer" class="dialog-footer">
          <el-button @click="editRoleVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRollist">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>
 
<script>
  import { Search } from '@element-plus/icons'

  export default {
    data() {
      //验证邮箱的规则
      var checkEmail = (rule, value, cb) => {
        const regEmail = /^\w+@\w+(\.\w+)+$/
        if (regEmail.test(value)) {
          return cb()
        }
        //返回一个错误提示
        cb(new Error('请输入合法的邮箱'))
      }
      //验证手机号码的规则
      var checkMobile = (rule, value, cb) => {
        const regMobile = /^1[345789]\d{9}$/
        if (regMobile.test(value)) {
          return cb()
        }
        //返回一个错误提示
        cb(new Error('请输入合法的手机号码'))
      }
			
      return {
        input3: '',
        // 请求用户列表canshu
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 2
        },
        // 用户列表数据
        userList: [],
        // 当前数据总数
        total: 0,
        // 添加用户dialog显示、隐藏
        addUserVisible: false,
        // 添加用户参数
        addUserForm: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        // 添加用户对话框验证规则
        addUserFormRul: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          email: [{ validator: checkEmail, trigger: 'blur' }],
          mobile: [{ validator: checkMobile, trigger: 'blur' }],
        },
        // 存储获取到的用户信息
        editUserParams: {
          email: '',
          mobile: '',
          username: '',
          id: ''
        },
        //修改用户信息对话框规则
        editUserParamsRul: {
          email: [{ validator: checkEmail, trigger: 'blur' }],
          mobile: [{ validator: checkMobile, trigger: 'blur' }]
        },
        // 控制修改用户信息对话框的显示/隐藏
        editUserVisible: false,
        	//修改用户dialog,控制显示隐藏
				editUserVisible: false,
				//角色对话框
				editRoleVisible:false,
				//分配角色
				selectVal:'',
				//当前用户
				currentname:'',
				//当前的角色
				currentRol:'',
				id:'',
				rid:''
      }
    },
    methods: {
      // 请求用户列表数据
      getUserList() {
        this.$http.get('users', {params: this.queryInfo}).then(res => {
          if(res.data.meta.status !== 200) return this.$message.error('请求用户列表失败!')
          // this.$message.success(res.data.meta.msg)
          this.userList = res.data.data.users;
          this.total = res.data.data.total;
        })
      },
      // 当每页数据条数发生改变的时候触发
      sizeChange(newsize) {
        this.queryInfo.pagesize = newsize;
        this.getUserList();
      },

      // 当前页码发生改变的时候触发
      currentChange(newNum) {
        this.queryInfo.pagenum = newNum;
        this.getUserList()
      },
      // 修改状态
      changeStatus(id, status) {
        this.$http.put(`users/${id}/state/${status}`).then(res => {
          if(res.data.meta.status !== 200) {
            return this.$message.error('设置状态失败')
          }
          this.getUserList()
          this.$message.success('改变用户状态成功')
        })
      },
      addUser() {
        this.$refs.addUserFormRef.validate(valid => {
          if(!valid) return alert('请输入正确的信息')
          this.$http.post('users', this.addUserForm).then(res => {
            // if(res.data.meta.status !)
          })
          // 关闭dialog对话框
          this.addUserVisible = !this.addUserVisible;
          this.$message.success('添加成功')
          this.getUserList()
        })
      },
      // 关闭dialog对话框触发事件
      closeAddUserDialog() {
        this.$refs.addUserFormRef.resetFields()
      },
      // 点击编辑按钮，编辑用户信息
      editUser(row) {
        // 根据用户id获取当前用户信息
        this.$http.get(`users/${row.id}`).then(res => {
          // 保存获取到的用户信息
          this.editUserParams.email = res.data.data.email;
          this.editUserParams.mobile = res.data.data.mobile;
          this.editUserParams.username = res.data.data.username;
          this.editUserParams.id = res.data.data.id;
          // console.log(this.editUserParams)
          this.editUserVisible = !this.editUserVisible
        })
      },
      // 点击确定编辑，发起后台请求
      editUserInfo() {
        this.$http.put(`users/${this.editUserParams.id}`, this.editUserParams).then(res => {
          this.editUserVisible = false;
          this.$message.success('修改成功')
          this.getUserList()
        })
      },
      // 删除用户
      removeUser(row) {
        this.$confirm('此操作将永久删除该用户,是否继续', '删除用户',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
            // 点击确定,发起后台请求,删除该用户
            this.$http.delete(`users/${row.id}`).then(res => {
              if(res.data.meta.status == 200) return this.$message.success(res.data.meta.msg)
              this.$message.success(res.data.meta.msg)
              this.getUserList()
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
            })
          })
      },
      //编辑角色事件
			editRole(row){
				this.editRoleVisible = !this.editRoleVisible;
				this.currentRol = row.role_name;
				this.currentname = row.username;
				this.id= row.id;
				//获取角色id
				this.$http.get(`users/${row.id}`).then(res=>{
					//console.log(res);
					 this.rid = res.data.data.rid;
				})

			},
			editRollist(){
				//分配用户角色
				this.$http.put(`users/${this.id}/role`,{rid:this.rid})
				.then(res=>{
					if(res.data.meta.status!==200) return this.$message.error("分配角色失败！");
					 this.$message.success("分配角色成功！");
				})
				
				this.getUserList();				
				this.editRoleVisible = !this.editRoleVisible;
			}


    },
    created() {
      this.getUserList()
    }
  }
</script>

<style scoped>

</style>