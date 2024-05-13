// spu相关api接口
import request from '@/utils/request'
// 引入数据类型
import {
    HasSpuResponseData, AllTradeMark, SpuHasImg, AllAttr,
    SaleAttrResponseData, SpuData, SkuData,SkuInfoData
} from './type'

enum API {
    // 获取已有的SPU的数据
    HasSpu_URL = "/admin/product/",
    //获取全部品牌的数据
    AllTradeMark_URL = '/admin/product/baseTrademark/getTrademarkList',
    //获取某个SPU下的全部的售卖商品的图片数据
    Image_URL = "/admin/product/spuImageList/",
    //获取某一个SPU下全部的已有的销售属性接口地址
    SpuHasSaleAttr_URL = '/admin/product/spuSaleAttrList/',
    //获取整个项目全部的销售属性[颜色、版本、尺码]
    AllSaleAttr_URL = "/admin/product/baseSaleAttrList",
    //追加一个新的SPU
    AddSpu_URL = '/admin/product/saveSpuInfo',
    //更新已有的SPU
    UpdateSpu_URL = '/admin/product/updateSpuInfo',
    //删除已有的SPU
    RemoveSpu_URL = '/admin/product/deleteSpu/',
    //追加一个新增的SKU地址
    AddSku_URL = '/admin/product/saveSkuInfo',
    //查看某一个已有的SPU下全部售卖的商品
    SkuInfo_URL = '/admin/product/findBySpuId/',

}


// //获取某一个三级分类下已有的SPU数据
export const reqHasSpu = (
    page: number,
    limit: number,
    category3Id: number | string
) => request.get<any, HasSpuResponseData>(API.HasSpu_URL + `${page}/${limit}?category3Id=${category3Id}`)
//获取全部的SPU的品牌的数据
export const reqAllTradeMark = () => request.get<any, AllTradeMark>(API.AllTradeMark_URL)
//获取某一个已有的SPU下全部商品的图片地址
export const reqSpuImageList = (spiId: number) => request.get<any, SpuHasImg>(API.Image_URL + `${spiId}`)
//获取所有销售属性
export const reqAllSaleAttr = () => request.get<any, AllAttr>(API.AllSaleAttr_URL)
//获取某一个已有的SPU拥有多少个销售属性
export const reqSpuHasSaleAttr = (spuId: number) =>
    request.get<any, SaleAttrResponseData>(API.SpuHasSaleAttr_URL + spuId)

//添加一个新的SPU的
//更新已有的SPU接口
//data:即为新增的SPU|或者已有的SPU对象
export const reqAddOrUpdateSpu = (data: SpuData) => {
    //如果SPU对象拥有ID,更新已有的SPU
    if (data.id) {
        return request.post<any, any>(API.UpdateSpu_URL, data)
    } else {
        return request.post<any, any>(API.AddSpu_URL, data)
    }
}
// 删除某一个spu
export const reqRemoveSpu = (spuId: number) => request.delete<any, any>(API.RemoveSpu_URL + spuId)

// 添加sku信息
export const reqAddSku = (data: SkuData) => request.post<any, any>(API.AddSku_URL, data)

// 获取spu对应的sku信息
export const reqSkuInfo = (spuId:number)=>request.get<any,SkuInfoData>(API.SkuInfo_URL+spuId)
