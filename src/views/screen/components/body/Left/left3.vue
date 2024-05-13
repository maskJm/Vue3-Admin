<template>
  <div class="bar">
    <div class="left">
        <div class="title">家庭消费比例</div>
        <div class="bg"></div>
    </div>
    <div class='charts' ref="charts"></div>
  </div>
</template>

import { SetOptionOpts } from 'echarts';

<script setup lang='ts'>
import * as echarts from 'echarts'
import {ref,onMounted} from 'vue'
let charts = ref();
onMounted(() => {
  let mycharts = echarts.init(charts.value)
  mycharts.setOption({
    tooltip: {
      show:true,
      trigger: 'item'
    },
    legend: {
        right: 30,
        top: 40,
        orient: 'vertical',//图例组件方向的设置
        textStyle: {
            color: 'white',
            fontSize: 16
        }
    },
    series: [
      {
        name: '消费指数',
        type: 'pie',
        radius: ['30%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
            borderRadius: 6,
            borderColor: '#fff',
            borderWidth: 2
        },
        label: {
            show: true,
            position: 'inside',
            color:'white',
            fontSize:16
        },
        data: [
            { value: 1048, name: '衣服' },
            { value: 735, name: '教育' },
            { value: 580, name: '娱乐' },
            { value: 484, name: '家具' },
            { value: 300, name: '食物' }
        ]
      }
    ],

  })
})

</script>

<style scoped>
.bar{
  background: url(../../../images/dataScreen-main-lb.png) no-repeat;
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
  .charts{
    height: calc(100% - 10px);
  }
}

</style>
