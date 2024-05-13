<template>
  <div>
    <!-- 分类列表 -->
    <category :scene="scene"></category>
    <!-- 显示spu卡片 -->
    <el-card style="margin: 15px 0">
      <div v-show="page == 0">
        <el-button @click="addSpu" type="primary" icon="Plus"
          :disabled="categoryStore.c3Id ? false : true">添加SPU</el-button>
        <el-table border style="margin: 10px 0" :data="records">
          <el-table-column label="序号" type="index" width="120px" align="center"></el-table-column>
          <el-table-column label="SPU名称" width="300px" align="center" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" align="center" prop="description"></el-table-column>
          <el-table-column label="SPU操作" width="300px" align="center">
            <template #="{ row }">
              <el-button type="primary" icon="Plus" @click="addSku(row)"></el-button>
              <el-button type="success" icon="Edit" @click=toUpdate(row)></el-button>
              <el-button type="warning" icon="View" @click="showSku(row)"></el-button>
              <el-popconfirm :title="`你确定删除${row.spuName}?`" width="200px" @confirm="deleteSpu(row)">
                <template #reference>
                  <el-button type="danger" size="default" icon="Delete" title="删除SPU"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
          :background="true" :pager-count="6" layout=" prev, pager, next, jumper,->,sizes,total" :total="total"
          @size-change="changeSize" @current-change="getHasSpu" />
      </div>
      <!-- 添加SPU|修改SPU子组件 -->
      <SpuForm ref="spu" v-show="page == 1" @changePage="changePage"></SpuForm>
      <!-- 添加SKU的子组件 -->
      <SkuForm ref="sku" v-show="page == 2" @changePage="changePage"></SkuForm>
      <!-- sku对话框 -->
      <el-dialog v-model="show" title="SKU数据展示">
        <el-table border :data="skuArr">
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #="{ row }">
              <img :src="row.skuDefaultImg" style="width: 100px;height: 100px;">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang='ts'>
import { ref, watch, onBeforeUnmount } from 'vue';
import { reqHasSpu, reqRemoveSpu, reqSkuInfo } from '@/api/product/spu'
import type { Records, SpuData, SkuData, SkuInfoData } from '@/api/product/spu/type'
import SpuForm from './spuForm.vue'
import SkuForm from './skuForm.vue'
import useCategoryStore from '@/store/modules/category';
import { ElMessage } from 'element-plus';
let categoryStore = useCategoryStore()
// 显示那个页面
let page = ref<number>(0)  //0:显示已有SPU  1:添加或者修改已有SPU  2：添加sku
//分页器默认页码
let pageNo = ref<number>(1)
//每一页展示几条数据
let pageSize = ref<number>(3);
const total = ref<number>(0)
// spu已有数据
let records = ref<Records>([])
//获取子组件实例SpuForm
let spu = ref();
//获取子组件实例SkuForm
let sku = ref();
// 是否显示sku数据对话框
let show = ref<boolean>(false)
// 存储sku数据
let skuArr = ref<SkuData[]>([]);
//场景的数据
let scene = ref<boolean>(true); //true:显示已有SPU  false:添加或者修改已有SPU
//监听三级分类ID变化==>展示数据
watch(() => categoryStore.c3Id, () => {
  // 三级分类变化时，清空已有数据
  records.value = []
  if (!categoryStore.c3Id) return;
  getHasSpu()
})
//删除已有的SPU按钮的回调
const deleteSpu = async (row: SpuData) => {
  let result: any = await reqRemoveSpu((row.id as number));
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    });
    //获取剩余SPU数据
    getHasSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
}
//分页器下拉菜单发生变化的时候触发
const changeSize = () => {
  getHasSpu()
}
//此方法执行:可以获取某一个三级分类下全部的已有的SPU
const getHasSpu = async (pager = 1) => {
  //当页面发生改变时，会传递一个参数当前页面的值，pager此时等于pageNo的值
  //修改当前页码
  pageNo.value = pager;
  let result = await reqHasSpu(pageNo.value, pageSize.value, categoryStore.c3Id)
  if (result.code == 200) {
    records.value = result.data.records;
    total.value = result.data.total;
  }
}
//子组件SpuForm绑定自定义事件:目前是让子组件通知父组件切换场景为0
const changePage = (obj: any) => {
  page.value = obj.flag
}
// 添加Spu信息
const addSpu = () => {
  page.value = 1;
  //点击添加SPU按钮,调用子组件的方法初始化数据
  spu.value.initAddSpu(categoryStore.c3Id);
}
// 去编辑页面
const toUpdate = (row: SpuData) => {
  page.value = 1;
  //调用子组件实例方法获取完整已有的SPU的数据
  spu.value.initHasSpuData(row);
}
// 添加sku信息
const addSku = (row: any) => {
  page.value = 2;
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}

// 展示对话框sku信息
const showSku = async (row: any) => {
  let result: SkuInfoData = await reqSkuInfo(row.id)
  console.log(result)
  if (result.code == 200) {
    skuArr.value = result.data;
    //对话框显示出来
    show.value = true;
  }

}

//路由组件销毁的时候，把仓库分类相关的数据清空
onBeforeUnmount(() => {
  //清空仓库的数据
  categoryStore.$reset();
})
</script>

<style scoped></style>
