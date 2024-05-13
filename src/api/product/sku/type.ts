//sku相关类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
export interface Attr {
  attrId: number | string, //平台属性的ID
  valueId: number | string, //属性值的ID
}

export interface saleArr {
  saleAttrId: number | string //属性ID
  saleAttrValueId: number | string //属性值的ID
}

export interface skuImage {
  id?:number,
  "imgName": string,
  "imgUrl": string,
  "isDefault"?: string,
  "skuId"?: number,
  "spuImgId"?: number,
}
export interface SkuData {
  "category3Id": number | string,
  "spuId": number,//已有的SPU的ID
  "tmId": number, //SPU品牌的ID
  "id": number,
  "isSale": number,
  "price": number,
  "skuDefaultImg": string,//sku图片地址
  "skuDesc": string,
  "skuName": string,
  "weight": string,
  "skuAttrValueList": Attr[],
  "skuImageList": skuImage[],
  "skuSaleAttrValueList": saleArr[],
}

//获取SKU接口返回的数据ts类型
export interface SkuResponseData extends ResponseData {
  data: {
    records: SkuData[]
    total: number
    size: number
    current: number
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
    pages: number
  }
}

//获取SKU数据接口的ts类型
export interface SkuInfoData extends ResponseData {
  data: SkuData[]
}
