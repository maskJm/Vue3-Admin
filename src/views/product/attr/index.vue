<template>
  <div>
    <!-- 三级分类 -->
    <Category :scene="scene" />
    <!-- 属性值内容卡片 -->
    <el-card style="margin: 15px 0">
      <div v-show="scene">
        <el-button type="primary" icon="Plus" @click="addAttr"
          :disabled="categoryStore.c3Id ? false : true">添加属性</el-button>
        <el-table border style="margin: 10px 0" :data="attrArr">
          <el-table-column label="序号" type="index" align="center" width="180px"></el-table-column>
          <el-table-column label="属性名称" align="center" width="200px" prop="attrName"></el-table-column>
          <el-table-column label="属性值名称" align="center" prop="attrValueList">
            <template #="{ row}">
              <el-tag v-for="item in row.attrValueList" :key="item.id" style="margin:5px">{{ item.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200px">
            <template #="{row}">
            <el-button icon="Edit" size="small" type="primary" @click="updateAttr(row)"></el-button>
            <el-button icon="Delete" size="small" type="primary" @click="removeAttr(row.id)"></el-button>
          </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加或修改 -->
      <div v-show="!scene">
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input placeholder="请你输入属性名称" v-model="attrParams.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="Plus" @click="addAttrValue"
          :disabled="attrParams.attrName ? false : true">添加属性值</el-button>
        <el-button type="primary" @click="cancel">取消</el-button>
        <el-table border style="margin: 10px 0" :data="attrParams.attrValueList">
          <el-table-column label="序号" width="160px" align="center" type="index"></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-input :ref="(vc: any) => inputArr[$index] = vc" v-if="row.flag" @blur="toLook(row, $index)"
                size="small" placeholder="请你输入属性值名称" v-model="row.valueName"></el-input>
              <div v-else @click="toEdit(row, $index)"> {{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #="{$index}">
              <el-button type="primary" size="small" icon="Delete" @click="attrParams.attrValueList.splice($index, 1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="save"
          :disabled="attrParams.attrValueList.length > 0 ? false : true">保存</el-button>
        <el-button type="primary" @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang='ts'>
//组合式API函数watch
import { watch, ref, reactive, nextTick, onBeforeUnmount } from 'vue';
//引入获取已有属性与属性值接口
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from '@/api/product/attr'
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type';
import useCategoryStore from '@/store/modules/category';
import { ElMessage } from 'element-plus';
const categoryStore = useCategoryStore()
let scene = ref(true)
//存储已有的属性与属性值
let attrArr = ref<Attr[]>([])
//准备一个数组:将来存储对应的组件实例el-input
let inputArr = ref<any>([]);
//收集新增的属性的数据
let attrParams = reactive<Attr>({
  attrName: "",//新增的属性的名字
  attrValueList: [],//新增的属性值数组
  categoryId: '',//三级分类的ID
  categoryLevel: 3,//代表的是三级分类
})
// 监听c3Id的变化来获取属性及属性值
watch(() => categoryStore.c3Id, () => {
  // 清空上次获取的数据
  attrArr.value = [];
  // 保证三级分类存在才发请求
  if (!categoryStore.c3Id) return;
  // 获取属性，属性值
  getAttr()
})
// 获取属性，属性值
const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore;
  let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  // console.log(result)
  if (result.code == 200) {
    attrArr.value = result.data;
  }
}

// 添加切换添加属性部分
const addAttr = async () => {
  //每一次点击的时候,先清空一下数据再收集数据
  Object.assign(attrParams, {
    attrName: "",//新增的属性的名字
    attrValueList: [//新增的属性值数组
    ],
    categoryId: categoryStore.c3Id,//三级分类的ID
    categoryLevel: 3,//代表的是三级分类
  })
  //切换为添加与修改属性的结构
  scene.value = false;
  console.log("add")
}
// 更新属性值
const updateAttr = (row: Attr) => {
  //将已有的属性对象赋值给attrParams对象即为
  //ES6->Object.assign进行对象的合并
  console.log(row)
  // Object.assign(attrParams, row) 浅拷贝修改未保存也会显示
  // 深拷贝
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
  scene.value = false;
  console.log("update")

}
// 删除属性值
const removeAttr = async(id:number)=>{
  let result:any = await reqRemoveAttr(id);
  //删除成功
  if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除成功'
        })
        //获取一次已有的属性与属性值
        getAttr();
    } else {
        ElMessage({
            type: 'error',
            message: '删除失败'
        })
    }
}
//添加属性值按钮的回调
const addAttrValue = () => {
  //点击添加属性值按钮的时候,向数组添加一个属性值对象
  attrParams.attrValueList.push({
    valueName: '',
    flag: true, //控制每一个属性值编辑模式与切换模式的转变
  })
  //获取最后el-input组件聚焦
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus();
  })
}
//将input框转变为div文本内容
const toLook = (row: AttrValue, $index: number) => {
  // 非法情况1
  if (row.valueName.trim() == '') {
    // 删除调用对应属性值为空的元素
    attrParams.attrValueList.splice($index, 1);
    ElMessage({
      type: 'error',
      message: '属性值不能为空'
    })
    return;
  }
  // 非法情况2 =>重复值出现
  let repeat = attrParams.attrValueList.find((item) => {
    //切记把当前失却焦点属性值对象从当前数组扣除判断
    if (item != row) {
      return item.valueName === row.valueName;
    }
  });
  if (repeat) {
    //将重复的属性值从数组当中干掉
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '输入属性值不能重复'
    })
    return;
  }
  row.flag = false;
}
// 将div模式切换到编辑模式
const toEdit = (row: AttrValue, $index: number) => {
  row.flag = true;
  //nextTick:响应式数据发生变化,获取更新的DOM(组件实例)
  nextTick(() => {
    inputArr.value[$index].focus();
  })

}

// 添加或修改表单
// 保存的回调
const save = async () => {
  let result: any = await reqAddOrUpdateAttr(attrParams)
  console.log(result);
  //添加属性|修改已有的属性已经成功
  if (result.code == 200) {
    //切换场景
    scene.value = true;
    //提示信息
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功'
    });
    //获取全部已有的属性与属性值
    getAttr();
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失败' : '添加失败'
    })
  }

}

// 取消操作
const cancel = () => {
  scene.value = true;
}

//路由组件销毁的时候，把仓库分类相关的数据清空
onBeforeUnmount(() => {
  //清空仓库的数据
  categoryStore.$reset();
})



</script>

<style scoped></style>
