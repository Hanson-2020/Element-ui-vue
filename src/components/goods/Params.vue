<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="该分类仅用于三级分类" type="warning" :closable="false" show-icon></el-alert>
      <params-select :cateList="cateList" @getCateList="getCateList"></params-select>
    </el-card>
  </div>
</template>
<script>
import paramsSelect from "./components/ParamsSelect";
export default {
  name: "Params",
  components: {
    paramsSelect
  },
  data() {
    return {
      cateList: [],
    };
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.axios.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取分类失败");
      }
      this.cateList = res.data;
      // console.log(this.cateList);
    },

  }
};
</script>
<style scoped>
</style>