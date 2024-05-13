<template>
  <div>
    <el-table :data="MenuList" style="width: 100%;margin-bottom: 20%" row-key="id" border>
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="权限值" prop="code"></el-table-column>
      <el-table-column label="修改时间" prop="updateTime"></el-table-column>
      <el-table-column label="操作">
        <template #="{ row }">
          <el-button v-has="'btn.Permission.add'" type="primary" size="default" @click="addMenu(row)"  :disabled="row.level == 4 ? true : false">
            {{row.level == 3 ? '添加功能': '添加菜单' }}</el-button>
          <el-button v-has="'btn.Permission.update'" type="warning" size="default" @click="editMenu(row)"
          :disabled="row.level == 1 ? true : false">编辑</el-button>
          <el-popconfirm :title="`你确定要删除${row.name}?`" width="260px" @confirm="removeMenu(row.id)">
            <template #reference>
              <el-button v-has="'btn.Permission.remove'" type="danger" size="default" :disabled="row.level == 1 ? true : false">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="isshow" :title="MenuParams.id ? '修改菜单' : '新增菜单'" width="600">
      <el-form style="margin-top: 20px;">
        <el-form-item label="名称">
          <el-input placeholder="请你输入菜单名称" v-model="MenuParams.name"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-input placeholder="请你输入权限数值" v-model="MenuParams.code"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="isshow = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </template>
    </el-dialog>


  </div>
</template>

<script setup lang='ts'>
import { ref, onMounted, reactive } from 'vue'
import { reqAllMenuList, reqAddOrUpdateMenu, reqRemoveMenu } from '@/api/acl/menu'
import type { ResponseAllMenuData, MenuDataList, MenuParams } from '@/api/acl/menu/type'
import { ElMessage } from 'element-plus';

// 全部菜单数据
let MenuList = ref<MenuDataList>([])
// 控制对话框的隐藏与现实
let isshow = ref<boolean>(false)
// 收集新增|修改 菜单属性
let MenuParams = reactive<MenuParams>({
  id: 0,
  "code": "",
  "level": 0,
  "name": "",
  "pid": 0,
})

onMounted(() => {
  getAllMenuList()
})

// 获取全部的菜单数据
const getAllMenuList = async () => {
  let result: ResponseAllMenuData = await reqAllMenuList()
  if (result.code == 200) {
    MenuList.value = result.data;
  }
}

// 添加菜单
const addMenu = (row: MenuParams) => {
  Object.assign(MenuParams, {
    id: 0,
    "code": "",
    "level": 0,
    "name": "",
    "pid": 0,

  })
  //收集新增的菜单的level数值
  MenuParams.level = row.level + 1;
  //给谁新增子菜单
  MenuParams.pid = (row.id as number);
  // 打开对话框
  isshow.value = true;
}
// 编辑对话框
const editMenu = (row: MenuParams) => {
  //点击修改按钮:收集已有的菜单的数据进行更新
  Object.assign(MenuParams, row)
  // 打开对话框
  isshow.value = true;
}

// 确定按钮的回调
const save = async () => {
  let result = await reqAddOrUpdateMenu(MenuParams)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: MenuParams.id ? '更新成功' : '添加成功'
    })
    // 关闭对话框
    isshow.value = false;
    // 重新获取菜单数据
    getAllMenuList()
  }
}

//删除按钮回调
const removeMenu = async (id: number) => {
  let result = await reqRemoveMenu(id);
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' });
    getAllMenuList();
  }
}
</script>

<style scoped></style>
