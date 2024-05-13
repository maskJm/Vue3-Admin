<template>
    <div>
        <el-form label-width="100px">
            <el-form-item label="SKU名称">
                <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
            </el-form-item>
            <el-form-item label="价格(元)">
                <el-input placeholder="价格(元)" type="number" v-model="skuParams.price"></el-input>
            </el-form-item>
            <el-form-item label="重量(g)">
                <el-input placeholder="重量(g)" type="number" v-model="skuParams.weight"></el-input>
            </el-form-item>
            <el-form-item label="SKU描述">
                <el-input placeholder="SKU描述" type="textarea" v-model="skuParams.skuDesc"></el-input>
            </el-form-item>
            <el-form-item label="平台属性">
                <el-form :inline="true">
                    <el-form-item v-for="(item) in attrArr " :key="item.id" :label="item.attrName">
                        <el-select v-model="item.attrIdAndValueId" style="width: 200px;margin-bottom:6px;">
                            <el-option v-for="(attrValue) in item.attrValueList" :value="`${item.id}:${attrValue.id}`"
                                :key="attrValue.id" :label="attrValue.valueName"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>
            <el-form-item label="销售属性">
                <el-form :inline="true">
                    <el-form-item v-for="(item) in saleArr" :key="item.id" :label="item.saleAttrName">
                        <el-select v-model="item.saleIdAndValueId" style="width: 200px;">
                            <el-option v-for="(saleAttrValue) in item.spuSaleAttrValueList"
                                :value="`${item.id}:${saleAttrValue.id}`" :key="saleAttrValue.id"
                                :label="saleAttrValue.saleAttrValueName"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>
            <el-form-item label="图片属性">
                <el-table border :data="imgArr" @select="handlerSelect()" style="margin: 10px 0" ref="table" @select-all="selectAll">
                    <el-table-column  type="selection" width="100px" align="center"></el-table-column>
                    <el-table-column label="图片" align="center">
                        <template #="{ row }">
                            <img :src="row.imgUrl" alt="" style="width:100px;height: 100px;">
                        </template>
                    </el-table-column>
                    <el-table-column label="名称" align=center prop="imgName"> </el-table-column>
                    <el-table-column label="操作" align=center>
                        <template #="{ row }">
                            <el-button type="primary" @click="handler(row)">设为默认</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button type="primary" @click="save">保存</el-button>
                <el-button type="warning" @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang='ts'>
import { ref} from 'vue'
import { SkuData } from '@/api/product/spu/type'
import { reqAttr } from '@/api/product/attr';
import { reqSpuImageList, reqSpuHasSaleAttr, reqAddSku } from '@/api/product/spu';
import { ElMessage } from 'element-plus';

//平台属性
let attrArr = ref<any>([]);
//销售属性
let saleArr = ref<any>([]);
//照片的数据
let imgArr = ref<any>([]);
// table实例
let table = ref()
//收集SKU的参数
let skuParams = ref<SkuData>({
    //父组件传递过来的数据
    category3Id: "",//三级分类的ID
    spuId: "",//已有的SPU的ID
    tmId: "",//SPU品牌的ID
    //v-model收集
    skuName: "",//sku名字
    price: "",//sku价格
    weight: "",//sku重量
    skuDesc: "",//sku的描述

    skuAttrValueList: [//平台属性的收集
    ],
    skuSaleAttrValueList: [//销售属性
    ],
    skuImageList:[],
    skuDefaultImg: "",//sku图片地址
})

//当前子组件的方法对外暴露
const initSkuData = async (c1Id: number | string, c2Id: number | string, spu: any) => {
    //收集数据
    skuParams.value.category3Id = spu.category3Id;
    skuParams.value.spuId = spu.id;
    skuParams.value.tmId = spu.tmId;
    //获取平台属性
    let result: any = await reqAttr(c1Id, c2Id, spu.category3Id);
    //获取对应的销售属性
    let result1: any = await reqSpuHasSaleAttr(spu.id);
    //获取照片墙的数据
    let result2: any = await reqSpuImageList(spu.id);
    //平台属性
    attrArr.value = result.data;
    //销售属性
    saleArr.value = result1.data;
    //图片
    imgArr.value = result2.data;
}
defineExpose({
    initSkuData
})

//取消按钮的回调
const cancel = () => {
    paramsNew()  //清空数据
    $emit('changePage', { flag: 0, params: '' });
}
//自定义事件的方法
let $emit = defineEmits(['changePage']);

const handlerSelect = ()=>{
    if(table.value.getSelectionRows().length != 1){
        // 多选表格，清空用户的选择
        table.value.clearSelection()
        ElMessage({
            type:'warning',
            message:'sku默认照片为一张'
        })
    }else{
        table.value.getSelectionRows().forEach((item : any) => {
            handler(item)
        });
    }
}
// 默认图片事件
const handler = (row: any) => {
    //选中的图片才勾选
    table.value.toggleRowSelection(row, true);
    //收集图片地址
    skuParams.value.skuDefaultImg = row.imgUrl;
}
// 还有问题，当点击所有单选框变成全选无法使其不成为只选择一个
const selectAll = ()=>{
    table.value.clearSelection()
}

// 保存的回调
const save = async()=>{
    //整理参数
    //平台属性
    skuParams.value.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
        if (next.attrIdAndValueId) {
            let [attrId, valueId] = next.attrIdAndValueId.split(':');
            prev.push({
                attrId,
                valueId
            })
        }
        return prev;
    }, []);
     //销售属性
     skuParams.value.skuSaleAttrValueList = saleArr.value.reduce((prev: any, next: any) => {
        if (next.saleIdAndValueId) {
            let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':');
            prev.push({
                saleAttrId, 
                saleAttrValueId
            })
        }
        return prev;
    }, []);
    
    // 照片墙
    skuParams.value.skuImageList = imgArr.value
    // 发送请求
    let result:any = await reqAddSku(skuParams.value)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '添加SKU成功'
        });
        //通知父组件切换场景为零
        paramsNew()  //清空数据
        $emit('changePage',{flag:0,params:''})
    } else {
        ElMessage({
            type: 'error',
            message: '添加SKU失败'
        })
    }
}

const paramsNew = ()=>{
    skuParams.value = {
    //父组件传递过来的数据
    category3Id: "",//三级分类的ID
    spuId: "",//已有的SPU的ID
    tmId: "",//SPU品牌的ID
    //v-model收集
    skuName: "",//sku名字
    price: "",//sku价格
    weight: "",//sku重量
    skuDesc: "",//sku的描述

    skuAttrValueList: [//平台属性的收集
    ],
    skuSaleAttrValueList: [//销售属性
    ],
    skuImageList:[],
    skuDefaultImg: "",//sku图片地址
    }
}
</script>

<style scoped></style>
