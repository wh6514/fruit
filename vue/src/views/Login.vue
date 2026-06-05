<template>
  <div class="login-container">
    <div class="login-background">
      <div class="floating-fruit">🍎</div>
      <div class="floating-fruit">🍌</div>
      <div class="floating-fruit">🍑</div>
      <div class="floating-fruit">🍉</div>
      <div class="floating-fruit">🍇</div>
      <div class="floating-fruit">🍊</div>
    </div>

    <div class="login-box">
      <div class="login-header">
        <div class="logo-wrapper">
          <span class="logo-emoji">🍎</span>
        </div>
        <h2 class="title">鲜果优选</h2>
        <p class="subtitle">后台管理系统</p>
      </div>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
            size="large"
            clearable
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            size="large"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            class="login-btn"
            @click="handleLogin"
          >
            <span v-if="!loading">登 录</span>
            <span v-else>登录中...</span>
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-tips">
        <el-icon><InfoFilled /></el-icon>
        <div>
          <p>默认账号：<strong>admin</strong> / <strong>user</strong></p>
          <p>密码：任意输入</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { InfoFilled } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

const loginFormRef = ref(null)
const loading = ref(false)

const loginForm = reactive({
  username: 'admin',
  password: ''
})

const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))

        const mockToken = 'mock-token-' + Date.now()
        const mockUserInfo = {
          username: loginForm.username,
          roles: loginForm.username === 'admin' ? ['admin'] : ['user'],
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
        }

        userStore.setToken(mockToken)
        userStore.setUserInfo(mockUserInfo)

        ElMessage.success('登录成功，欢迎使用鲜果优选！')
        router.push('/')
      } catch (error) {
        ElMessage.error('登录失败，请重试')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  .login-background {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .floating-fruit {
      position: absolute;
      font-size: 60px;
      opacity: 0.15;
      animation: float 15s infinite ease-in-out;

      &:nth-child(1) { top: 10%; left: 10%; animation-delay: 0s; }
      &:nth-child(2) { top: 20%; right: 15%; animation-delay: 2s; }
      &:nth-child(3) { bottom: 20%; left: 20%; animation-delay: 4s; }
      &:nth-child(4) { bottom: 15%; right: 10%; animation-delay: 6s; }
      &:nth-child(5) { top: 50%; left: 5%; animation-delay: 8s; }
      &:nth-child(6) { top: 40%; right: 5%; animation-delay: 10s; }
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0) rotate(0deg);
      }
      50% {
        transform: translateY(-30px) rotate(180deg);
      }
    }
  }

  .login-box {
    width: 420px;
    padding: 40px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    z-index: 1;
    animation: slideUp 0.5s ease;

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .login-header {
      text-align: center;
      margin-bottom: 35px;

      .logo-wrapper {
        width: 80px;
        height: 80px;
        margin: 0 auto 15px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);

        .logo-emoji {
          font-size: 48px;
          animation: bounce 2s ease infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      }

      .title {
        font-size: 28px;
        color: #333;
        margin: 0 0 5px;
        font-weight: bold;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .subtitle {
        font-size: 14px;
        color: #999;
        margin: 0;
      }
    }

    .login-form {
      .login-btn {
        width: 100%;
        height: 48px;
        font-size: 16px;
        font-weight: 500;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        transition: all 0.3s;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }
      }
    }

    .login-tips {
      margin-top: 20px;
      padding: 15px;
      background: #f5f7fa;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 10px;

      .el-icon {
        font-size: 20px;
        color: #409EFF;
      }

      p {
        margin: 3px 0;
        font-size: 12px;
        color: #666;

        strong {
          color: #333;
        }
      }
    }
  }
}
</style>
