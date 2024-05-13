<template>
  <div>
    <el-card>
      <el-table border :data="skuArr" style="margin: 20px 0;">
        <el-table-column label="序号" type="index" width="100px" align="center"></el-table-column>
        <el-table-column label="名称" prop="skuName" idth="160px" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="描述" prop="skuDesc" width="160px" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="图片" width="160px" align="center">
          <template #="{ row }">
            <img :src="row.skuDefaultImg" style="width: 100px;height: 100px;">
          </template>
        </el-table-column>
        <el-table-column label="重量" prop="weight" align="center" width="160px"></el-table-column>
        <el-table-column label="价格" prop="price" align="center" width="160px"></el-table-column>
        <el-table-column label="操作" align="center" width="300px" fixed="right">
          <template #="{ row }">
            <el-button type="primary" size="small" :icon="row.isSale === 1 ? 'Top' : 'Bottom'"
              @click="toIsSale(row)"></el-button>
            <el-button type="primary" size="small" icon="Edit" @click="Edit"></el-button>
            <el-button type="primary" size="small" icon="InfoFilled" @click="getInfo(row.id)"></el-button>
            <el-popconfirm :title="`你确定要删除${row.skuName}?`" width="200px" @confirm="DeleteSku(row.id)">
              <template #reference>
                <el-button type="primary" size="small" icon="Delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
        :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total" @current-change="getHasSku"
        @size-change="handler" />
      <el-drawer v-model="drawer" title="SKU详情页面">
        <template #default>
          <el-row style="margin: 10px 0;">
            <el-col :span="6">名称</el-col>
            <el-col :span="18" class="textInfo">{{ skuInfo.skuName }}</el-col>
          </el-row>
          <el-row style="margin:16px 0px;">
            <el-col :span="6">描述</el-col>
            <el-col :span="18" class="textInfo">{{ skuInfo.skuDesc }}</el-col>
          </el-row>
          <el-row style="margin:16px 0px;">
            <el-col :span="6">价格</el-col>
            <el-col :span="18">{{ skuInfo.price }}</el-col>
          </el-row>
          <el-row style="margin:10px 0px;">
            <el-col :span="6">平台属性</el-col>
            <el-col :span="18">
              <el-tag style="margin-right:5px; margin-bottom:10px" v-for="item in skuInfo.skuAttrValueList" :key="item.id">{{
        item.valueName }}</el-tag>
            </el-col>
          </el-row>
          <el-row style="margin:10px 0px;">
            <el-col :span="6">销售属性</el-col>
            <el-col :span="18">
              <el-tag style="margin-right:5px; margin-bottom:10px" v-for="item in skuInfo.skuSaleAttrValueList" :key="item.id">{{
        item.saleAttrValueName }}</el-tag>
            </el-col>
          </el-row>
          <el-row style="margin:10px 0px;">
            <el-col :span="6">商品图片</el-col>
            <el-col :span="18">
              <el-carousel :interval="4000" type="card" height="180px">
                <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                  <img :src="item.imgUrl" alt="" style="width:100%;height: 100%;">
                </el-carousel-item>
              </el-carousel>
            </el-col>
          </el-row>

        </template>
      </el-drawer>

    </el-card>
  </div>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue';
import { reqSkuList, reqSale, reqCancelSale, reqRemoveSku, reqgetSku } from "@/api/product/sku"
//引入ts类型
import type { SkuResponseData, SkuData, SkuInfoData } from '@/api/product/sku/type';
import { ElMessage } from 'element-plus';

//分页器当前页码
let pageNo = ref<number>(1);
//每一页展示几条数据
let pageSize = ref<number>(6);
let total = ref<number>(0);
let skuArr = ref<SkuData[]>([]);
//抽屉相关
let drawer = ref<boolean>(false)
let skuInfo = ref<any>({});
onMounted(() => {
  getHasSku();
})

const getHasSku = async (pager = 1) => {
  //当前分页器的页码
  pageNo.value = pager;
  let result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value);
  if (result.code == 200) {
    total.value = result.data.total;
    skuArr.value = result.data.records;
  }
}
//分页器下拉菜单发生变化触发
const handler = (pageSizes: number) => {
  console.log("123", pageSizes)
  getHasSku();
}

// 上架下架的回调方法
const toIsSale = async (row: any) => {
  // 已上架 ==> 下架
  if (row.isSale === 1) {
    //下架操作
    await reqCancelSale((row.id as number));
    //提示信息
    ElMessage({ type: 'success', message: '下架成功' });
    //发请求获取当前更新完毕的全部已有的SKU
    getHasSku(pageNo.value);
  } else {
    //上架操作
    await reqSale((row.id as number));
    //提示信息
    ElMessage({ type: 'success', message: '上架成功' });
    //发请求获取当前更新完毕的全部已有的SKU
    getHasSku(pageNo.value);
  }
}
//编辑方法的回调
const Edit = () => {
  ElMessage({
    type: 'success',
    message: '程序员正在努力加班中...'
  })
}
// 获取sku详情
const getInfo = async (skuId: number) => {
  let result: SkuInfoData = await reqgetSku(skuId)
  console.log(121, result)
  if (result.code == 200) {
    drawer.value = true
    skuInfo.value = result.data
  }

}
//删除sku的回调
const DeleteSku = async (skuId: number) => {
  let result: any = await reqRemoveSku(skuId);
  if (result.code == 200) {
    //提示信息
    ElMessage({ type: 'success', message: '删除成功' });
    //获取已有全部商品
    getHasSku(skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1);
  } else {
    //删除失败
    ElMessage({ type: 'error', message: '系统数据不能删除' });
  }
}
</script>

<style scoped lang="scss">
.textInfo{
  letter-spacing: 0.8px; /* 增加字符间距 */
  line-height: 1.4; 
}

</style>
