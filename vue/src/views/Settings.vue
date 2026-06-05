<template>
  <div class="settings-container">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <el-icon><Setting /></el-icon>
              <span>系统设置</span>
            </div>
          </template>

          <el-tabs v-model="activeTab" type="border-card">
            <el-tab-pane name="basic">
              <template #label>
                <span class="tab-label">
                  <el-icon><InfoFilled /></el-icon>
                  基础设置
                </span>
              </template>
              <el-form :model="basicSettings" label-width="140px" class="settings-form">
                <el-form-item label="系统名称">
                  <el-input v-model="basicSettings.systemName" placeholder="请输入系统名称">
                    <template #prefix>
                      <el-icon><Edit /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item label="系统标语">
                  <el-input v-model="basicSettings.slogan" placeholder="请输入系统标语">
                    <template #prefix>
                      <el-icon><ChatDotRound /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item label="客服电话">
                  <el-input v-model="basicSettings.servicePhone" placeholder="请输入客服电话">
                    <template #prefix>
                      <el-icon><Phone /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item label="仓库地址">
                  <el-input v-model="basicSettings.warehouseAddress" type="textarea" :rows="3" placeholder="请输入仓库地址" />
                </el-form-item>
                <el-form-item label="营业时间">
                  <el-time-picker
                    v-model="basicSettings.businessHours"
                    is-range
                    format="HH:mm"
                    value-format="HH:mm"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    style="width: 100%"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="saveSettings">
                    <el-icon><Check /></el-icon>
                    保存设置
                  </el-button>
                  <el-button @click="resetSettings">
                    <el-icon><Refresh /></el-icon>
                    重置
                  </el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <el-tab-pane name="fruit">
              <template #label>
                <span class="tab-label">
                  <el-icon><Apple /></el-icon>
                  水果配置
                </span>
              </template>
              <el-form :model="fruitSettings" label-width="140px" class="settings-form">
                <el-form-item label="库存预警阈值">
                  <el-input-number v-model="fruitSettings.lowStockThreshold" :min="1" :max="100" />
                  <span class="form-tip">当库存低于此值时预警</span>
                </el-form-item>
                <el-form-item label="新鲜度标准">
                  <el-rate v-model="fruitSettings.freshnessStandard" />
                  <span class="form-tip">最低新鲜度要求</span>
                </el-form-item>
                <el-form-item label="默认计量单位">
                  <el-select v-model="fruitSettings.unit" style="width: 200px">
                    <el-option label="千克(kg)" value="kg" />
                    <el-option label="克(g)" value="g" />
                    <el-option label="斤" value="jin" />
                    <el-option label="个" value="piece" />
                  </el-select>
                </el-form-item>
                <el-form-item label="自动补货提醒">
                  <el-switch v-model="fruitSettings.autoRestockAlert" />
                  <span class="form-tip">库存不足时自动提醒</span>
                </el-form-item>
                <el-form-item label="保质期管理">
                  <el-switch v-model="fruitSettings.expiryManagement" />
                  <span class="form-tip">启用保质期跟踪</span>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="saveSettings">
                    <el-icon><Check /></el-icon>
                    保存设置
                  </el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <el-tab-pane name="notification">
              <template #label>
                <span class="tab-label">
                  <el-icon><Bell /></el-icon>
                  通知设置
                </span>
              </template>
              <el-form :model="notificationSettings" label-width="140px" class="settings-form">
                <el-form-item label="订单通知">
                  <el-checkbox-group v-model="notificationSettings.orderNotify">
                    <el-checkbox label="email">邮件</el-checkbox>
                    <el-checkbox label="sms">短信</el-checkbox>
                    <el-checkbox label="app">APP推送</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="库存预警">
                  <el-checkbox-group v-model="notificationSettings.stockNotify">
                    <el-checkbox label="email">邮件</el-checkbox>
                    <el-checkbox label="sms">短信</el-checkbox>
                    <el-checkbox label="app">APP推送</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="日报发送">
                  <el-switch v-model="notificationSettings.dailyReport" />
                  <span class="form-tip">每日发送业务日报</span>
                </el-form-item>
                <el-form-item label="接收邮箱">
                  <el-input v-model="notificationSettings.email" placeholder="请输入接收邮箱">
                    <template #prefix>
                      <el-icon><Message /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="saveSettings">
                    <el-icon><Check /></el-icon>
                    保存设置
                  </el-button>
                  <el-button @click="testNotification">
                    <el-icon><Promotion /></el-icon>
                    测试通知
                  </el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <el-tab-pane name="security">
              <template #label>
                <span class="tab-label">
                  <el-icon><Lock /></el-icon>
                  安全设置
                </span>
              </template>
              <el-form :model="securitySettings" label-width="140px" class="settings-form">
                <el-form-item label="登录验证码">
                  <el-switch v-model="securitySettings.captcha" />
                </el-form-item>
                <el-form-item label="登录失败限制">
                  <el-switch v-model="securitySettings.loginLimit" />
                </el-form-item>
                <el-form-item label="最大尝试次数">
                  <el-input-number v-model="securitySettings.maxAttempts" :min="3" :max="10" />
                  <span class="form-tip">次</span>
                </el-form-item>
                <el-form-item label="会话超时时间">
                  <el-input-number v-model="securitySettings.sessionTimeout" :min="30" :max="480" :step="30" />
                  <span class="form-tip">分钟</span>
                </el-form-item>
                <el-form-item label="密码强度要求">
                  <el-select v-model="securitySettings.passwordStrength" style="width: 200px">
                    <el-option label="低" value="low" />
                    <el-option label="中" value="medium" />
                    <el-option label="高" value="high" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="saveSettings">
                    <el-icon><Check /></el-icon>
                    保存设置
                  </el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="never" class="info-card">
          <template #header>
            <div class="card-header">
              <el-icon><InfoFilled /></el-icon>
              <span>系统信息</span>
            </div>
          </template>
          <div class="system-info">
            <div class="info-item">
              <span class="info-label">系统版本</span>
              <span class="info-value">v2.0.0</span>
            </div>
            <div class="info-item">
              <span class="info-label">最后更新</span>
              <span class="info-value">2024-01-15</span>
            </div>
            <div class="info-item">
              <span class="info-label">技术支持</span>
              <span class="info-value">鲜果优选技术团队</span>
            </div>
            <el-divider />
            <el-alert
              title="温馨提示"
              type="info"
              :closable="false"
              show-icon
            >
              <template #default>
                <p>修改设置后请点击保存按钮生效</p>
              </template>
            </el-alert>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Setting, InfoFilled, Edit, ChatDotRound, Phone, Check, Refresh,
  Apple, Bell, Lock, Message, Promotion
} from '@element-plus/icons-vue'

const activeTab = ref('basic')

const basicSettings = reactive({
  systemName: '鲜果优选后台管理系统',
  slogan: '新鲜水果，品质保证',
  servicePhone: '400-888-9999',
  warehouseAddress: '北京市朝阳区水果批发市场A区100号',
  businessHours: ['08:00', '18:00']
})

const fruitSettings = reactive({
  lowStockThreshold: 20,
  freshnessStandard: 4,
  unit: 'kg',
  autoRestockAlert: true,
  expiryManagement: true
})

const notificationSettings = reactive({
  orderNotify: ['email', 'app'],
  stockNotify: ['email', 'sms', 'app'],
  dailyReport: true,
  email: 'admin@freshfruit.com'
})

const securitySettings = reactive({
  captcha: true,
  loginLimit: true,
  maxAttempts: 5,
  sessionTimeout: 120,
  passwordStrength: 'medium'
})

const saveSettings = () => {
  ElMessage.success('设置保存成功')
}

const resetSettings = () => {
  ElMessage.info('已重置为默认设置')
}

const testNotification = () => {
  ElMessage.success('测试通知已发送')
}
</script>

<style scoped lang="scss">
.settings-container {
  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }

  .tab-label {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .settings-form {
    padding: 20px;

    .form-tip {
      margin-left: 10px;
      font-size: 12px;
      color: #999;
    }
  }

  .info-card {
    .system-info {
      .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        .info-label {
          color: #666;
          font-size: 14px;
        }

        .info-value {
          color: #333;
          font-weight: 500;
        }
      }
    }
  }
}
</style>
