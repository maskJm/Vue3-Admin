<template>
  <div class="category">
    <div class="left">
      <div class="title">年度访问量对比</div>
      <div class="bg"></div>
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang='ts'>
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
let charts = ref()
onMounted(() => {
  let mycharts = echarts.init(charts.value)
  mycharts.setOption({
    title: {
      text: '散点图',
      left: '50%',
      textStyle:{
        color:'aquamarine',
        fontSize:22
      }
    },
    xAxis: {
      show: true,
      type: 'category'
    },
    yAxis: {
      show: false,
    },
    grid: {
      left: 20,
      right: 20,
      bottom: 20
    },
    series: [{
      type: 'scatter',
      name: '访问量',
      data: [10, 36, 45, 78, 95, 41, 20, 56, 41, 62],
      symbol:'diamond',
      symbolSize:18,
      itemStyle:{
        color:{
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'skyblue' // 0% 处的颜色
          }, {
            offset: 1, color: 'red' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        }
      },
      //图文标签
      label: {
        show: true,
        position: 'top',
        color: 'red'
      },

    },],
    tooltip: {
      show: true,
      textStyle:{
        fontSize:22,
        color:"black"
      }
    }
  })
})

</script>

<style scoped>
.category {
  background: url(../../../images/dataScreen-main-rb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 8px;

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

  .charts {
    height: 100%;
  }
}
</style>
