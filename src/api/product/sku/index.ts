import request from "@/utils/request"
import {SkuResponseData,SkuInfoData} from './type'

enum API {
    //获取已有的商品的数据-SKU
    Sku_URL = '/admin/product/list/',
    // 获取sku详情接口
    getSku_URL = "/admin/product/getSkuInfo/",
    //上架
    Sale_URL = '/admin/product/onSale/',
    //下架的接口
    CancelSale_URL = '/admin/product/cancelSale/',
    //删除已有的商品
    DeleteSku_URL = '/admin/product/deleteSku/',
}

// 获取已有商品详情的接口
export const reqSkuList = (page:number,limit:number)=>request.get<any,SkuResponseData>(API.Sku_URL+`${page}/${limit}`)
// 获取某一个spu下sku的接口
export const reqgetSku = (skuId: number) => request.get<any, SkuInfoData>(API.getSku_URL + skuId)
// 上架接口
export const reqSale = (spuId:number)=>request.get<any,any>(API.Sale_URL+spuId)
// 下架接口
export const reqCancelSale = (spuId:number)=>request.get<any,any>(API.CancelSale_URL+spuId)
//删除某一个已有的商品
export const reqRemoveSku = (skuId: number) =>
  request.delete<any, any>(API.DeleteSku_URL + skuId)
