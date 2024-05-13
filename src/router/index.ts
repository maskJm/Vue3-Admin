//通过vue-router插件实现模板路由配置
import { createRouter,createWebHashHistory } from 'vue-router'
import {constantRoute}  from './router.ts'
//创建路由器
let router = createRouter({
    history : createWebHashHistory(),
    routes: constantRoute,
    // 滚动行为
    scrollBehavior(){
        return {
            left:0,
            top:0
        }
    }
 })

export default router;