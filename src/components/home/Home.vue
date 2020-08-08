<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../../assets/0.jpg" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出！</el-button>
    </el-header>
    <el-container>
      <!-- 左侧侧边栏区域 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <home-slide :menuslist="menulist" :isCollapse="isCollapse" @toggleButtom="toggleButtom"></home-slide>
      </el-aside>
      <!-- 右侧主题内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import HomeSlide from "./components/HomeSlide";
export default {
  name: "Home",
  data() {
    return {
      menulist: [],
      isCollapse: false
    };
  },
  components: {
    HomeSlide
  },
  methods: {
    logout() {
      sessionStorage.clear();
      this.$router.replace("/login");
      return this.$message.success("退出成功！");
    },
    async getMenuList() {
      const { data: res } = await this.axios.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menulist = res.data;
      // console.log(res);
    },
    toggleButtom() {
      this.isCollapse = !this.isCollapse;
    }
  },
  created() {
    this.getMenuList();
  }
};
</script>
<style scoped>
.el-header {
  background: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-header div {
  display: flex;
  align-items: center;
}
.el-header img {
  width: 40px;
  height: 40px;
  padding: 10px;
}
.el-aside {
  background: #333744;
}
.el-main {
  background: #eaedf1;
}
.home-container {
  height: 100%;
}
</style>