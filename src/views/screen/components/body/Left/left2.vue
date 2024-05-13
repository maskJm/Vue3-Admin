<template>
  <div class='box1'>
    <div class="left">
        <div class="title">男女比例</div>
        <div class="bg"></div>
    </div>
    <div class="human">
      <div class="man">
        <p>男士</p>
        <img src="../../../images/man.png" >
      </div>
      <div class="woman">
        <p>女士</p>
        <img src="../../../images/woman.png" >
      </div>
    </div>
    <div class="rate">
      <p>男士58%</p>
      <p>女士42%</p>
    </div>
    <div class="charts" ref='charts'></div>
  </div>
</template>

<script setup lang='ts'>
import * as echarts from 'echarts'
import {ref,onMounted} from 'vue'
let charts = ref()
onMounted(() => {
  let mychart = echarts.init(charts.value)
  mychart.setOption({
     //x|y
    xAxis: {
      show:false,
      min: 0,
      max: 100},
    yAxis: {
      show:false,
      type: 'category'
    },
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    },
    series:[{
      type:'bar',
      data:[58],
      zlevel:10,
      barWidth: 20,
      itemStyle: {
        color: 'skyblue',
        borderRadius: 20
      }
    },
    {
      type:'bar',
      data:[100],
      barWidth: 20,
      itemStyle: {
        color: 'hotpink',
        borderRadius: 20
      },
      //调整女士柱条位置
      barGap: '-100%',
    }
  ]
  })
})

</script>

<style scoped>
.box1{
  background: url(../../../images/dataScreen-main-lb.png) no-repeat;
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
  .human{
    display: flex;
    justify-content: center;
    .man{
      margin: 30px 20px;
      width: 120px;
      height: 120px;
      background: url(../../../images/man-bg.png) no-repeat;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      padding-bottom: 20px;
      align-items: center;
    }
    .woman{
      margin: 30px 20px;
      width: 110px;
      height: 120px;
      background: url(../../../images/woman-bg.png) no-repeat;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      padding-bottom: 20px;
      align-items: center;
    }
  }
  .rate{
    display: flex;
    justify-content: space-around;
  }
  .charts {
    height: calc(100% - 200px);
  }
}
</style>
