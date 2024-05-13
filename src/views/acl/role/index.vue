<template>
  <div>
    <el-card style="height: 80px;">
      <el-form class="form">
        <el-form-item label="职位搜索">
          <el-input placeholder="请输入搜索关键词" v-model="keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="default" @click="search" :disabled="keyword ? false : true">搜索</el-button>
          <el-button type="primary" size="default" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin: 16px 0; ">
      <el-button v-has="'btn.Role.add'" type="primary" size="default" icon="Plus" @click="addRole">添加职位</el-button>
      <el-table border style="margin: 12px 0;" :data="roleArr">
        <el-table-column type="index" label="#" align="center"></el-table-column>
        <el-table-column label="ID" align="center" prop="id"></el-table-column>
        <el-table-column label="职位名称" align="center" prop="roleName"></el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime"></el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateTime"></el-table-column>
        <el-table-column label="操作" align="center" width="300px">
          <template #="{ row }">
            <el-button v-has="'btn.Role.assgin'" type="primary" size="small" icon="User" @click="setPermission(row)">分配权限</el-button>
            <el-button v-has="'btn.Role.update'"  type="warning" size="small" icon="Edit" @click="EditRole(row)">编辑</el-button>
            <el-popconfirm :title="`你确定要删除${row.roleName}?`" width="220px" @confirm="removeRole(row.id)">
              <template #reference>
                <el-button type="danger" size="small" icon="Delete">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
        :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total" @size-change="sizeChange"
        @current-change="getHasRole" />
    </el-card>
    <!-- 添加|修改对话框 -->
    <el-dialog v-model="isshow" title="添加职位" width="600">
      <el-form :model="roleParams" :rules="rules" status-icon ref="form">
        <el-form-item label="职位名称" prop="roleName">
          <el-input placeholder="请输入职位名称" v-model="roleParams.roleName"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="isshow = false">取消</el-button>
          <el-button type="primary" @click="save">确认</el-button>
        </div>
      </template>
    </el-dialog>
    <!--分配权限抽屉 -->
    <el-drawer v-model="drawer" :show-close="true">
      <template #header>
        <h4>分配菜单与按钮的权限</h4>
      </template>
      <template #default>
        <el-tree ref="tree" :data="menuArr" show-checkbox default-expand-all node-key="id"
          :default-checked-keys="selectArr" :props="defaultProps" />
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer = false">取消</el-button>
          <el-button type="primary" @click="confirm">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang='ts'>
import { ref, onMounted, nextTick } from 'vue';
import { reqgetRole, reqAddOrUpdate, reqAllMenuList, reqSetPermisstion, reqRemoveRole } from '@/api/acl/role';
import { ResponseAllRole, Records, RoleData, MenuList, MenuResponseData } from '@/api/acl/role/type';
import useLayOutSettingStore from '@/store/modules/setting'
import { ElMessage } from 'element-plus';


let pageNo = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
let keyword = ref<string>('')
// 职位信息数组
let roleArr = ref<Records>([])
// 对话框显示与隐藏
let isshow = ref<boolean>(false)
// 收集职位信息
let roleParams = ref<RoleData>({
  id: 0,
  roleName: ''
})
let settingStore = useLayOutSettingStore()
// form实例
let form = ref()
// 控制抽屉的显示与隐藏
let drawer = ref<boolean>(false)
//获取tree组件实例
let tree = ref();
//准备一个数组:数组用于存储勾选的节点的ID(四级的)
let selectArr = ref<number[]>([]);
//定义数组存储用户权限的数据
let menuArr = ref<MenuList>([]);


// 第一次组件加载完毕钩子
onMounted(() => {
  getHasRole()
});

//获取全部用户信息的方法|分页器当前页码发生变化的回调
const getHasRole = async (pager = 1) => {
  pageNo.value = pager;
  let result: ResponseAllRole = await reqgetRole(pageNo.value, pageSize.value, keyword.value)
  if (result.code == 200) {
    roleArr.value = result.data.records;
    total.value = result.data.total;
  }
}
// 每页显示数据变化
const sizeChange = () => {
  getHasRole()
}
// 添加职务信息
const addRole = () => {
  // 清空之前信息
  roleParams.value = {
    roleName: '',
    id: 0
  }
  //清空上一次表单校验错误结果
  nextTick(() => {
    form.value.clearValidate('roleName');
  })
  isshow.value = true
}
// 编辑按钮的回调
const EditRole = (row: RoleData) => {
  //清空上一次表单校验错误结果
  nextTick(() => {
    form.value.clearValidate('roleName');
  })
  Object.assign(roleParams.value, row)
  isshow.value = true;
}
// 保存添加|修改信息的回调
const save = async () => {
  //表单校验结果,结果通过在发请求、结果没有通过不应该在发生请求
  await form.value.validate();
  //添加职位|更新职位的请求
  let result: any = await reqAddOrUpdate(roleParams.value)
  if (result.code == 200) {
    //提示文字
    ElMessage({ type: 'success', message: roleParams.value.id ? '更新成功' : '添加成功' });
    getHasRole(roleParams.value.id ? pageNo.value : 1);
    isshow.value = false;
  }
}
// 搜索按钮的回调
const search = () => {
  getHasRole()
  keyword.value = ''
}
// 重置按钮的回调
const reset = () => {
  settingStore.refsh = !settingStore.refsh
}

// roleName校验规则
const validateRoleName = (_rules: any, value: any, callback: any) => {
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error("职位至少为两位"))
  }
}
// 自定义校验规则
const rules = {
  roleName: [{ required: true, trigger: 'blur', validator: validateRoleName }],
}

// 分配权限按钮的回调
const setPermission = async (row: RoleData) => {
  // 打开抽屉
  drawer.value = true;
  //收集当前要分类权限的职位的数据
  Object.assign(roleParams.value, row);
  //根据职位获取权限的数据
  let result: MenuResponseData = await reqAllMenuList((row.id as number));
  if (result.code == 200) {
    menuArr.value = result.data;
    selectArr.value = filterSelectArr(menuArr.value, []);
  }
}
// 抽屉确定按钮的回调
const confirm = async () => {
  //职位的ID
  const roleId = (roleParams.value.id as number);
  //选中节点的ID
  let arr = tree.value.getCheckedKeys();
  //半选的ID
  let arr1 = tree.value.getHalfCheckedKeys();
  let permissionId = arr.concat(arr1);
  console.log(permissionId)
  //下发权限
  let result: any = await reqSetPermisstion(roleId, permissionId);
  if (result.code == 200) {
    //抽屉关闭
    drawer.value = false;
    //提示信息
    ElMessage({ type: 'success', message: '分配权限成功' });
    //页面刷新
    window.location.reload();
  }
}

// 显示属性组件的信息和展开的数组属性
const defaultProps = {
  children: 'children',
  label: 'name',
}

// 筛选数据中已被选中的id，赋值给已选中数组
const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((item: any) => {
    if (item.select && item.level == 4) {
      initArr.push(item.id);
    }
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr);
    }
  })
  return initArr;
}

// 删除角色职位的回调
const removeRole = async(id:number)=>{
  let result:any = await reqRemoveRole(id)
  if(result.code == 200){
    ElMessage({type:'success',message:'删除成功'})
    getHasRole(roleArr.value.length > 1 ? pageNo.value : pageNo.value - 1);
  }
}

</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center
}
</style>
