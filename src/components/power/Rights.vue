<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/rights' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <power-table :rightsList="rightsList"></power-table>
  </div>
</template>
<script>
import PowerTable from "./components/PowerTable";
export default {
  name: "Rights",
  components: {
PowerTable
  },
  data() {
    return {
      //权限列表
      rightsList: []
    };
  },
  created() {
    this.getRightsList();
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.axios.get("rights/list");
      if (res.meta.status != 200) {
        return this.$message.error("获取列表信息失败");
      }
      this.rightsList = res.data;
      console.log(this.rightsList);
    }
  }
};
</script>
<style scoped>
</style>