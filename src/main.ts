import { createApp } from "vue";
import App from "@/App.vue";
// 引入element-plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
// 配置默认中文
//@ts-expect-error忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
// 导入svg插件配置
import "virtual:svg-icons-register";
// 注册自定义插件-全局组件
import gloablComponent from "./components/index";
// 引入全局样式
import "@/styles/index.scss";
//暗黑模式需要的样式
import 'element-plus/theme-chalk/dark/css-vars.css'
// 引入路由
import router from "./router"
// 引入仓库
import pinia from "./store"
// 引入路由鉴权
import "./permission"
// 引入注册全局指令函数
import { isHasButton } from '@/directive/btnHas'

const app = createApp(App);
// 注册模版路由
app.use(router);
// 安装仓库
app.use(pinia);
// 安装自定义插件
app.use(gloablComponent);
// 安装element-plus插件
app.use(ElementPlus, {
  locale: zhCn,  //国际化
});
// 注册全局指令
isHasButton(app)
// 将应用挂载到挂载点上
app.mount("#app");
