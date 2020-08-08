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
      <el-table :data="userList" border>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template v-slot:default="scope">
            <!-- {{scope.row}} -->
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot:default="scope">
            <el-tooltip class="item" effect="dark" content="修改" :enterable="false" placement="top">
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="showEditDialog(scope.row.id)"
                size="mini"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button
                @click="deleteUser(scope.row.id)"
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
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

    <!-- 编辑用户的对话框 -->
    <el-dialog @close="EditDialogCloseed" title="编辑用户" :visible.sync="EditUserIsShow" width="50%">
      <el-form :model="editFrom" :rules="addFormRules" ref="EditFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editFrom.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditUserIsShow = false">取 消</el-button>
        <el-button type="primary" @click="EditUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "Users",
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
      EditUserIsShow: false,
      // 添加用户表单数据
      addForm: {
        username: "Hanson",
        password: "Hanson",
        email: "2011@qq.com",
        mobile: "13168442545"
      },
      editFrom: {},
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
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取用户数据失败");
      this.userList = res.data.users;
      this.total = res.data.total;
      // 由于页码改变，如果在第二页搜索时，页码为2，显示的数据在页码为1中，所以每次调用getUserList需要将页码改为1
      // this.queryInfo.pagenum = 1;
    },
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
    // 监听switch开关状态的变化
    async userStateChanged(userInfo) {
      // console.log(userInfo)
      const { data: res } = await this.axios.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error("更新用户状态失败");
      }
      this.$message.success("更新用户状态成功！");
    },
    //监听添加用户对话框的关闭事件
    addDialogCloseed() {
      this.$refs.addFormRef.resetFields();
    },
    EditDialogCloseed() {
      this.$refs.EditFormRef.resetFields();
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
    },
    async showEditDialog(id) {
      const { data: res } = await this.axios.get("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户信息失败");
      }
      this.editFrom = res.data;
      this.EditUserIsShow = true;
      // console.log(id)
    },
    EditUser() {
      this.$refs.EditFormRef.validate(async valida => {
        // console.log(valida);
        if (!valida) return;
        const { data: res } = await this.axios.put(
          "users/" + this.editFrom.id,
          { email: this.editFrom.email, mobile: this.editFrom.mobile }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("更新用户信息失败");
        }
        //关闭对话框，刷新数据列表，提示修改成功
        this.EditUserIsShow = false;
        this.getUserList();
        this.$message.success("更新用户信息成功");
      });
    },
    // 根据id删除用户信息
    async deleteUser(id) {
      console.log(id);
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "删除用户",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      // 用户确认删除，则返回值为字符串confirm
      // 用户取消删除，则返回值为字符串cancel
      // console.log(confirmResult)
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.axios.delete("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除用户失败");
      }
      this.$message.success("删除用户成功");
      this.getUserList();
    }
  },
  created() {
    this.getUserList();
  }
};
</script>
<style scoped>
</style>