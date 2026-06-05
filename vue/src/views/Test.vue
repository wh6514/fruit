<template>
  <div>
    <div style="background-color: pink;font-size: 20px;font-weight: bold; color: red;
    text-decoration: underline;font-style: italic;margin-bottom: 20px">
      欢迎大家跟着青哥哥一起学项目，一起提升自己，完成0到1的突破！
    </div>

    <div style="font-size: 30px;margin-bottom: 20px">
      {{ a }} {{ b }}
    </div>

    <div style="margin-bottom: 20px">
      {{ data.a }}
      {{ data.b }}
      {{ data.c }}
      {{ data.d }}
    </div>

    <div style="margin-bottom: 20px">
      <input v-model="data.a"/>
    </div>

    <div style="margin-bottom: 20px">
      <span style="color: red" v-if="data.name === '佩奇'">小猪佩奇</span>
      <span style="color: blue" v-else-if="data.name === '乔治'">小猪乔治</span>
      <span style="color: hotpink" v-else>小猪朵朵</span>
    </div>

    <div style="display: flex; margin-bottom: 20px">
      <div @click="show(item)"
           style="width: 300px; height: 300px; text-align: center; line-height: 300px; font-size: 30px; margin-right: 10px; background-color: green"
           v-for="item in data.arr">{{ item }}
      </div>
      <div>
        <select style="width: 200px">
          <option v-for="item in data.fruits">{{ item }}</option>
          <!--          <option>香蕉</option>-->
          <!--          <option>橘子</option>-->
        </select>
      </div>
    </div>

    <div style="margin-bottom: 20px">
      <button @click="click">点我加好运</button>
    </div>

    <div style="margin-bottom: 30px">
      <div :style="data.box"></div>
      <div>
        <img :src="data.img" alt="">
      </div>
    </div>

    <div style="margin: 30px">
      <el-button @click="clickData" :style="{color: 'red'}">蔡徐坤</el-button>
      <el-button type="primary">1</el-button>
      <el-button type="success">只因</el-button>
      <el-button type="info">3</el-button>
      <el-button type="warning">4</el-button>
      <el-button type="danger">5</el-button>
    </div>

    <div style="margin: 30px">
      <el-icon :size="20">
        <Edit />
      </el-icon>

      <span style="margin-left: 30px; color: #666">
        <el-icon :size="20" color="#666" style="top: 4px"><View /></el-icon> 100
      </span>

      <el-button type="danger" :icon="Delete" circle />

      <el-input
          v-model = "data.a"
          style = "width: 240px"
          placeholder="Type something"
          :prefix-icon = "Search"NEW_FILE_CODE

      />
    </div>

  </div>
</template>

<script setup>
import {reactive, ref, onMounted} from "vue";
import {Delete, Search} from "@element-plus/icons-vue";


const a = ref(1)
const b = ref("蔡徐坤真的很帅")

const data = reactive({
  a: 123,
  b: "蔡徐坤你真的很骚",
  c: "111222333",
  d: false,
  name: '乔治',
  arr: [4, 5, 6],
  fruits: ['苹果', '香蕉', '橘子'],
  box: {
    width: '100px',
    height: '100px',
    backgroundColor: 'red'
  },
  img: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fci.xiaohongshu.com%2Faedfa86b-136b-f11c-eda7-1deade2a331e%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fci.xiaohongshu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1767362136&t=1d46ff5b94fd46bd8679cbd130fc03db'
})

onMounted(() => {
  alert("页面加载完成")
})

const clickData = () => {
  alert("我当前使用的是Element-Plus组件的点击事件")
}

const show = (value) => {
  alert(value)
}

const click = () => {
  alert("好运+1")
}
</script>