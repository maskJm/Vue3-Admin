import axios from "axios";
import { ElMessage } from "element-plus";
//引入用户相关的仓库
import useUserStore from '@/store/modules/user'
//创建axios实例
let request = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 6000
})
//请求拦截器
request.interceptors.request.use(config => {
    //获取用户相关的小仓库:获取仓库内部token,登录成功以后携带给服务器
    const userStore = useUserStore()
    // console.log("777:",userStore)
    if (userStore.token) {
        config.headers.token = userStore.token
        // console.log("999",userStore.token)
    }
    //config配置对象,headers属性请求头,经常给服务器端携带公共参数
    //返回配置对象
    return config;
});
//响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data;
}, 
  (error) => {
    //处理网络错误
    let msg = '';
    console.log(error)
    let status = error.response.status;
    switch (status) {
        case 401:
            msg = "token过期";
            break;
        case 403:
            msg = '无权访问';
            break;
        case 404:
            msg = "请求地址错误";
            break;
        case 500:
            msg = "服务器出现问题";
            break;
        default:
            msg = "网络出现问题";
            break;
    }
    ElMessage({
        type: 'error',
        message: msg,
    })
    return Promise.reject(error);
});
export default request;