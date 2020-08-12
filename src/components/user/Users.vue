<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <!-- 搜索区域 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            @clear="getUserList"
            class="input-with-select"
            v-model="queryInfo.query"
          >
            <el-button slot="append" @click="getUserSearch" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户区域 -->
        <el-col :span="4">
          <el-button type="primary" @click="addUserIsShow = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <users-dialog :userList="userList" :addFormRules="addFormRules" @getUserList="getUserList"></users-dialog>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog @close="addDialogCloseed" title="添加用户" :visible.sync="addUserIsShow" width="50%">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserIsShow = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import UsersDialog from "./components/UsersDialog";
export default {
  name: "Users",
  components: {
    UsersDialog
  },
  data() {
    //验证邮箱的规则
    var checkEmail = (rule, value, callBack) => {
      const regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      if (regEmail.test(value)) {
        return callBack();
      }
      callBack(new Error("请输入合法的邮箱"));
    };
    var checkMobile = (rule, value, callBack) => {
      const regPhone = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (regPhone.test(value)) {
        return callBack();
      }
      callBack(new Error("请输入合法的手机号码"));
    };
    return {
      // 获取用户列表的参数
      queryInfo: {
        query: "",
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      userList: [],
      total: 0,
      addUserIsShow: false,
      // 添加用户表单数据
      addForm: {
        username: "Hanson",
        password: "Hanson",
        email: "2011@qq.com",
        mobile: "13188888888"
      },
      // 添加变单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名长度在 3 到 10 个字符",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "用户名长度在 6 到 15 个字符",
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            validator: checkEmail,
            trigger: "blur"
          }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            validator: checkMobile,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.axios.get("users", {
        params: this.queryInfo
      });
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取用户数据失败");
      this.userList = res.data.users;
      this.total = res.data.total;
      // 由于页码改变，如果在第二页搜索时，页码为2，显示的数据在页码为1中，所以每次调用getUserList需要将页码改为1
      // this.queryInfo.pagenum = 1;
    },
    // 搜索的时候把结果放在第一页
    getUserSearch() {
      this.queryInfo.pagenum = 1;
      this.getUserList();
    },
    //监听pageSize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
      // console.log(newSize)
    },
    //监听页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
      // console.log(newPage)
    },
    //监听添加用户对话框的关闭事件
    addDialogCloseed() {
      this.$refs.addFormRef.resetFields();
    },
    //添加用户的确定按钮
    addUser() {
      this.$refs.addFormRef.validate(async value => {
        if (!value) return;
        //发起网络请求
        const { data: res } = await this.axios.post("users", this.addForm);
        if (res.meta.status !== 201) {
          this.$message.error("添加用户失败！");
        }
        this.$message.success("添加用户成功！");
        this.addUserIsShow = false;
        this.getUserList();
      });
    }
  },
  created() {
    this.getUserList();
  }
};
</script>
<style scoped>
</style>