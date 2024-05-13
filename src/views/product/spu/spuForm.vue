<template>
    <div>
        <el-form label-width="100px">
            <el-form-item label="SPU名称">
                <el-input placeholder="请您输入SPU名称" v-model="SpuParams.spuName"></el-input>
            </el-form-item>
            <el-form-item label="SPU品牌">
                <el-select style="width:200px" v-model="SpuParams.tmId">
                    <el-option v-for="item in AllTradeList" :label="item.tmName" :value="item.id"
                        :key="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="SPU描述">
                <el-input type="textarea" placeholder="请您输入SPU描述" v-model="SpuParams.description"></el-input>
            </el-form-item>
            <el-form-item label="SPU图片">

                <!-- v-model:fileList->展示默认图片 
                 action:上传图片的接口地址
                 list-type:文件列表的类型
                -->
                <el-upload v-model:file-list="imgList" action="/api/admin/product/fileUpload"
                    list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove"
                    :before-upload="handlerUpload">
                    <el-icon>
                        <Plus />
                    </el-icon>
                </el-upload>
                <!-- 放大图片后效果 -->
                <el-dialog v-model="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="Preview Image" />
                </el-dialog>
            </el-form-item>
            <el-form-item label="SPU销售属性">
                <el-select style="width:200px" v-model="saleAttrIdAndValueName"
                    :placeholder="unSelectSaleAttr.length ? `还未选择${unSelectSaleAttr.length}个` : '无'">
                    <el-option v-for="item in unSelectSaleAttr" :label="item.name" :value="`${item.id}:${item.name}`"
                        :key="item.id"></el-option>
                </el-select>
                <el-button style="margin: 0 10px" icon="Plus" type="primary" @click="addSaleAttr"
                    :disabled="saleAttrIdAndValueName ? false : true">添加属性</el-button>
            </el-form-item>
            <el-form-item>
                <el-table border :data="hasSaleAttr">
                    <el-table-column label="序号" type="index" width="120px" align="center"></el-table-column>
                    <el-table-column label="销售属性名字" width="200px" align="center" prop="saleAttrName"></el-table-column>
                    <el-table-column label="销售属性值" align="center">
                        <template #="{ row }">
                            <el-tag style="margin:0 5px" @close="row.spuSaleAttrValueList.splice(index, 1)"
                                v-for="(item, index) in row.spuSaleAttrValueList" :key="row.id" :closable="true">
                                {{ item.saleAttrValueName }}
                            </el-tag>
                            <el-input ref="focusIn" @blur="toLook(row)" v-model="row.saleAttrValue"
                                v-if="row.flag == true" placeholder="请你输入属性值" size="small"
                                style="width:100px"></el-input>
                            <el-button @click="toInput(row)" v-else type="primary" size="small" icon="Plus"></el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="300px" align="center">
                        <template #="{ $index }">
                            <el-button type="danger" size="small" icon="Delete"
                                @click="hasSaleAttr.splice($index, 1)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="save">保存</el-button>
                <el-button type="primary" size="default" @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang='ts'>
import { ref, computed, nextTick } from 'vue'
import { TradeMark, SpuData, AllTradeMark, SpuHasImg, AttrValue, SaleAttrResponseData, AllAttr, SaleAttr, failImg, SaleAttrValue } from '@/api/product/spu/type'
import { reqAllTradeMark, reqSpuImageList, reqAllSaleAttr, reqSpuHasSaleAttr, reqAddOrUpdateSpu } from '@/api/product/spu'
import { ElMessage } from 'element-plus';

let $emit = defineEmits(["changePage"])
//商品图片
let imgList = ref<failImg[]>([]);
//存储已有的SPU品牌数据，小米，华为...
let AllTradeList = ref<TradeMark[]>([]);
//全部销售属性
let allSaleAttr = ref<AttrValue[]>([]);
//已有销售属性
let hasSaleAttr = ref<SaleAttr[]>([]);
//将来收集还未选择的销售属性的ID与属性值的名字
let saleAttrIdAndValueName = ref<string>('')
//存储已有的SPU对象
let SpuParams = ref<SpuData>({
    category3Id: "",//收集三级分类的ID
    spuName: "",//SPU的名字
    description: "",//SPU的描述
    tmId: '',//品牌的ID
    spuImageList: [],
    spuSaleAttrList: [],
});
//存储实例el-input==>获取焦点
const focusIn = ref();

const dialogImageUrl = ref<string>('')
const dialogVisible = ref<boolean>(false)
// 照片墙预览
const handlePictureCardPreview = (file: any) => {
    dialogImageUrl.value = file.url
    //对话框弹出来
    dialogVisible.value = true
}
// 照片墙删除
const handleRemove = () => {
    console.log(123);
}
//照片墙上传成功之前的钩子约束文件的大小与类型
const handlerUpload = (file: any) => {
    console.log("111", file)
    console.log("222", imgList.value)
    if (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/gif') {
        console.log("file--ok")
        if (file.size / 1024 / 1024 <= 4) {
            console.log("size--ok")
            return true;
        } else {
            ElMessage({
                type: 'error',
                message: '上传文件务必小于4M'
            })
            return false;
        }
    } else {
        ElMessage({
            type: 'error',
            message: '上传文件务必PNG|JPG|GIF'
        })
        return false;
    }
}
//添加销售属性的方法
const addSaleAttr = () => {
    /*
    "baseSaleAttrId": number,
    "saleAttrName": string,
    "spuSaleAttrValueList": SpuSaleAttrValueList
    */
    const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':');
    //准备一个新的销售属性对象:将来带给服务器即可
    let newSaleAttr: SaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
    }
    //追加到数组当中
    hasSaleAttr.value.push(newSaleAttr);
    //清空收集的数据
    saleAttrIdAndValueName.value = '';

}
//属性值按钮的点击事件
const toInput = (row: SaleAttr) => {
    //点击按钮的时候,input组件不就不出来->编辑模式
    row.flag = true;
    //nextTick:响应式数据发生变化,获取更新的DOM(组件实例)
    nextTick(() => {
        focusIn.value.focus();
    })
    row.saleAttrValue = ''
}
//表单元素失却焦点的事件回调
const toLook = (row: SaleAttr) => {
    //整理收集的属性的ID与属性值的名字
    const { baseSaleAttrId, saleAttrValue } = row;
    //整理成服务器需要的属性值形式
    let newSaleAttrValue: SaleAttrValue = {
        baseSaleAttrId,
        saleAttrValueName: (saleAttrValue as string)
    }

    //非法情况判断
    if ((saleAttrValue as string).trim() == '') {
        ElMessage({
            type: 'error',
            message: '属性值不能为空的'
        })
        row.flag = false;
        return;
    }
    //判断属性值是否在数组当中存在
    let repeat = row.spuSaleAttrValueList.find(item => {
        return item.saleAttrValueName == saleAttrValue;
    })

    if (repeat) {
        ElMessage({
            type: 'error',
            message: '属性值重复'
        })
        return;
    }
    //追加新的属性值对象
    row.spuSaleAttrValueList.push(newSaleAttrValue);
    //切换为查看模式
    row.flag = false;
}
// 初始化编辑页面时
const initHasSpuData = async (spu: SpuData) => {
    //存储已有的SPU对象,将来在模板中展示
    //spu:即为父组件传递过来的已有的SPU对象[不完整]
    console.log(spu);
    SpuParams.value = spu;
    //获取全部品牌的数据
    let result: AllTradeMark = await reqAllTradeMark()
    //获取某一个品牌旗下全部售卖商品的图片
    let result1: SpuHasImg = await reqSpuImageList((spu.id as number));
    //获取整个项目全部SPU的销售属性
    let result2: AllAttr = await reqAllSaleAttr();
    //获取已有的SPU销售属性的数据
    let result3: SaleAttrResponseData = await reqSpuHasSaleAttr((spu.id as number));
    console.log(result3)
    //存储全部品牌的数据
    AllTradeList.value = result.data;
    //SPU对应商品图片
    // imgList.value = result1.data;
    imgList.value = result1.data.map(item => {
        return {
            name: item.imgName as string,
            url: item.imgUrl as string
        }
    })
    //存储全部的销售属性
    allSaleAttr.value = result2.data;
    //存储已有的SPU的销售属性
    hasSaleAttr.value = result3.data;
}
// 初始化编辑页面时
const initAddSpu = async (c3Id: number | string) => {
    // 清空数据
    //清空数据
    Object.assign(SpuParams.value, {
        category3Id: "",//收集三级分类的ID
        spuName: "",//SPU的名字
        description: "",//SPU的描述
        tmId: '',//品牌的ID
        spuImageList: [],
        spuSaleAttrList: [],
    });
    //清空照片
    imgList.value = [];
    //清空销售属性
    hasSaleAttr.value = [];
    saleAttrIdAndValueName.value = '';
    //存储三级分类的ID
    SpuParams.value.category3Id = c3Id;
    //获取全部品牌的数据
    let result: AllTradeMark = await reqAllTradeMark()
    //获取整个项目全部SPU的销售属性
    let result1: AllAttr = await reqAllSaleAttr();
    //存储全部品牌的数据
    AllTradeList.value = result.data;
    //存储全部的销售属性
    allSaleAttr.value = result1.data;
}
//计算出当前SPU还未拥有的销售属性
let unSelectSaleAttr = computed(() => {
    //全部销售属性:颜色、版本、尺码
    //已有的销售属性:颜色、版本
    let unSelectArr = allSaleAttr.value.filter(item => {
        return hasSaleAttr.value.every(item1 => {
            return item.name != item1.saleAttrName;
        });
    })
    return unSelectArr;
})
// 保存添加Spu信息
const save = async () => {
    //整理参数
    //发请求:添加SPU|更新已有的SPU
    //成功
    //失败
    //1:照片墙的数据
    SpuParams.value.spuImageList = imgList.value.map((item: any) => {
        return {
            imgName: item.name,
            imgUrl: (item.response && item.response.data) || item.url
        }
    })
    //2:整理销售属性的数据
    SpuParams.value.spuSaleAttrList = hasSaleAttr.value;
    // 发请求:添加SPU|更新已有的SPU
    console.log(111,SpuParams.value)
    let result: any = await reqAddOrUpdateSpu(SpuParams.value)
    if (result.code == 200) {
        ElMessage({
            type: "success",
            message: SpuParams.value.id ? '更新成功' : '添加成功'
        })
        // 返回展示页面
        $emit('changePage', { flag: 0, params: SpuParams.value.id ? 'update' : 'add' })
    } else {
        ElMessage({
            type: "error",
            message: SpuParams.value.id ? '更新失败' : '添加失败'
        })
    }
}
// 取消添加
const cancel = () => {
    // 返回显示页面
    $emit('changePage', { flag: 0, params: 'update' })
}

//对外暴露
defineExpose({ initHasSpuData, initAddSpu })
</script>

<style scoped></style>
