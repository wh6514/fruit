<template>
  <div class="app-wrapper">
    <el-container>
      <el-aside :width="sidebarWidth" class="sidebar-container">
        <div class="logo-container">
          <div class="logo-icon">🍎</div>
          <span v-show="!appStore.sidebarCollapsed" class="system-title">鲜果优选</span>
        </div>
        <el-menu
            :default-active="activeMenu"
            :collapse="appStore.sidebarCollapsed"
            :unique-opened="true"
            router
            background-color="#001529"
            text-color="#a6adb4"
            active-text-color="#fff"
            class="sidebar-menu"
        >
          <sidebar-item
              v-for="route in routes"
              :key="route.path"
              :item="route"
              :base-path="route.path"
          />
        </el-menu>
      </el-aside>

      <el-container>
        <el-header class="navbar">
          <div class="left-menu">
            <el-icon class="hamburger" @click="toggleSidebar">
              <Fold v-if="!appStore.sidebarCollapsed" />
              <Expand v-else />
            </el-icon>
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
                {{ item.meta.title }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>

          <div class="right-menu">
            <el-badge :value="12" class="notification-badge">
              <el-icon class="notification-icon"><Bell /></el-icon>
            </el-badge>
            <el-dropdown trigger="click">
              <div class="avatar-wrapper">
                <el-avatar :size="36" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                <span class="username">{{ userStore.userInfo.username || '管理员' }}</span>
                <el-icon><CaretBottom /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <el-icon><User /></el-icon>
                    个人中心
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout">
                    <el-icon><SwitchButton /></el-icon>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <div class="tags-view" v-if="appStore.visitedViews.length > 0">
          <el-tag
              v-for="tag in appStore.visitedViews"
              :key="tag.path"
              :closable="tag.path !== '/'"
              :effect="isActive(tag.path) ? 'dark' : 'plain'"
              @click="$router.push(tag.path)"
              @close="handleCloseTag(tag)"
              class="tag-item"
          >
            {{ tag.title }}
          </el-tag>
        </div>

        <el-main class="main-content">
          <router-view v-slot="{ Component, route }">
            <transition name="fade-transform" mode="out-in">
              <keep-alive :include="appStore.cachedViews">
                <component :is="Component" :key="route.path" />
              </keep-alive>
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import SidebarItem from './components/SidebarItem.vue'
import { Fold, Expand, CaretBottom, SwitchButton, Bell, User } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const appStore = useAppStore()

const sidebarWidth = computed(() => appStore.sidebarCollapsed ? '64px' : '210px')

const activeMenu = computed(() => route.path)

const routes = computed(() => {
  return router.options.routes.filter(r => !r.hidden && r.meta?.title)
})

const breadcrumbs = computed(() => {
  return route.matched.slice(1)
})

const toggleSidebar = () => {
  appStore.toggleSidebar()
}

const isActive = (path) => {
  return route.path === path
}

const handleCloseTag = (tag) => {
  appStore.delVisitedView(tag.path)
  appStore.delCachedView(tag)
  if (isActive(tag.path)) {
    const latestView = appStore.visitedViews.slice(-1)[0]
    if (latestView) {
      router.push(latestView.path)
    } else {
      router.push('/')
    }
  }
}

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore.logout()
    ElMessage.success('已退出登录')
    router.push('/login')
  })
}
</script>

<style scoped lang="scss">
.app-wrapper {
  width: 100%;
  height: 100vh;
}

.el-container {
  height: 100%;
}

.sidebar-container {
  background-color: #001529;
  transition: width 0.28s;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);

  .logo-container {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
      background-size: 20px 20px;
      animation: float 20s linear infinite;
    }

    @keyframes float {
      0% { transform: translate(0, 0); }
      100% { transform: translate(50px, 50px); }
    }

    .logo-icon {
      font-size: 32px;
      z-index: 1;
      animation: bounce 2s ease infinite;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }

    .system-title {
      margin-left: 10px;
      font-size: 18px;
      font-weight: bold;
      color: #fff;
      white-space: nowrap;
      z-index: 1;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
  }

  .sidebar-menu {
    border-right: none;

    :deep(.el-menu-item),
    :deep(.el-sub-menu__title) {
      &:hover {
        background-color: rgba(255, 255, 255, 0.05) !important;
      }
    }

    :deep(.el-menu-item.is-active) {
      background: linear-gradient(90deg, rgba(102, 126, 234, 0.3) 0%, transparent 100%) !important;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
      }
    }
  }
}

.navbar {
  height: 60px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;

  .left-menu {
    display: flex;
    align-items: center;
    gap: 20px;

    .hamburger {
      font-size: 22px;
      cursor: pointer;
      transition: all 0.3s;
      padding: 8px;
      border-radius: 4px;

      &:hover {
        background: #f5f7fa;
        transform: scale(1.1);
      }
    }

    :deep(.el-breadcrumb) {
      font-size: 14px;
    }
  }

  .right-menu {
    display: flex;
    align-items: center;
    gap: 20px;

    .notification-badge {
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: scale(1.1);
      }

      .notification-icon {
        font-size: 20px;
        color: #606266;
      }
    }

    .avatar-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 6px 12px;
      border-radius: 20px;
      transition: all 0.3s;

      &:hover {
        background: #f5f7fa;
      }

      .username {
        font-size: 14px;
        color: #333;
      }
    }
  }
}

.tags-view {
  height: 40px;
  background: #fff;
  border-bottom: 1px solid #e8eaec;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  .tag-item {
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-2px);
    }
  }
}

.main-content {
  height: calc(100vh - 100px);
  overflow-y: auto;
  background: #f0f2f5;
  padding: 24px;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;

    &:hover {
      background: #a8a8a8;
    }
  }
}

.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>
