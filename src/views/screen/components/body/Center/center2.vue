<template>
  <div class="line">
    <div class="left">
      <div class="title">未来七天趋势</div>
      <div class="bg"></div>
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang='ts'>
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'

let charts = ref();
onMounted(() => {
  let mycharts = echarts.init(charts.value)
  mycharts.setOption({
    title: {
      text: '访问量',
      textStyle: {
        color: 'skyblue',
        fontSize: 20
      }
    },
    xAxis: {
      show: true,
      //两侧不留白
      boundaryGap: false,
      //分割线不要
      splitLine: {
        show: false
      },
      data: ['一', '二', '三', '四', '五', '六', '日'],
      //轴线的设置
      axisLine: {
        show: true
      },
      //刻度
      axisTick: {
        show: true
      }
    },
    yAxis: {
      show: true,
      //分割线不要
      splitLine: {
        show: false
      },
      //轴线的设置
      axisLine: {
        show: true
      },
      //刻度
      axisTick: {
        show: true
      }
    },
    grid: {
      left: 40,
      top: 0,
      right: 10,
      bottom: 30
    },
    series: [{
      type: 'line',
      name:'访问量',
      data: [120, 1240, 66, 2299, 321, 890, 1200],
      //平滑曲线的设置
      smooth: true,
      //区域填充样式
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'red' // 0% 处的颜色
          }, {
            offset: 1, color: 'blue' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        }
      },
    }],
    tooltip:{
      show:true,
      trigger:"item",
      formatter:'{a}:{c}',
      textStyle:{
        fontSize:22,
        color:"black"
      }
    }
  })
})

</script>

<style scoped>
.line {
  background: url(../../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 8px;

  .left {
    font-size: 20px;
    margin-left: 20px;

    .bg {
      width: 68px;
      height: 7px;
      margin-top: 10px;
      background: url(../../../images/dataScreen-title.png) no-repeat;
      background-size: 100% 100%;
    }
  }

  .charts {
    height: 200px
  }
}
</style>
