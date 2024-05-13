export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

// 菜单数据
export interface MenuData {
    "id": number,
    "createTime": string,
    "updateTime": string,
    "pid": number,
    "name": string,
    "code": string,
    "toCode": string,
    "type": number,
    "status": null,
    "level": number,
    "children": MenuDataList,
    "select": boolean
}
export type MenuDataList = MenuData[]
// 返回的全部数据类型
export interface ResponseAllMenuData extends ResponseData {
    data: MenuDataList
}

// 新增|更新菜单的数据类型
export interface MenuParams {
    id?: number //ID
    code: string //权限数值
    level: number //几级菜单
    name: string //菜单的名字
    pid: number //菜单的ID
}