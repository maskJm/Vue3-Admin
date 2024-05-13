<template>
  <div class="map" ref="map">
    地图
  </div>
</template>

<script setup lang='ts'>
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
//引入中国地图的JSON数据
import chinaJSON from './china.json'

let map = ref()
//注册中国地图
echarts.registerMap('china', chinaJSON as any)
onMounted(() => {
  let mycharts = echarts.init(map.value)
  mycharts.setOption({
    geo: {
      show: true,
      map: 'china',
      roam: true,//鼠标缩放的效果
      //地图的位置调试
      left: 120,
      top: 150,
      right: 120,
      zoom: 1.2,
      bottom: 0,
      //地图上的文字的设置
      label: {
        show: true,//文字显示出来
        color: 'white',
        fontSize: 14
      },
      itemStyle: {
        //每一个多边形的样式,设置线性渐变
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'skyblue' // 0% 处的颜色
          }, {
            offset: 1, color: '#022553' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        },
        opacity: .6
      },
      emphasis: {
        itemStyle: {
          color: '#F1948A'
        },
        label: {
          fontSize: 36,
          color: 'white'
        }
      }
    },
    series: [{
      type: 'lines',
      data: [
        {
          coords: [
            [108.948024, 34.263161], // 起点
            [120.153576, 30.287459],  // 终点
          ],
          // 统一的样式设置
          lineStyle: {
            width: 3,
            type: 'dashed',
            color: 'white'
          }
        },
        {
          coords: [
            [108.948024, 34.263161], // 起点
            [87.617733, 43.792818]   // 终点
          ],
          // 统一的样式设置
          lineStyle: {
            width: 3,
            type: 'dashed',
            color: 'white'
          }
        },
        {
          coords: [
            [108.948024, 34.263161], // 起点
            [123.429096, 41.796767],  // 终点
          ],
          // 统一的样式设置
          lineStyle: {
            width: 3,
            type: 'dashed',
            color: 'white'
          }
        },
        {
          coords: [
            [108.948024, 34.263161], // 起点
            [121.472644, 31.231706],  // 终点
          ],
          // 统一的样式设置
          lineStyle: {
            width: 3,
            type: 'dashed',
            color: 'white'
          }
        },
        {
          coords: [
            [108.948024, 34.263161], // 起点
            [104.065735, 30.659462]  // 终点
          ],
          // 统一的样式设置
          lineStyle: {
            width: 3,
            type: 'dashed',
            color: 'white',
          }
        },
        {
          coords: [
            [108.948024, 34.263161], // 起点
            [106.713478, 26.578343],  // 终点
          ],
          // 统一的样式设置
          lineStyle: {
            width: 3,
            type: 'dashed',
            color: 'white',
          }
        }],
      //开启动画特效
      effect: {
        show: true,
        symbol: 'triangle',
        color: '#F7F9F9',
        symbolSize: 18,
    }
    }]
  })
})

</script>

<style scoped></style>
