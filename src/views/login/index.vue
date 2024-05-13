<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <!-- 登录表单 -->
        <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginForms">
          <h1>Hello</h1>
          <h2>欢迎来到硅谷甄选</h2>
          <el-form-item prop="username">
            <el-input :prefix-icon='User' placeholder="用户名" v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input :prefix-icon='Lock' placeholder="密码" type="password" show-password
              v-model="loginForm.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" class='login_btn' type="success" size="default" @click='login'>登录</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang='ts'>
import { User, Lock } from '@element-plus/icons-vue';
import { reactive, ref } from 'vue';
import { ElNotification } from 'element-plus';
import { useRouter,useRoute } from 'vue-router';
import {getTime} from '@/utils/time'
// import useStore from 'element-plus/es/components/table/src/store/index.mjs';
// 引入获取当前时间
let message = getTime()
//引入用户相关的小仓库
import useUserStore from "@/store/modules/user";
let useStore = useUserStore();
// 获取 el-form组件
let loginForms = ref();
//获取路由器
let $router = useRouter();
//路由对象
let $route = useRoute();
// 定义变量控制加载按钮效果
let loading = ref(false);
// 手机账号密码信息
let loginForm = reactive({
  username: "admin",
  password: '111111'
})
// 登录按钮的回调函数
const login = async () => {
  // 保证全部表单校验成功再发请求，validate表单事件的函数element-plus
  await loginForms.value.validate();
  // 加载效果:开启
  loading.value = true;
  //点击登录按钮以后干什么?
  //通知仓库发登录请求
  //请求成功->首页展示数据的地方
  // 请求失败->弹出登录失败信息
  try {
    //保证登陆成功
    await useStore.userLogin(loginForm);
    // 编程式导航跳转到展示数据首页
    // 判断登录的时候，路由路径当中是否有query参数，如果有就往query参数跳转，没有跳转首页
    let redirect:any = $route.query.redirect;
    $router.push({path:redirect || '/'})
    // $router.push({ path: '/home' });
    // 登陆成功
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `Hi,${message}好`,
      duration:3000,
      offset:30
    });
    // 加载效果消失
    loading.value = false;
  } catch (error) {
    // console.log("132",error);
    //登录失败加载效果消息
    loading.value = false;
    //登录失败的提示信息
    ElNotification({
      type: 'error',
      message: (error as Error).message,
      duration:3000,
      offset:30
    })
  }
}
// 自定义校验规则函数
const validatorUserName = (_rule: any, value: any, callback: any) => {
  //rule:即为校验规则对象
  //value:即为表单元素文本内容
  //函数:如果符合条件callBack放行通过即为
  //如果不符合条件callBack方法,注入错误提示信息
  if (value.length >= 5) {
    callback();
  } else {
    callback(new Error('用户名至少五位！'))
  }
}

const validatorPassword = (_rule: any, value: any, callback: any) => {
  if (value.length >= 6) {
    callback();
  } else {
    callback(new Error('密码长度至少六位'));
  }
}
//定义表单校验需要配置对象
const rules = {
  //规则对象属性:
  //required,代表这个字段务必要校验的
  //min:文本长度至少多少位
  //max:文本长度最多多少位
  //message:错误的提示信息
  //trigger:触发校验表单的时机 change->文本发生变化触发校验,blur:失去焦点的时候触发校验规则
  username: [
    // { required: true, min: 6, max: 10, message: '账号长度至少六位', trigger: 'change' }
    { trigger: 'change', validator: validatorUserName }
  ],
  password: [
    // { required: true, min: 6, max: 15, message: '密码长度至少6位', trigger: 'change' }
    { trigger: 'change', validator: validatorPassword }
  ]
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;

  .login_form {
    position: relative;
    top: 30vh;
    left: 2%;
    width: 80%;
    height: 100%;
    padding: 40px;
    background: url("@/assets/images/login_form.png") no-repeat;
    background-size: cover;

    h1 {
      font-size: 40px;
      color: white;
    }

    h2 {
      font-size: 20px;
      color: white;
      margin: 20px 0;
    }

    .login_btn {
      width: 100%;
    }
  }
}
</style>
