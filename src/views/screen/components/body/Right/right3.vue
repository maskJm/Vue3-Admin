<template>
  <div class="sixAxis">
    <div class="left">
      <div class="title">属性对比</div>
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
      text: '雷达图',
      left: '60%',
      textStyle: {
        color: 'aquamarine',
        fontSize: 22
      }
    },
    radar: {
      // shape: 'circle',
      indicator: [
        { name: '衣服', max: 10000 },
        { name: '食物', max: 16000 },
        { name: '出行', max: 30000 },
        { name: '房租', max: 38000 },
        { name: '爱好', max: 52000 },
        { name: '娱乐', max: 25000 }
      ],
      axisName: {
        fontSize: 16
      }
    },
    series: [{
      type: 'radar',
      name: '消费量',
      data: [
        {
          value: [4200, 3000, 20000, 35000, 50000, 18000],
          name: '购物'
        },
        {
          value: [5000, 14000, 28000, 26000, 42000, 21000],
          name: '吃饭'
        }],
      symbol: 'circle',
      symbolSize: 12,
      //图文标签
      label: {
        show: true,
        position: 'top',
        color: 'white'
      },

    },],
    tooltip: {
      show: true,
      textStyle: {
        fontSize: 22,
        color: "black"
      }
    }
  })
})

</script>

<style scoped>
.sixAxis {
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
    height: calc(100% - 50px);
  }
}
</style>
