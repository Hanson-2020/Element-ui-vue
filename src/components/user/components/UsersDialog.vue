<template>
  <div>
    <!-- 表格区域 -->
    <el-table :data="userList" border @click="getUserList">
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
            <el-button
              type="warning"
              icon="el-icon-setting"
              @click="rightsPreive(scope.row)"
              size="mini"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
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
    <!-- 分配角色 -->
    <el-dialog title="提示" :visible.sync="rightsIsShow" width="30%">
      <div>
        <p>用户名：{{userInfo.username}}</p>
        <p>身份：{{userInfo.role_name}}</p>
        <p>
          分配新角色：
          <el-select v-model="selectId" placeholder="请选择">
            <el-option
              v-for="item in rightsList"
              :key="item.id"
              :label="item.roleDesc"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightsIsShow = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "UsersDialog",
  data() {
    return {
      EditUserIsShow: false,
      rightsIsShow: false,
      editFrom: {},
      userInfo: {},
      rightsList: [],
      selectId: ''
    };
  },
  props: {
    userList: {
      type: Array,
      default: []
    },
    addFormRules: {
      type: Object,
      default: {}
    }
  },
  methods: {
    getUserList() {
      this.$emit("getUserList");
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
    EditDialogCloseed() {
      this.$refs.EditFormRef.resetFields();
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
    },
    //分配角色
    async rightsPreive(userInfo) {
      this.userInfo = userInfo;
      const { data: res } = await this.axios.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色信息失败");
      }
      this.rightsList = res.data;
      this.rightsIsShow = true;
    },
    async saveRoleInfo() {
      if(!this.selectId) {
        return this.$message.info('请选择要分配的角色')
      }
      // users/:id/role
      const {data : res} = await this.axios.put(`users/${this.userInfo.id}/role`, {rid: this.selectId})
      console.log(res, this.selectId, this.userInfo.id)
      if(res.meta.status !== 200 ) {
        return this.$message.error('修改角色失败')
      }
      this.$message.success('修改角色成功')
      this.getUserList()
      this.rightsIsShow = false;
    }
  }
};
</script>
<style scoped>
</style>