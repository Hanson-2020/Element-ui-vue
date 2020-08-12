<template>
    <el-row>
      <el-col @click="getRoleList">
        <el-button type="primary" @click="addUserIsShow=true">添加角色</el-button>
        <el-dialog @close="addDialogCloseed" title="添加用户" :visible.sync="addUserIsShow" width="50%">
          <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
            <el-form-item label="用户名" prop="roleName">
              <el-input v-model="addForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="roleDesc">
              <el-input v-model="addForm.roleDesc"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addUserIsShow = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
          </span>
        </el-dialog>
      </el-col>
    </el-row>
</template>
<script>
export default {
  name: "RolesTable",
  data() {
    return {
      addUserIsShow: false,
      addForm: {
        roleDesc: "",
        roleName: ""
      },
      addFormRules: {
        roleName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名长度在 3 到 10 个字符",
            trigger: "blur"
          }
        ],
        roleDesc: [
          { required: true, message: "请输入描述", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "用户名长度在 3 到 15 个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    getRoleList() {
      this.$emit("getRoleList");
    },
    addUser() {
      this.$refs.addFormRef.validate(async value => {
        if (!value) return;
        //发起网络请求
        const { data: res } = await this.axios.post("roles", this.addForm);
        if (res.meta.status !== 201) {
          this.$message.error("添加用户失败！");
        }
        this.$message.success("添加用户成功！");
        this.addUserIsShow = false;

        this.getRoleList();
      });
    },
    addDialogCloseed() {
      this.$refs.addFormRef.resetFields();
    }
  }
};
</script>
<style scoped>
</style>