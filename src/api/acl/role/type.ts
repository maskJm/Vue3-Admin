export interface ResponseData{
    code:number,
    message:string,
    ok:boolean, 
}
// 职位的类型
export interface RoleData{
    "id"?: number,
    "createTime"?: string,
    "updateTime"?: string,
    "roleName": string,
    "remark"?: null
}
export type Records = RoleData[]
// 返回所有信息的类型
export interface ResponseAllRole extends ResponseData{
    data:{
        records:Records,
        "total": number,
        "size": number,
        "current": number,
        "orders": [],
        "optimizeCountSql": boolean,
        "hitCount": boolean,
        "countId": null,
        "maxLimit": null,
        "searchCount": boolean,
        "pages": number
    }
}

// 菜单数据的类型
export interface MunuData {
    id: number
    createTime: string
    updateTime: string
    pid: number
    name: string
    code: string
    toCode: string
    type: number
    status: null
    level: number
    children?: MenuList
    select: boolean
  }
  export type MenuList = MunuData[]
  //菜单权限与按钮权限数据的ts类型
export interface MenuResponseData extends ResponseData {
    data: MenuList
  }
