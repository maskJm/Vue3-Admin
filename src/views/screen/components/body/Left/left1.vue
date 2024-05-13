<template>
  <div class="box">
    <div class="top">
      <div class="left">
        <div class="title">实时占比统计</div>
        <div class="bg"></div>
      </div>
      <div class="right">可预约人数: <span>99999</span>人</div>
    </div>
    <div class="number">
      <span v-for="(item, index) in number" :key="index">{{ item }}</span>
    </div>
    <div class="charts" ref="charts"></div>
  </div>

</template>

<script setup lang='ts'>
import * as echarts from 'echarts'
import 'echarts-liquidfill'

import { ref, onMounted } from 'vue'
let number = ref('26578人')
let charts = ref();
//水球图拓展插件
onMounted(() => {
  //获取echarts类的实例
  let mycharts = echarts.init(charts.value);
  mycharts.setOption({
    title: {
      text: '水球图',
      textStyle: {
        color: 'skyblue',
        fontSize: '22'
      },
      left: '20',
      top: '20'
    },
    xAxis: {},
    yAxis: {},
    //布局组件
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    },
    series: [{
      type: 'liquidFill',
      data: [0.6, 0.5, 0.4],
      name: '预测量',
      waveAnimation: true,//动画
      animationDurationUpdate: 0,//数据更新动画的时长。
      animationDuration: 300,//初始动画的时长
      radius: '90%',//半径
      outline: {//外层边框颜色设置
        show: true,
        borderDistance: 8,
        itemStyle: {
          color: 'skyblue',
          borderColor: '#294D99',
          borderWidth: 8,
          shadowBlur: 20,
          shadowColor: 'rgba(0, 0, 0, 0.25)'
        }
      },
      backgroundStyle: {
        color: '#11144E'
      },
      label: {
        show: true,
        position: ['50%', '50%'],
      },

    }],
    tooltip: {
      show: true
    }
  })
})



</script>

<style scoped lang="scss">
.box {
  background: url(../../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 8px;

  .top {
    display: flex;
    justify-content: space-between;

    .left {
      font-size: 20px;
      margin-left: 20px;
      margin-top: 10px;

      .bg {
        width: 68px;
        height: 7px;
        margin-top: 10px;
        background: url(../../../images/dataScreen-title.png) no-repeat;
        background-size: 100% 100%;
      }
    }

    .right {
      padding-top: 30px;
      margin-right: 10px;

      span {
        color: skyblue;
      }
    }
  }

  .number {
    margin-top: 50px;
    font-size: 20px;
    color: skyblue;
    display: flex;

    span {
      flex: 1;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background: url(../../../images/total.png) no-repeat;
      background-size: 100% 100%;
    }
  }

  .charts {
    width: 100%;
    height: calc(100% - 100px);
  }
}
</style>
