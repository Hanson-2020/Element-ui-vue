<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/roles' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <roles-add-user @getRoleList="getRoleList" :roleList="roleList"></roles-add-user>
      <roles-table @getRoleList="getRoleList" :roleList="roleList"></roles-table>
    </el-card>
  </div>
</template>
<script>
import RolesAddUser from "./components/RolesAddUser";
import RolesTable from "./components/RolesTable";
export default {
  name: "Roles",
  components: {
    RolesAddUser,
    RolesTable
  },
  data() {
    return {
      //所有角色列表数据
      roleList: []
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.axios.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据列表失败");
      }
      this.roleList = res.data;
      console.log(this.roleList);
    }
  }
};
</script>
<style scoped>
</style>