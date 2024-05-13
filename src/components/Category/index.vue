<template>
  <!-- 三级分类 -->
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <!-- change:选中值发生变化时触发 -->
        <el-select :disabled="scene? false:true" style="width: 200px" v-model="categoryStore.c1Id" @change="handle1">
          <el-option v-for="(c1) in categoryStore.c1Arr" :key="c1.id" :label="c1.name" :value="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select :disabled="scene? false:true" style="width: 200px" v-model="categoryStore.c2Id" @change="handle2">
          <el-option v-for="c2 in categoryStore.c2Arr" :label="c2.name" :value="c2.id" :key="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select :disabled="scene? false:true" style="width: 200px" v-model="categoryStore.c3Id" >
          <el-option v-for="c3 in categoryStore.c3Arr" :label="c3.name" :value="c3.id" :key="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang='ts'>

import { onMounted } from 'vue';
import useCategoryStore from '@/store/modules/category.ts'
const categoryStore = useCategoryStore()

onMounted(() => {
  getC1()
})
const getC1 = () => {
  categoryStore.getC1()
}
//此方法即为一级分类下拉菜单的change事件(选中值的时候会触发,保证一级分类ID有了)
const handle1 = () => {
  //需要将二级、三级分类的数据清空
  categoryStore.c2Id = ''
  categoryStore.c3Arr = []
  categoryStore.c3Id = ''
  //通知仓库获取二级分类的数据
  categoryStore.getC2()
}
//此方法即为二级分类下拉菜单的change事件(选中值的时候会触发,保证二级分类ID有了)
const handle2 = () => {
  categoryStore.c3Id = ''
  categoryStore.getC3()
}
//获取父组件传过来的属性值
defineProps(["scene"])

</script>

<style scoped></style>