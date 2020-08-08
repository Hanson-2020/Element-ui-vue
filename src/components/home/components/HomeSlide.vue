<template>
  <div>
    <div class="toggle-button" @click="toggleButtom">|||</div>
    <el-menu
      background-color="#545c64"
      text-color="#fff"
      unique-opened
      :collapse="isCollapse"
      :collapse-transition="false"
      router
      :default-active="activePath"
    >
      <!-- el-submenu是一级菜单 -->
      <el-submenu v-for="(items, index) in menuslist" :key="index" :index="items.id + ''">
        <template slot="title">
          <i :class="iconlist[index]"></i>
          <span>{{items.authName}}</span>
        </template>
        <el-menu-item
          v-for="childitem in items.children"
          :key="childitem.id"
          :index="'/'+childitem.path"
          @click="saveNavState(activePath)"
        >
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>{{childitem.authName}}</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
export default {
  name: "HomeSlide",
  methods: {
    toggleButtom() {
      this.$emit("toggleButtom");
    },
    saveNavState(activePath) {
      sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath;
    }
  },
  created() {
    this.activePath = sessionStorage.getItem('activePath')
  },
  data() {
    return {
      iconlist: [
        "el-icon-s-custom",
        "el-icon-s-platform",
        "el-icon-s-cooperation",
        "el-icon-s-order",
        "el-icon-s-data"
      ],
      activePath: ''
    };
  },
  props: {
    menuslist: {
      type: Array,
      default: []
    },
    isCollapse: false
  }
};
</script>
<style scoped>
.el-menu {
  border-right: none;
}
.toggle-button {
  background: #4a5064;
  text-align: center;
  color: #fff;
  line-height: 24px;
  font-size: 10px;
  letter-spacing: 0.3em;
  cursor: pointer;
}
</style>