<template>
  <el-table-column type="expand">
    <template v-slot="scope">
      <!-- {{scope.row}} -->
      <el-row
        :class="['bdBottom', index1 === 0 ? 'bdtop' : '','venter'] "
        v-for="(item1, index1) in scope.row.children"
        :key="index1"
      >
        <!-- 渲染一级权限 -->
        <el-col :span="5">
          <el-tag @close="removeRightByid(scope.row, item1.id)" closable>{{item1.authName}}</el-tag>
          <i class="el-icon-caret-right"></i>
        </el-col>
        <!-- 渲染二级权限 -->
        <!-- 渲染三级权限 -->
        <el-col :span="19">
          <el-row
            :class="[index2 === 0 ? '' : 'bdtop','venter']"
            v-for="(item2, index2) in item1.children"
            :key="item2.id"
          >
            <el-col :span="6">
              <el-tag @close="removeRightByid(scope.row, item2.id)" closable type="success">{{item2.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="18">
              <el-tag
                closable
                type="warning"
                v-for="item3 in item2.children"
                :key="item3.id"
                @close="removeRightByid(scope.row, item3.id)"
              >{{item3.authName}}</el-tag>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </template>
  </el-table-column>
</template>
<script>
export default {
  name: "RoleExpand",
  methods: {
    async removeRightByid(role, id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "删除权限",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      // console.log("确认了删除");
      // roles/:roleId/rights/:rightId
      console.log(id);
      const { data: res } = await this.axios.delete(
        `roles/${role.id}/rights/${id}`
      );
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.info("权限删除失败");
      }
      role.children = res.data;
    }
  }
};
</script>
<style scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdBottom {
  border-bottom: 1px solid #eee;
}
.venter {
  display: flex;
  align-items: center;
}
</style>