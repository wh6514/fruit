<template>
  <div class="about-container">
    <el-card class="about-card">
      <template #header>
        <div class="card-header">
          <span class="header-emoji">🌟</span>
          <span class="card-title">关于页面</span>
        </div>
      </template>

      <div class="content">
        <p class="description">这是一个 Vue Router 路由跳转示例页面！</p>

        <el-alert
            title="💡 学习要点"
            type="info"
            :closable="false"
            show-icon
        >
          <template #default>
            <ul class="learning-points">
              <li>使用 &lt;router-link&gt; 组件进行声明式导航</li>
              <li>使用 useRouter() 进行编程式导航</li>
              <li>路由参数传递和查询参数</li>
              <li>路由守卫和权限控制</li>
            </ul>
          </template>
        </el-alert>

        <div class="navigation-demo">
          <h3>🚀 导航演示</h3>

          <el-space direction="vertical" size="large" style="width: 100%">
            <div class="demo-section">
              <h4>1️⃣ 声明式导航（router-link）</h4>
              <el-button type="primary" round>
                <router-link to="/" class="router-link-custom">
                  🏠 返回首页
                </router-link>
              </el-button>
            </div>

            <div class="demo-section">
              <h4>2️⃣ 编程式导航（useRouter）</h4>
              <el-button @click="goHome" type="success" round>
                🔙 返回首页
              </el-button>
              <el-button @click="goHomeWithParams" type="warning" round>
                📦 带参数返回
              </el-button>
            </div>

            <div class="demo-section">
              <h4>3️⃣ 路由传参演示</h4>
              <el-input
                  v-model="message"
                  placeholder="输入要传递的消息"
                  style="width: 300px; margin-right: 10px"
              />
              <el-button @click="sendToHome" type="primary" round>
                📨 发送到首页
              </el-button>
            </div>

            <div class="demo-section">
              <h4>4️⃣ 浏览器历史操作</h4>
              <el-button @click="goBack" round>
                ⬅️ 后退
              </el-button>
              <el-button @click="goForward" round>
                ➡️ 前进
              </el-button>
            </div>
          </el-space>
        </div>

        <div v-if="receivedMessage" class="message-display">
          <el-tag type="success" size="large">
            📩 收到的消息：{{ receivedMessage }}
          </el-tag>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()

const message = ref('')
const receivedMessage = ref('')

onMounted(() => {
  if (route.query.msg) {
    receivedMessage.value = route.query.msg
  }
})

const goHome = () => {
  router.push('/')
  ElMessage.success('正在返回首页...')
}

const goHomeWithParams = () => {
  router.push({
    path: '/',
    query: {
      from: 'about',
      time: new Date().toLocaleString()
    }
  })
}

const sendToHome = () => {
  if (!message.value) {
    ElMessage.warning('请先输入消息内容')
    return
  }

  router.push({
    path: '/',
    query: {
      msg: message.value
    }
  })

  ElMessage.success('消息已发送！')
}

const goBack = () => {
  router.go(-1)
}

const goForward = () => {
  router.go(1)
}
</script>

<style scoped>
.about-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.about-card {
  width: 100%;
  max-width: 800px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 3px solid #fff;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.header-emoji {
  font-size: 32px;
}

.card-title {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.content {
  padding: 20px 0;
}

.description {
  font-size: 18px;
  color: #606266;
  text-align: center;
  margin-bottom: 20px;
}

.learning-points {
  list-style: none;
  padding: 0;
  margin: 0;
}

.learning-points li {
  padding: 8px 0;
  color: #606266;
  line-height: 1.6;
}

.navigation-demo {
  margin-top: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 16px;
}

.navigation-demo h3 {
  color: #303133;
  margin-bottom: 20px;
  text-align: center;
}

.demo-section {
  margin-bottom: 20px;
  padding: 15px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.demo-section h4 {
  color: #606266;
  margin-bottom: 10px;
  font-size: 16px;
}

.router-link-custom {
  color: #fff;
  text-decoration: none;
  display: inline-block;
  width: 100%;
  height: 100%;
}

.message-display {
  margin-top: 20px;
  text-align: center;
}
</style>
