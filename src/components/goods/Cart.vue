<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <add-cart @getCateList="getCateList"></add-cart>
    <el-card>
      <!-- 表格区域 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        border
        show-index
        index-text="#"
        :selection-type="false"
        :expand-type="false"
      >
        <template #isoK="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <template #order="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <template #opt="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editCate(scope.row)">编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCate(scope.row)"
          >删除</el-button>
        </template>
      </tree-table>
      <cart-page @getCateList="getCateList" :queryInfo="queryInfo" :total="total"></cart-page>
    </el-card>
    <el-dialog title="编辑分类" :visible.sync="editCartIsShow" width="50%">
      <el-form :model="editFrom" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editFrom.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCartIsShow = false">取 消</el-button>
        <el-button type="primary" @click="editCartClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import AddCart from "./components/AddCart";
import CartPage from "./components/CartPage";
export default {
  components: {
    AddCart,
    CartPage
  },
  name: "Cart",
  data() {
    return {
      cateList: [],
      deleteId: "",
      //查询的参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //总数据条数
      total: 1,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          type: "template",
          template: "isoK"
        },
        {
          label: "排序",
          type: "template",
          template: "order"
        },
        {
          label: "操作",
          type: "template",
          template: "opt"
        }
      ],
      editCartIsShow: false,
      editFrom: {
        cat_name: "",
        cat_id: ""
      },
      editFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "用户名长度在 2 到 10 个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.axios.get("categories", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("请求数据失败");
      }
      console.log(res.data.result);
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    async deleteCate(value) {
      console.log(value.cat_id);
      this.deleteId = value.cat_id;
      const confirmResult = await this.$confirm(
        "此操作将永久删除该分类, 是否继续?",
        "删除分类",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.axios.delete(
        `categories/${this.deleteId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除分类失败~!");
      }
      this.$message.success("删除分类成功~!");
      this.getCateList();
    },
    editCate(value) {
      this.editCartIsShow = true;
      this.editFrom.cat_name = value.cat_name;
      this.editFrom.cat_id = value.cat_id;
    },
    editCartClick() {
      this.$refs.editFormRef.validate(async validate => {
        if (!validate) return;
        const { data: res } = await this.axios.put(
          "categories/" + this.editFrom.cat_id,
          { cat_name: this.editFrom.cat_name }
        );
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("编辑用户失败");
        }
        this.$message.success("编辑用户成功");
        this.getCateList();
        this.editCartIsShow = false;
      });
    }
  }
};
</script>
<style scoped>
.zk-table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>