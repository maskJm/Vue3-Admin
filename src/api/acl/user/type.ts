export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

// 用户类型
export interface User {
    id?: number | string,
    createTime?: string,
    updateTime?: string,
    username: string,
    password: string,
    name: string,
    phone?: null,
    roleName?: string
}
//数组包含全部的用户信息
export type Records = User[]
//获取全部用户信息接口返回的数据ts类型
export interface UserResponseData extends ResponseData {
    data: {
        records: Records
        total: number
        size: number
        current: number
        pages: number
    }
}

//用户角色
export interface UserRole {
    id?: number,
    createTime?: string,
    updateTime?: string,
    roleName: string,
    // remark?: null
}
export type AllRole = UserRole[]
// 根据用户返回的所有职务数据类型
export interface AllRoleResponseData extends ResponseData{
    data:{
        assignRoles: AllRole
        allRolesList: AllRole
      }
}
//给用户分配职位接口携带参数的ts类型
export interface SetRoleData {
    roleIdList: number[]
    userId: number
  }
  

