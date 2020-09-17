<template>
  <!-- 分页区域 -->
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="queryInfo.pagenum"
    :page-sizes="[3, 5, 10]"
    :page-size="queryInfo.pagesize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
  ></el-pagination>
</template>
<script>
export default {
  name: "CartPage",
  props: {
    queryInfo: {
      type: Object,
      default: {}
    },
    total: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {};
  },
  methods: {
    getCateList() {
      this.$emit('getCateList')
    },
    //监听pageSize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
      // console.log(newSize)
    },
    //监听页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
      // console.log(newPage)
    }
  }
};
</script>
<style scoped>
</style>