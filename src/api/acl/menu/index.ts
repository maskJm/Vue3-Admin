import request from '@/utils/request'
import { ResponseAllMenuData, MenuParams } from './type'

enum API {
    // 获取菜单的全部数据
    AllMenuList = "/admin/acl/permission",
    // 新增菜单
    AddMenu_URL = "/admin/acl/permission/save",
    // 更新菜单
    UpdateMenu_URL = "/admin/acl/permission/update",
    // 删除菜单
    RemoveMenu_URL = "/admin/acl/permission/remove/"
}

// 获取全部菜单的接口
export const reqAllMenuList = () => request.get<any, ResponseAllMenuData>(API.AllMenuList)
// 新增|更新 菜单的接口
export const reqAddOrUpdateMenu = (data: MenuParams) => {
    if (data.id) {
        return request.put<any, any>(API.UpdateMenu_URL, data)
    } else {
        return request.post<any, any>(API.AddMenu_URL, data)
    }
}
// 删除菜单的接口
export const reqRemoveMenu = (id:number)=>request.delete<any,any>(API.RemoveMenu_URL+id)