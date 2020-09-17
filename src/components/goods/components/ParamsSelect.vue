<template>
  <div>
    <!-- 三级分类 -->
    <el-row class="cat_opt">
      <el-col>
        <span>请选择分类:</span>
        <el-cascader
          class="cascader-card"
          v-model="selectOptions"
          :options="cateList"
          :props="{expandTrigger: 'hover', label: 'cat_name', value: 'cat_id', children: 'children'}"
          @change="handleChange"
        ></el-cascader>
      </el-col>
    </el-row>
    <!-- 参数显示区域 -->
    <el-tabs v-model="activeName" @tab-click="handleTabsClick">
      <el-tab-pane label="动态参数" name="many">
        <el-button type="primary" :disabled="isDisTure" @click="dialogVisible = true">添加参数</el-button>
        <el-table border stripe :data="mangTab">
          <el-table-column type="expand">
            <template v-slot:default="scope">
              <el-tag
                class="tag"
                v-for="(item, i) in scope.row.attr_vals"
                :key="i"
                closable
                @close="handClose(i, scope.row)"
              >{{item}}</el-tag>
              <!-- 添加的按钮 -->
              <el-input
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              ></el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(scope.row)"
              >+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>

          <el-table-column label="参数名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template v-slot:default="scope">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="editFromDio(scope.row.attr_id)"
              >编辑</el-button>
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="deleteParams(scope.row.attr_id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态属性" name="only">
        <el-button type="primary" :disabled="isDisTure" @click="dialogVisible = true">添加属性</el-button>
        <el-table border stripe :data="onlyTab">
          <el-table-column type="expand">
            <template v-slot:default="scope">
              <el-tag
                class="tag"
                v-for="(item, i) in scope.row.attr_vals"
                :key="i"
                closable
                @close="handClose(i, scope.row)"
              >{{item}}</el-tag>
              <!-- 添加的按钮 -->
              <el-input
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              ></el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(scope.row)"
              >+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>

          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template v-slot:default="scope">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="editFromDio(scope.row.attr_id)"
              >编辑</el-button>
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="deleteParams(scope.row.attr_id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :title="'添加'+ textClick" @close="closeDia" :visible.sync="dialogVisible" width="30%">
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="textClick" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTextParams">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="'修改'+ textClick"
      @close="editcloseDia"
      :visible.sync="editdialogVisible"
      width="30%"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="textClick" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editTextParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "ParamsSelect",
  created() {
    this.getCateList();
  },
  props: {
    cateList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      selectOptions: [],
      activeName: "many",
      mangTab: [],
      onlyTab: [],
      dialogVisible: false,
      editdialogVisible: false,
      addForm: {
        attr_name: ""
      },
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      },
      editForm: {},
      editFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    getCateList() {
      this.$emit("getCateList");
    },
    //关闭dio时清空
    closeDia() {
      this.$refs.addFormRef.resetFields();
    },
    // 添加参数信息
    addTextParams() {
      this.$refs.addFormRef.validate(async vali => {
        if (!vali) return;
        const { data: res } = await this.axios.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        );
        // console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error("添加参数失败");
        }
        this.$message.success("添加参数成功");
        this.dialogVisible = false;
        this.getParamsData();
      });
    },
    // 进行编辑
    async editFromDio(attr_id) {
      console.log(this.cateId);
      const {
        data: res
      } = await this.axios.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        { params: { attr_sel: this.activeName } }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数信息失败");
      }
      this.editForm = res.data;
      this.editdialogVisible = true;
    },
    //编辑框的关闭
    editcloseDia() {
      this.$refs.editFormRef.resetFields();
    },
    //编辑参数
    editTextParams() {
      this.$refs.editFormRef.validate(async vali => {
        if (!vali) return;
        const {
          data: res
        } = await this.axios.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改失败");
        }
        this.$message.success("修改成功");
        this.getParamsData();
        this.editdialogVisible = false;
      });
    },
    //删除参数
    async deleteParams(attr_id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该参数，是否继续？",
        "提示",
        {
          confrimButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除！");
      }
      const { data: res } = await this.axios.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      this.getParamsData();
      this.editdialogVisible = false;
    },
    //鼠标点击和enter输入触发
    async handleInputConfirm(row) {
      // console.log("ok");
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      //后续处理
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      this.saveAttrVals(row);
    },
    showInput(row) {
      row.inputVisible = true;
      //让文本框自动获得焦点
      //.$nextTick作用: 就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    async saveAttrVals(row) {
      //发起请求，保存增加的标签
      const { data: res } = await this.axios.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" ")
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("修改参数项失败");
      }
      this.$message.success("修改参数成功");
    },
    //删除对应参数项
    handClose(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveAttrVals(row);
    },
    //级联选择框选项进行变化的时候触发这个函数
    handleChange() {
      this.getParamsData();
    },
    handleTabsClick() {
      this.getParamsData();
      console.log(this.activeName);
    },
    //获取分类的参数
    async getParamsData() {
      if (this.selectOptions.length !== 3) {
        this.selectOptions = [];
        this.mangTab = [];
        this.onlyTab = [];
        return;
      }
      // console.log(this.selectOptions);
      console.log(this.cateId);
      const { data: res } = await this.axios.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数列表失败");
      }
      res.data.forEach(item => {
        // item.attr_vals = (item.attr_vals || "").split(" ");
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        //控制文本框的显示与隐藏
        item.inputVisible = false;
        item.inputValue = "";
      });
      console.log(res.data);
      console.log(this.activeName);
      if (this.activeName === "many") {
        this.mangTab = res.data;
      } else {
        this.onlyTab = res.data;
      }
    }
  },
  computed: {
    isDisTure() {
      return this.selectOptions.length !== 3;
    },
    cateId() {
      if (this.selectOptions.length === 3) {
        return this.selectOptions[2];
      }
      return null;
    },
    textClick() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态参数";
      }
    }
  }
};
</script>
<style scoped>
.cat_opt {
  margin: 15px 0;
}
.cascader-card {
  margin-left: 20px;
}
.tag {
  margin: 5px;
}
.input-new-tag {
  width: 120px;
}
</style>