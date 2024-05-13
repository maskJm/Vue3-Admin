<template>
  <div class="top">
        <div class="left">
            <span class="lbtn" @click="goHome">首页</span>
        </div>
        <div class="center">智慧可视化大数据平台</div>
        <div class="right">
            <div class="rbtn">统计报告</div>
            <div class="time">当前时间:&nbsp;&nbsp;{{ time }}</div>
        </div>
  </div>
</template>

<script setup lang='ts'>
import moment from 'moment'
//点击首页按钮回到首页
import { useRouter } from 'vue-router';
import {ref,onMounted,onBeforeUnmount} from 'vue'

//获取路由器对象
const $router = useRouter();
const goHome = ()=>{
    $router.push('./home')

}
// 时间相关
let time = ref(moment().format('YYYY年MM月DD日  hh:mm:ss'))
// 定时器
let timer = ref();
onMounted(() => {
    timer.value = setInterval(()=>{
        time.value = moment().format('YYYY年MM月DD日  hh:mm:ss')
    },1000)
}),
onBeforeUnmount(() => {
    clearInterval(timer.value);
})
</script>

<style scoped lang="scss">
.top{
    display: flex;
    .left{
        flex: 1;
        background: url(../../images/dataScreen-header-left-bg.png) no-repeat;
        background-size: cover;
        float: right;
        color: #29fcff;
        font-size: 20px;
        .lbtn{
            width: 150px;
            height: 40px;
            float: right;
            background: url(../../images/dataScreen-header-btn-bg-l.png) no-repeat;
            background-size:100% 100%;
            text-align: center;
            line-height: 40px;
        }
    }
    .center{
        flex:1.5;
        height: 74px;
        background: url(../../images/dataScreen-header-center-bg.png) no-repeat;
        background-size: cover;
        color: #29fcff;
        font-size: 30px;
        text-align: center;
        line-height: 74px;
    }
    .right{
        flex: 1;
        background: url(../../images/dataScreen-header-right-bg.png) no-repeat;
        background-size: cover;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 20px;
        color: #29fcff;

        .rbtn{
            width: 150px;
            height: 40px;
            background: url(../../images/dataScreen-header-btn-bg-r.png) no-repeat;
            background-size: 100% 100%;
            line-height: 40px;
            text-align: center;
        }
        .time{
            padding-right: 10px;
        }
    }
}

</style>
