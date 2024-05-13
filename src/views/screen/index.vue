<template>
  <div class="container">
    <div class="screen" ref="screen">
      <div class="top">
        <Top />
      </div>
      <div class="body">
        <div class="left">
          <Left1 class="left1"></Left1>
          <Left2 class="left2"></Left2>
          <Left3 class="left3"></Left3>
        </div>
        <div class="center">
          <Center1 class="center1"></Center1>
          <Center2 class="center2"></Center2>
        </div>
        <div class="right">
          <Right1 class="right1"></Right1>
          <Right2 class="right2"></Right2>
          <Right3 class="right3"></Right3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue'
// 导入各个子组件
import Top from './components/top/index.vue'
import Left1 from './components/body/Left/left1.vue'
import Left2 from './components/body/Left/left2.vue'
import Left3 from './components/body/Left/left3.vue'
import Center1 from './components/body/Center/center1.vue'
import Center2 from './components/body/Center/center2.vue'
import Right1 from './components/body/Right/right1.vue'
import Right2 from './components/body/Right/right2.vue'
import Right3 from './components/body/Right/right3.vue'





//获取数据大屏展示内容盒子的DOM元素
let screen = ref();
//定义大屏缩放比例
function getScale(w = 1920, h = 1080) {
  const ww = window.innerWidth / w;
  const wh = window.innerHeight / h;
  return ww < wh ? ww : wh;
}
onMounted(() => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
}),
  //监听视口变化
  window.onresize = () => {
    screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
  }

</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  background: url(./images/bg.png) no-repeat;
  background-size: cover;

  .screen {
    width: 1920px;
    height: 1080px;
    position: fixed;
    left: 50%;
    top: 50%;
    transform-origin: left top;

    .top {
      width: 100%;
      height: 40px;
    }

    .body {
      width: 100%;
      height: 1040px;
      padding-top: 10px;
      display: flex;
      font-size: 20px;
      color: white;;

      .left {
        flex: 1;
        display: flex;
        flex-direction: column;
        .left1{
          flex:1.2;
        }
        .left2{
          flex: 1;
        }
        .left3{
          flex: 1;
        }
      }

      .center {
        flex: 2;
        display: flex;
        flex-direction: column;
        .center1{
          flex: 4;
        }
        .center2{
          flex: 1;
          margin: 0 20px;
        }
      }

      .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        .right1{
          flex:1.2;
        }
        .right2{
          flex:1;
        }
        .right3{
          flex:1.2;
        }
      }

    }
  }
}
</style>
