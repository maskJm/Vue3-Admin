<template>
  <div class="rank">
    <div class="left">
      <div class="title">各省份对比</div>
      <div class="bg"></div>
      <div class='titlep'>人均消费情况</div>
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang='ts'>
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
let charts = ref();
onMounted(() => {
  let mycharts = echarts.init(charts.value);
  mycharts.setOption({
    xAxis: {
      type: 'category',
      data: ['陕西', '山西', '四川', '浙江', '上海', '山东']
    },
    yAxis: {
      show: true,
      //轴线的设置
      axisLine: {
        show: true
      },
      //刻度
      axisTick: {
        show: true
      },
      //分割线不要
      splitLine: {
        show: false
      },
    },
    grid: {
      left: 30,
      right: 20,
      bottom: 20
    },
    series: [{
      type: 'line',
      data: [20, 30, 50, 40, 30, 80],
      smooth: true,
    },
    {
      type: 'bar',
      data: [20, 30, 50, 40, 30, 60],
      label: {
        show: true,
        position: 'insideTop',
        color: 'white'
      },
      showBackground: true,
      backgroundStyle: {
        //底部背景的颜色
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#11144E' // 0% 处的颜色
          }, {
            offset: 1, color: 'blue' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        }
      },
      //柱条的样式
      itemStyle: {
        borderRadius: [10, 10, 0, 0],
        //柱条颜色
        color: function (data: any) {
          //给每一个柱条这是背景颜色
          let arr = ['red', 'orange', 'yellowgreen', 'purple', 'hotpink', 'skyblue']
          return arr[data.dataIndex];
        }
      }


    },
    {
      type: 'bar',
      data: [20, 30, 50, 40, 30, 60],
      label: {
        show: true,
        position: 'insideTop',
        color: 'white'
      },
      showBackground: true,
      backgroundStyle: {
        //底部背景的颜色
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#11144E' // 0% 处的颜色
          }, {
            offset: 1, color: 'blue' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        }
      },
      //柱条的样式
      itemStyle: {
        borderRadius: [10, 10, 0, 0],
        //柱条颜色
        color: function (data: any) {
          //给每一个柱条这是背景颜色
          let arr = ['red', 'orange', 'yellowgreen', 'purple', 'hotpink', 'skyblue']
          return arr[data.dataIndex];
        }
      }
    }],
    tooltip:{
      backgroundColor:'rgba(50,50,50,0.7)'
    }
  })
})

</script>

<style scoped>
.rank {
  background: url(../../../images/dataScreen-main-rb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 8px;

  .left {
    font-size: 20px;
    margin-top: 10px;
    margin-left: 20px;

    .bg {
      width: 68px;
      height: 7px;
      margin-top: 10px;
      background: url(../../../images/dataScreen-title.png) no-repeat;
      background-size: 100% 100%;
    }

    .titlep {
      float: right;
      padding-right: 140px;
      font-size: 22px;
      color: aquamarine;
    }
  }

  .charts {
    height: calc(100% - 40px);
  }
}
</style>
