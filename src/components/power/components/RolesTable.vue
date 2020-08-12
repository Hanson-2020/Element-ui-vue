<template>
  <div>
    <el-table :data="roleList" border stripe @click="getRoleList">
      <!-- 展开列 -->
      <role-expand></role-expand>
      <!-- 索引列 -->
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
      <el-table-column label="操作" width="300px">
        <template v-slot:default="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="showEditDialog(scope.row.id)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="deleteId(scope.row.id)"
            icon="el-icon-delete"
          >删除</el-button>
          <el-button
            size="mini"
            type="warning"
            icon="el-icon-setting"
            @click="showSetRightDialog(scope.row)"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑用户 -->
    <el-dialog @close="EditDialogCloseed" title="编辑用户" :visible.sync="EditUserIsShow" width="50%">
      <el-form :model="editForm" :rules="EditFormRules" ref="EditFormRef" label-width="70px">
        <el-form-item label="用户名" prop="roleName">
          <el-input v-model="editForm.roleName" disabled></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditUserIsShow = false">取 消</el-button>
        <el-button type="primary" @click="EditUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑权限 -->
    <el-dialog title="提示" :visible.sync="setshowSetRightDialog" width="50%" @close="setshowSetRightDialogClosed">
      <el-tree :data="rightsList" ref="treeRef" :props="defaultProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setshowSetRightDialog = false">取 消</el-button>
        <el-button type="primary" @click="allowRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import RoleExpand from "./RoleExpand";
export default {
  name: "RoleTable",
  components: {
    RoleExpand
  },
  data() {
    return {
      EditUserIsShow: false,
      setshowSetRightDialog: false,
      editForm: {},
      //权限树的数据
      rightsList: [],
      // 树形控件的属性绑定对象
      defaultProps: {
        // label是我们看到的属性的值
        label: 'authName',
        // children是父子数组通过哪个节点嵌套
        children: 'children'
      },
      roleId: '',
      defKeys: [],
      EditFormRules: {
        roleName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "用户名长度在 2 到 10 个字符",
            trigger: "blur"
          }
        ],
        roleDesc: [
          { required: true, message: "请输入描述", trigger: "blur" },
          {
            min: 2,
            max: 15,
            message: "用户名长度在 2 到 15 个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  props: {
    roleList: {
      type: Array,
      default: []
    }
  },
  methods: {
    getRoleList() {
      this.$emit("getRoleList");
    },
    EditDialogCloseed() {
      this.$refs.EditFormRef.resetFields();
    },
    async deleteId(id) {
      console.log(id);
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "删除用户",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.axios.delete("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$message.info("删除失败");
      }
      this.$message.success("删除用户成功");
      this.getRoleList();
    },
    async showEditDialog(id) {
      const { data: res } = await this.axios.get("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色信息失败");
      }
      this.editForm = res.data;
      this.EditUserIsShow = true;
    },
    EditUser() {
      this.$refs.EditFormRef.validate(async valida => {
        // console.log(valida);
        if (!valida) return;
        const { data: res } = await this.axios.put(
          "roles/" + this.editForm.roleId,
          { roleName: this.editForm.roleName, roleDesc: this.editForm.roleDesc }
        );
        console.log(this.editForm.roleId);
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("更新用户信息失败");
        }
        //关闭对话框，刷新数据列表，提示修改成功
        this.EditUserIsShow = false;
        this.getRoleList();
        this.$message.success("更新用户信息成功");
      });
    },
    async showSetRightDialog(role) {
      this.roleId = role.id;
      const {data: res } = await this.axios.get('rights/tree');
      if(res.meta.status !== 200) {
        return this.$message.error('获取权限失败')
      }
      this.rightsList = res.data;
      // console.log(this.rightsList)
      // 递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys)
      // console.log(this.defKeys)
      this.setshowSetRightDialog = true;
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys中
    getLeafKeys(role, arr) {
      // 判断是否为三级节点,如果当前的不包含children属性，就是三级权限
      //这个是递归的满足条件
      if(!role.children) {
        return arr.push(role.id)
      }
      //二级菜单开始循环
      role.children.forEach(item => {
        //再次调用自身，这时的role就变成三级菜单了，三级菜单没有children，满足条件，id被加入arr
        this.getLeafKeys(item, arr)
      })
    },
    setshowSetRightDialogClosed() {
      this.defKeys = [];
    },
    async allowRights() {
      const keys = [
        ...this.$refs.treeRef.getHalfCheckedKeys(),//拿到半选中的id值
        ...this.$refs.treeRef.getCheckedKeys()//拿到勾选的三家权限的id值
      ];
      console.log(keys)
      const idStr = keys.join(',')
      // console.log(idStr)
      const {data: res} = await this.axios.post(`roles/${this.roleId}/rights`,{rids: idStr})
      if(res.meta.status !== 200) {
        return this.$message.error('修改权限失败')
      }
      this.$message.success('修改权限成功')
      this.getRoleList()
      this.setshowSetRightDialog = false;
    }
  }
};
</script>
<style scoped>
</style>