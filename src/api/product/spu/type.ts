// spu 类型
export interface Response{
    code:number,
    message:string,
    ok:boolean
}

// spu数据的ts类型
export interface SpuData{
    id?:number,
    category3Id:number | string,
    tmId: number | string
    spuName:string,
    description:string,
    spuSaleAttrList:null | SaleAttr[],
    spuImageList:null | SpuImage[]
}
export type Records = SpuData[] 
//定义获取已有的SPU接口返回的数据ts类型
export interface HasSpuResponseData extends Response{
    data:{
        records:Records,
        total:number,
        size:number,
        current:number,
        search:boolean,
        pages:number
    }
}
// 品牌的数据类型
export interface TradeMark{
    id:number,
    tmName:string,
    logoUrl:"string"
}
//品牌接口返回的数据ts类型
export interface AllTradeMark extends Response {
    data: TradeMark[]
}
//商品图片的ts类型
export interface SpuImage{
    id?:number,
    spuId?:number,
    imgName?:string,
    imgUrl?:string
    name?: string
    url?: string  
}
export interface failImg{
    name:string,
    url:string
}
//已有的SPU的照片墙数据的类型
export interface SpuHasImg extends Response{
    data:SpuImage[]
}

// 单个属性值类型
export interface AttrValue{
    id:number,
    name:string
}
// 所有属性值
export interface AllAttr extends Response{
    data:AttrValue[]
}

//已有的销售属性值对象ts类型
export interface SaleAttrValue {
    id?: number
    spuId?: number
    baseSaleAttrId: number | string
    saleAttrValueName: string
    saleAttrName?: string
    isChecked?: null
  }
//存储已有的销售属性值数组类型
export type SpuSaleAttrValueList = SaleAttrValue[]

//销售属性对象ts类型
export interface SaleAttr {
    id?: number
    createTime?: null
    updateTime?: null
    spuId?: number
    baseSaleAttrId: number | string
    saleAttrName: string
    spuSaleAttrValueList: SpuSaleAttrValueList
    flag?: boolean
    saleAttrValue?: string
  }
//SPU已有的销售属性接口返回数据ts类型
export interface SaleAttrResponseData extends Response {
    data: SaleAttr[]
  }


//sku相关类型

export interface Attr{
    attrId: number | string, //平台属性的ID
    valueId: number | string, //属性值的ID
}

export interface saleArr {
    saleAttrId: number | string //属性ID
    saleAttrValueId: number | string //属性值的ID
}

export interface skuImage{
    "imgName": string,
    "imgUrl": string,
    "isDefault"?: string,
    "skuId"?: number,
    "spuImgId"?: number,
}
  export interface SkuData
  {
    "category3Id": number|string,
    "spuId": number|string,//已有的SPU的ID
    "tmId": number|string, //SPU品牌的ID
    "id"?: number,
    "isSale"?: number,
    "price": number|string,
    "skuDefaultImg": string,//sku图片地址
    "skuDesc": string,
    "skuName": string,
    "weight": string,
    "skuAttrValueList"?: Attr[],
    "skuImageList"?: skuImage[],
    "skuSaleAttrValueList"?: saleArr[],
  }
  //获取SKU数据接口的ts类型
export interface SkuInfoData extends Response {
    data: SkuData[]
  }

