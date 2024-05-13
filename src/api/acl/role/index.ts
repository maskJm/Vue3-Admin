import request from '@/utils/request'
import { ResponseAllRole, RoleData,MenuResponseData } from './type'

enum API {
    // 获取职位数据
    getRole_URL = "/admin/acl/role/",
    // 添加职位
    addRole_URL = "/admin/acl/role/save",
    // 更新职位
    updateRole_URL = "/admin/acl/role/update",
    //获取全部的菜单与按钮的数据
    AllPermission = '/admin/acl/permission/toAssign/',
    //给相应的职位分配权限
    SetPermission_URL = '/admin/acl/permission/doAssign/?',
    //删除已有的职位
    RemoveRole_URL = '/admin/acl/role/remove/',

}

// 获取职位的接口
export const reqgetRole = (page: number, limit: number, roleName: string) => request.get<any, ResponseAllRole>(API.getRole_URL + `${page}/${limit}?roleName=${roleName}`)
// 添加|修改职务的接口
export const reqAddOrUpdate = (RoleParams: RoleData) => {
    if (RoleParams.id) {
        return request.put<any, any>(API.updateRole_URL, RoleParams)
    } else {
        return request.post<any, any>(API.addRole_URL, RoleParams)
    }
}
// 获取所有菜单数据的接口
export const reqAllMenuList = (roleId:number)=>request.get<any,MenuResponseData>(API.AllPermission + roleId)
//给相应的职位下发权限
export const reqSetPermisstion = (roleId: number, permissionId: number[]) =>
  request.post(
    API.SetPermission_URL + `roleId=${roleId}&permissionId=${permissionId}`,
)
//删除已有的职位
export const reqRemoveRole = (roleId: number) =>
request.delete<any, any>(API.RemoveRole_URL + roleId)