import request from '@/utils/request'
import type { UserResponseData, User, AllRoleResponseData, SetRoleData } from './type'

// API地址
enum API {
    // 获取用户信息
    GetInfo = "/admin/acl/user/",
    // 保存用户
    AddUser = "/admin/acl/user/save",
    // 更新用户
    UpdateUser = "/admin/acl/user/update",
    // 删除用户
    DeleteUser = "/admin/acl/user/remove/",
    // 根据用户获取角色数据
    GetAllRole = "/admin/acl/user/toAssign/",
    //给已有的用户分配角色接口
    SetRole_URL = '/admin/acl/user/doAssignRole',
    //批量删除的接口
    SelectUser_URL = '/admin/acl/user/batchRemove',
}

//获取用户信息的接口
export const reqGetInfo = (page: number, limit: number,name:string) => request.get<any, UserResponseData>(API.GetInfo + `${page}/${limit}?username=${name}`)
// 保存/更新用户接口
export const reqAddOrUpdate = (data: User) => {
    if (data.id) {
        return request.put<any, any>(API.UpdateUser, data)
    } else {
        return request.post<any, any>(API.AddUser, data)
    }
}
//删除用户的接口
export const reqDeleteUser = (id: number) => request.delete<any, any>(API.DeleteUser + id)
// 根据用户获取角色数据接口
export const reqGetAllRole = (adminId: number) => request.get<any, AllRoleResponseData>(API.GetAllRole + adminId)
// 保存用户角色的接口
export const reqSetRole = (data: SetRoleData) => request.post<any, any>(API.SetRole_URL, data)
// 批量删除用户的接口
export const reqSelectUser = (idList:number[])=>request.delete<any,any>(API.SelectUser_URL,{ data:idList })
