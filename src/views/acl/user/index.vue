<template>
  <div>
    <el-card style="height: 80px;">
      <el-form class="form">
        <el-form-item :inline="true" label="用户名:">
          <el-input placeholder="输入搜索用户名" v-model="keyWord"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchUser" :disabled="keyWord.length ? false : true">搜索</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin: 16px 0;">
      <el-button v-has="'btn.User.add'" type="primary" @click="addUser">添加用户</el-button>
      <el-button type="primary" @click="deleteAll" :disabled="selectId.length ? false : true">批量删除</el-button>
      <el-table border style="margin:20px 0" :data="UserArr" @selection-change="selectChange">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column label="#" type="index" align="center" width="80px"></el-table-column>
        <el-table-column label="ID" align="center" width="80px" prop="id"></el-table-column>
        <el-table-column label="用户名字" align="center" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户昵称" align="center" prop="username" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户角色" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="300px" align="center">
          <template #="{ row }">
            <el-button v-has="'btn.User.assgin'" icon="User" type="primary" size="small"
              @click="toRole(row)">分配角色</el-button>
            <el-button v-has="'btn.User.update'" icon="Edit" type="success" size="small"
              @click="toEdit(row)">编辑</el-button>
            <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" :title="`你确定要删除${row.name}?`"
              @confirm="deleteUser(row)" width="220px">
              <template #reference>
                <el-button v-has="'btn.User.remove'" icon="Delete" type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 7, 9, 11]"
        :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total" @size-change="SizeChange"
        @current-change="getHasUser" />
      <!-- 添加修改用户抽屉 -->
      <el-drawer v-model="drawer">
        <template #header>
          <h4>{{ UserParams.id ? "修改用户" : "添加用户" }}</h4>
        </template>
        <template #default>
          <el-form :model="UserParams" :rules="rules" ref="formRef">
            <el-form-item label="用户姓名" prop="name">
              <el-input placeholder="请输入用户姓名" v-model="UserParams.name"></el-input>
            </el-form-item>
            <el-form-item label="用户昵称" prop="username">
              <el-input placeholder="请输入用户昵称" v-model="UserParams.username"></el-input>
            </el-form-item>
            <el-form-item label="用户密码" prop="password" v-if="!UserParams.id">
              <el-input placeholder="请输入用户密码" v-model="UserParams.password"></el-input>
            </el-form-item>
          </el-form>
        </template>
        <template #footer>
          <div style="flex: auto">
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="save">确认</el-button>
          </div>
        </template>
      </el-drawer>
      <!-- 分配职务抽屉 -->
      <el-drawer v-model="drawer1">
        <template #header>
          <h4>分配职务</h4>
        </template>
        <template #default>
          <el-form>
            <el-form-item label="用户姓名">
              <el-input :placeholder="UserParams.name" :disabled="UserParams ? true : false"></el-input>
            </el-form-item>
            <el-form-item label="用户职务">
              <el-checkbox @change="handleCheckAllChange" v-model="checkAll"
                :indeterminate="isIndeterminate">全选</el-checkbox>
              <el-checkbox-group v-model="roleIdList" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="role in AllRoleList" :key="role.id" :value="role.id">
                  {{ role.roleName }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </template>
        <template #footer>
          <div style="flex: auto">
            <el-button @click="RoleCancel">取消</el-button>
            <el-button type="primary" @click="RoleSave">确认</el-button>
          </div>
        </template>
      </el-drawer>
    </el-card>
  </div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted } from 'vue'
import { reqGetInfo, reqAddOrUpdate, reqDeleteUser, reqGetAllRole, reqSetRole, reqSelectUser } from '@/api/acl/user'
import { UserResponseData, User, AllRoleResponseData, SetRoleData, AllRole } from '@/api/acl/user/type'
import { ElMessage } from 'element-plus';
import useLayOutSettingStore from '@/store/modules/setting'
// 分页器页数
let pageNo = ref<number>(1)
// 一页多少条数据
let pageSize = ref<number>(5)
// 一页多少条数据
let total = ref<number>(0)
// 抽屉显示与隐藏
let drawer = ref<boolean>(false)
// 用户数据
let UserArr = ref<User[]>([])
// 收集新用户信息
let UserParams = reactive<User>({
  name: '',
  username: '',
  password: ''
})
//获取form组件实例
let formRef = ref<any>();
// 抽屉显示与隐藏
let drawer1 = ref<boolean>(false)
// 全选按钮
let checkAll = ref<boolean>(false);
// 设置不确定状态，仅负责样式控制
let isIndeterminate = ref<boolean>(true);
// 所有的用户职务
let AllRoleList = ref<AllRole>([])
// 已有的用户职务
let UserRoles = ref<AllRole>([])
let roleIdList = ref<number[]>([])
// 搜索单词
let keyWord = ref<string>('')
// 获取模板setting仓库
let settingStore = useLayOutSettingStore()
// 批量删除用户的列表
let selectId = ref<User[]>([])

// 加载完毕后钩子
onMounted(() => {
  getHasUser()

})

// 获取数据
const getHasUser = async (pager = 1) => {
  // 收集当前页码
  pageNo.value = pager;
  let result: UserResponseData = await reqGetInfo(pageNo.value, pageSize.value, keyWord.value)
  if (result.code == 200) {
    UserArr.value = result.data.records;
    total.value = result.data.total;
  } else {
    ElMessage({
      type: "error",
      message: result.message
    })
  }
}
// 每页数据改变时
const SizeChange = () => {
  getHasUser()
}

// 添加用户
const addUser = () => {
  // 清除上一次数据
  Object.assign(UserParams, {
    id: 0,
    username: '',
    name: '',
    password: ''
  });
  // 抽屉显示
  drawer.value = true;
}
// 点击编辑按钮的回调
const toEdit = (row: User) => {
  // 将已有数据进行赋值
  Object.assign(UserParams, row)
  // 打开抽屉
  drawer.value = true;

}
//校验用户名字回调函数
const validatorname = (_rule: any, value: any, callback: any) => {
  //用户名字|昵称,长度至少五位
  if (value.trim().length >= 5) {
    callback();
  } else {
    callback(new Error('用户名字至少五位'))
  }
}
//校验用户昵称回调函数
const validatorUsername = (_rule: any, value: any, callback: any) => {
  //用户名字|昵称,长度至少五位
  if (value.trim().length >= 5) {
    callback();
  } else {
    callback(new Error('用户昵称至少五位'))
  }
}
//校验用户密码回调函数
const validatorPassword = (_rule: any, value: any, callback: any) => {
  //用户密码,长度至少六位
  if (value.trim().length >= 6) {
    callback();
  } else {
    callback(new Error('用户密码至少六位'))
  }
}

// 自定义表单校验规则
//表单校验的规则对象
const rules = {
  //用户名字
  name: [{ required: true, trigger: 'blur', validator: validatorname }],
  //用户昵称
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  //用户的密码
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}

// 添加/更新用户信息中保存按钮的回调
const save = async () => {
  //点击保存按钮的时候,务必需要保证表单全部复合条件在去发请求
  await formRef.value.validate()
  //保存按钮:添加新的用户|更新已有的用户账号信息
  let result: any = await reqAddOrUpdate(UserParams)
  console.log(111, result)
  //关闭抽屉
  drawer.value = false;
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: UserParams.id ? '更新成功' : '添加成功'
    })
    //获取最新的全部账号的信息
    // getHasUser(UserParams.id ? pageNo.value : 1);
    //浏览器自动刷新一次
    window.location.reload();
  } else {
    //提示消息
    ElMessage({ type: 'error', message: result.message });
  }
}
//取消按钮的回调
const cancel = () => {
  //关闭抽屉
  drawer.value = false;
}
//删除用户的回调
const deleteUser = async (row: any) => {
  let result: any = await reqDeleteUser(row.id)
  // console.log(result)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
  } else {
    ElMessage({
      type: 'error',
      message: result.messae
    })
  }
  // 回到首页
  getHasUser()
}

//分配职务按钮的回调
const toRole = async (row: any) => {
  // 将已有本行数据保存
  Object.assign(UserParams, row);
  let result: AllRoleResponseData = await reqGetAllRole(row.id)
  console.log(200,result.data)
  if (result.code == 200) {
    AllRoleList.value = result.data.allRolesList
    UserRoles.value = result.data.assignRoles
    roleIdList.value = UserRoles.value.map(item => {
      return (item.id as number)
    })
  }
  // 显示分配职务的抽屉
  drawer1.value = true;
}
// 角色抽屉全选按钮的回调
const handleCheckAllChange = (val: any)=> {
  //val:true(全选)|false(没有全选)
  // console.log("allbox",val)
  UserRoles.value = val ? AllRoleList.value : []
  //不确定的样式(确定样式)
  isIndeterminate.value = false
}
// 角色抽屉复选按钮的回调
const handleCheckedCitiesChange = (value: any[])=> {
  //顶部复选框的勾选数据
  // console.log("box",value)
  //代表:勾选上的项目个数与全部的职位个数相等，顶部的复选框勾选上
  checkAll.value = value.length === AllRoleList.value.length;
  //不确定的样式
  isIndeterminate.value = value.length !== AllRoleList.value.length
}
// 关闭角色抽屉
const RoleCancel = () => {
  drawer1.value = false;
}
// 保存角色抽屉数据
const RoleSave = async () => {
  //收集参数
  let data: SetRoleData = {
    userId: (UserParams.id as number),
    roleIdList: roleIdList.value
  }
  let result: any = await reqSetRole(data)
  // console.log(result)
  if (result.code == 200) {
    //提示信息
    ElMessage({ type: 'success', message: '分配职务成功' });
    //关闭抽屉
    drawer1.value = false;
    //获取更新完毕用户的信息,更新完毕留在当前页
    getHasUser(pageNo.value);

  }
}
// 复选框中选择项发生变化时会触发该事件
const selectChange = (val: any) => {
  selectId.value = val
}
// 批量删除按钮的回调
const deleteAll = async () => {
  // 整理选项框中收集的数据，将其中id存入到另一个数组中
  let idList: any = selectId.value.map(item => item.id);
  // 发送删除请求
  let result: any = await reqSelectUser(idList)
  console.log(idList)
  console.log(result)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' });
    getHasUser(UserArr.value.length > 1 ? pageNo.value : pageNo.value - 1);
  }

}
// 搜索按钮的回调函数
const searchUser = () => {
  getHasUser(),
    keyWord.value = '';
}
// 重置按钮的回调函数
const reset = () => {
  settingStore.refsh = !settingStore.refsh;
}

</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 30px;
}
</style>
