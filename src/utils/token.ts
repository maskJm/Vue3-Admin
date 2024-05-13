// 封装本地存储存储数据与读取数据方法
// 存储数据
export const SET_TOKEN = (token:string)=>{
    // console.log("t:",token)
    localStorage.setItem('TOKEN',token)
}
// 读取数据
export const GET_TOKEN = ()=>{
    return localStorage.getItem('TOKEN')
}
// 本地删除存储数据的方法
export const REMOVE_TOKEN = ()=>{
    localStorage.removeItem('TOKEN')
}