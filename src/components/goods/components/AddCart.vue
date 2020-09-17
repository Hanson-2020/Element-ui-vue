<template>
  <div>
    <el-row>
      <el-col @click="getCateList">
        <el-button type="primary" @click="addCateDialog">添加分类</el-button>
        <el-dialog @close="addDialogCloseed" title="添加分类" :visible.sync="addCateIsShow" width="50%">
          <el-form
            :model="addCate"
            :rules="addCateFormRules"
            ref="addCateFormRef"
            label-width="80px"
          >
            <el-form-item label="分类名称" prop="cat_name">
              <el-input v-model="addCate.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类">
              <!-- options是数据源 -->
              <div class="block">
                <el-cascader
                  v-model="selectModel"
                  :options="parentsCateList"
                  :props="{ expandTrigger: 'hover', label: 'cat_name', value: 'cat_id', children: 'children', checkStrictly: true }"
                  @change="handleChange"
                  clearable
                ></el-cascader>
              </div>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addCateIsShow = false">取 消</el-button>
            <el-button type="primary" @click="addCateClick">确 定</el-button>
          </span>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "AddCart",
  data() {
    return {
      addCateIsShow: false,
      addCate: { cat_name: "", cat_pid: 0, cat_level: 0 },
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "用户名长度在 2 到 10 个字符",
            trigger: "blur"
          }
        ]
      },
      selectModel: [],
      parentsCateList: []
    };
  },
  methods: {
    getCateList() {
      this.$emit('getCateList')
    },
    addDialogCloseed() {
      this.$refs.addCateFormRef.resetFields();
      this.selectModel = [];
      this.addCate.cat_pid = 0;
      this.addCate.cat_level = 0;
    },
    addCateDialog() {
      this.getParentCateList();
      this.addCateIsShow = true;
    },
    async getParentCateList() {
      const { data: res } = await this.axios.get("categories", {
        params: { type: 2 }
      });
      if (res.meta.status !== 200) {
        return this.$message.error("请求数据失败");
      }
      console.log(res.data);
      this.parentsCateList = res.data;
    },
    handleChange() {
      //selectModel数组中的length大于0，证明选中的父级分类
      //反之就说明没有选中父级分类
      console.log(this.selectModel);
      if (this.selectModel.length > 0) {
        //拿出selectModel最后边的索引值
        //父级分类的id
        this.addCate.cat_pid = this.selectModel[this.selectModel.length - 1];
        // 为分类的等级赋值
        this.addCate.cat_level = this.selectModel.length;
        return;
      } else {
        //父级分类的id
        this.addCate.cat_pid = 0;
        // 为分类的等级赋值
        this.addCate.cat_level = 0;
      }
    },
    addCateClick() {
      console.log(this.addCate);
      this.$refs.addCateFormRef.validate(async validate => {
        if (!validate) return;
        const { data: res } = await this.axios.post("categories", this.addCate);
        console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error("添加分类失败~!");
        }
        this.$message.success("添加分类成功!");
        this.getCateList();
        this.addCateIsShow = false;
      });
    }
  }
};
</script>
<style scoped>
</style>