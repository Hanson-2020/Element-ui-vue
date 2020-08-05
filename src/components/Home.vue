<template>
<div>
  <el-button type="info" @click="logout">
    退出！
  </el-button>
</div>
</template>
<script>
  export default {
  name: 'Home',
  methods: {
    logout() {
      sessionStorage.clear();
      this.$router.replace('/login');
      return this.$message.success('退出成功！')
    }
  }
}
</script>
<style scoped>
</style>