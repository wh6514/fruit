<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card" @click="editStat('orders')" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon stat-orders">
              <el-icon><ShoppingCart /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.todayOrders }}</div>
              <div class="stat-label">
                今日订单
                <el-icon class="edit-icon"><Edit /></el-icon>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card" @click="editStat('sales')" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon stat-sales">
              <el-icon><Money /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥{{ stats.todaySales.toLocaleString() }}</div>
              <div class="stat-label">
                今日营收
                <el-icon class="edit-icon"><Edit /></el-icon>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card" @click="editStat('customers')" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon stat-customers">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.newCustomers }}</div>
              <div class="stat-label">
                新增客户
                <el-icon class="edit-icon"><Edit /></el-icon>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card" @click="editStat('inventory')" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon stat-inventory">
              <el-icon><Box /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalInventory }}kg</div>
              <div class="stat-label">
                库存总量
                <el-icon class="edit-icon"><Edit /></el-icon>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span class="header-title">
                <el-icon><TrendCharts /></el-icon>
                销售趋势
              </span>
            </div>
          </template>
          <div class="chart-placeholder">
            <el-empty description="销售图表区域（可集成 ECharts）" :image-size="100" />
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <span class="header-title">
                <el-icon><Bell /></el-icon>
                快捷操作
              </span>
            </div>
          </template>
          <div class="quick-actions">
            <el-button type="primary" @click="goToFruitDemo" class="action-btn">
              <el-icon><ShoppingCart /></el-icon>
              <span>采购下单</span>
            </el-button>
            <el-button type="success" @click="goToInventory" class="action-btn">
              <el-icon><Box /></el-icon>
              <span>库存管理</span>
            </el-button>
            <el-button type="warning" @click="handleViewReports" class="action-btn">
              <el-icon><Document /></el-icon>
              <span>数据报表</span>
            </el-button>
            <el-button type="info" @click="handleCustomerService" class="action-btn">
              <el-icon><Service /></el-icon>
              <span>客户服务</span>
            </el-button>
          </div>
        </el-card>

        <el-card style="margin-top: 20px;">
          <template #header>
            <div class="card-header">
              <span class="header-title">
                <el-icon><Star /></el-icon>
                热销水果
              </span>
              <div>
                <el-button type="warning" size="small" @click="resetToDefault" style="margin-right: 8px;">
                  <el-icon><Refresh /></el-icon>
                  重置
                </el-button>
                <el-button type="primary" size="small" @click="editHotFruits">
                  <el-icon><Edit /></el-icon>
                  编辑
                </el-button>
              </div>
            </div>
          </template>
          <div class="hot-fruits">
            <div v-for="fruit in hotFruits" :key="fruit.id" class="hot-fruit-item">
              <span class="fruit-emoji">{{ fruit.emoji }}</span>
              <div class="fruit-info">
                <div class="fruit-name">{{ fruit.name }}</div>
                <div class="fruit-sales">销量: {{ fruit.sales }}kg</div>
              </div>
              <el-tag type="danger" size="small">TOP{{ fruit.rank }}</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      v-model="editDialogVisible"
      :title="dialogTitle"
      width="500px"
    >
      <el-form :model="editForm" label-width="100px">
        <el-form-item :label="inputLabel">
          <el-input-number
            v-model="editForm.newValue"
            :min="0"
            :step="getStep(currentEditType)"
            :precision="currentEditType === 'sales' ? 2 : 0"
            style="width: 100%"
            size="large"
          />
        </el-form-item>
        <el-form-item label="单位">
          <el-tag size="large" type="info">{{ getUnit(currentEditType) }}</el-tag>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEdit">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="hotFruitsDialogVisible"
      title="编辑热销水果"
      width="700px"
    >
      <el-table :data="tempHotFruits" border style="width: 100%">
        <el-table-column label="排名" width="80">
          <template #default="{ row }">
            <el-tag type="danger" size="small">TOP{{ row.rank }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="图标" width="100">
          <template #default="{ row }">
            <el-select v-model="row.emoji" size="small">
              <el-option label="🍎" value="🍎" />
              <el-option label="🍌" value="🍌" />
              <el-option label="🍑" value="🍑" />
              <el-option label="🍉" value="🍉" />
              <el-option label="🍇" value="🍇" />
              <el-option label="🍊" value="🍊" />
              <el-option label="🍓" value="🍓" />
              <el-option label="🍍" value="🍍" />
              <el-option label="🥭" value="🥭" />
              <el-option label="🍒" value="🍒" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="名称" min-width="150">
          <template #default="{ row }">
            <el-input v-model="row.name" placeholder="水果名称" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="销量(kg)" width="150">
          <template #default="{ row }">
            <el-input-number
              v-model="row.sales"
              :min="0"
              :step="10"
              size="small"
              controls-position="right"
            />
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="hotFruitsDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveHotFruits">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ShoppingCart, Money, User, Box, TrendCharts, Bell, Star, Document, Service, Edit, Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

const defaultStats = {
  todayOrders: 156,
  todaySales: 8960,
  newCustomers: 89,
  totalInventory: 1234
}

const defaultHotFruits = [
  { id: 1, emoji: '🍎', name: '红富士苹果', sales: 256, rank: 1 },
  { id: 2, emoji: '🍌', name: '进口香蕉', sales: 198, rank: 2 },
  { id: 3, emoji: '🍉', name: '麒麟西瓜', sales: 167, rank: 3 },
  { id: 4, emoji: '🍇', name: '巨峰葡萄', sales: 134, rank: 4 },
  { id: 5, emoji: '🍓', name: '奶油草莓', sales: 112, rank: 5 }
]

const stats = reactive({ ...defaultStats })
const hotFruits = ref([...defaultHotFruits])
const tempHotFruits = ref([])

const editDialogVisible = ref(false)
const currentEditType = ref('')
const editForm = reactive({
  newValue: 0
})
const inputLabel = ref('')

const hotFruitsDialogVisible = ref(false)
const dialogTitle = ref('')

const typeToKeyMap = {
  orders: 'todayOrders',
  sales: 'todaySales',
  customers: 'newCustomers',
  inventory: 'totalInventory'
}

watch(() => stats.todayOrders, (newVal) => {
  console.log('todayOrders changed to:', newVal)
})

watch(() => stats.todaySales, (newVal) => {
  console.log('todaySales changed to:', newVal)
})

watch(() => stats.newCustomers, (newVal) => {
  console.log('newCustomers changed to:', newVal)
})

watch(() => stats.totalInventory, (newVal) => {
  console.log('totalInventory changed to:', newVal)
})

const loadStatsFromStorage = () => {
  const savedStats = localStorage.getItem('dashboard_stats')
  if (savedStats) {
    try {
      const parsedStats = JSON.parse(savedStats)
      Object.assign(stats, parsedStats)
      console.log('从localStorage加载数据:', parsedStats)
    } catch (e) {
      console.error('解析localStorage数据失败:', e)
    }
  } else {
    console.log('使用默认数据:', defaultStats)
  }

  const savedHotFruits = localStorage.getItem('dashboard_hot_fruits')
  if (savedHotFruits) {
    try {
      hotFruits.value = JSON.parse(savedHotFruits)
    } catch (e) {
      console.error('解析热销水果数据失败:', e)
    }
  }
}

const saveStatsToStorage = () => {
  localStorage.setItem('dashboard_stats', JSON.stringify(stats))
  console.log('保存数据到localStorage:', stats)
}

const saveHotFruitsToStorage = () => {
  localStorage.setItem('dashboard_hot_fruits', JSON.stringify(hotFruits.value))
}

const getUnit = (type) => {
  switch(type) {
    case 'orders':
      return '单'
    case 'sales':
      return '元'
    case 'customers':
      return '人'
    case 'inventory':
      return 'kg'
    default:
      return ''
  }
}

const getStep = (type) => {
  switch(type) {
    case 'orders':
      return 1
    case 'sales':
      return 100
    case 'customers':
      return 1
    case 'inventory':
      return 10
    default:
      return 1
  }
}

const editStat = (type) => {
  currentEditType.value = type
  const key = typeToKeyMap[type]
  editForm.newValue = stats[key]

  console.log('编辑前 - 类型:', type, 'key:', key, '当前值:', stats[key], '表单值:', editForm.newValue)

  switch(type) {
    case 'orders':
      dialogTitle.value = '编辑今日订单'
      inputLabel.value = '订单数量'
      break
    case 'sales':
      dialogTitle.value = '编辑今日营收'
      inputLabel.value = '营收金额'
      break
    case 'customers':
      dialogTitle.value = '编辑新增客户'
      inputLabel.value = '客户数量'
      break
    case 'inventory':
      dialogTitle.value = '编辑库存总量'
      inputLabel.value = '库存总量'
      break
  }

  editDialogVisible.value = true
}

const saveEdit = () => {
  if (editForm.newValue < 0) {
    ElMessage.error('数值不能为负数')
    return
  }

  const key = typeToKeyMap[currentEditType.value]

  console.log('保存前 - 类型:', currentEditType.value, 'key:', key, '新值:', editForm.newValue)

  stats[key] = editForm.newValue

  console.log('保存后 - 新值:', stats[key])

  const typeName = {
    orders: '今日订单',
    sales: '今日营收',
    customers: '新增客户',
    inventory: '库存总量'
  }[currentEditType.value]

  saveStatsToStorage()

  ElMessage.success(`${typeName}已更新为: ${editForm.newValue}${getUnit(currentEditType)}`)
  editDialogVisible.value = false
}

const resetToDefault = () => {
  Object.assign(stats, defaultStats)
  hotFruits.value = [...defaultHotFruits]
  saveStatsToStorage()
  saveHotFruitsToStorage()
  ElMessage.success('已恢复默认数据')
}

const editHotFruits = () => {
  tempHotFruits.value = JSON.parse(JSON.stringify(hotFruits.value))
  hotFruitsDialogVisible.value = true
}

const saveHotFruits = () => {
  for (let i = 0; i < tempHotFruits.value.length; i++) {
    const fruit = tempHotFruits.value[i]
    if (!fruit.name || fruit.name.trim() === '') {
      ElMessage.error(`第${i + 1}行的水果名称不能为空`)
      return
    }
    if (fruit.sales < 0) {
      ElMessage.error(`第${i + 1}行的销量不能为负数`)
      return
    }
  }

  hotFruits.value = tempHotFruits.value
  saveHotFruitsToStorage()

  ElMessage.success('热销水果已更新')
  hotFruitsDialogVisible.value = false
}

const goToFruitDemo = () => {
  router.push('/business/purchase')
  ElMessage.success('正在跳转到采购下单页面...')
}

const goToInventory = () => {
  router.push('/business/inventory')
  ElMessage.success('正在跳转到库存管理页面...')
}

const handleViewReports = () => {
  ElMessage.info('数据报表功能开发中...')
}

const handleCustomerService = () => {
  ElMessage.info('客户服务功能开发中...')
}

onMounted(() => {
  loadStatsFromStorage()
})
</script>

<style scoped lang="scss">
.dashboard-container {
  .stat-card {
    margin-bottom: 20px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 15px;

      .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 28px;

        &.stat-orders {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        &.stat-sales {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        &.stat-customers {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        &.stat-inventory {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }
      }

      .stat-info {
        .stat-value {
          font-size: 26px;
          font-weight: bold;
          color: #333;
        }

        .stat-label {
          font-size: 14px;
          color: #999;
          margin-top: 5px;
          display: flex;
          align-items: center;
          gap: 5px;

          .edit-icon {
            font-size: 14px;
            opacity: 0;
            transition: opacity 0.3s;
          }
        }
      }
    }

    &:hover .stat-label .edit-icon {
      opacity: 1;
    }
  }

  .card-header {
    .header-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: bold;
      color: #333;
    }
  }

  .chart-placeholder {
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border-radius: 8px;
  }

  .quick-actions {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;

    .action-btn {
      height: 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 5px;
      font-size: 13px;

      .el-icon {
        font-size: 20px;
      }
    }
  }

  .hot-fruits {
    .hot-fruit-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      margin-bottom: 8px;
      background: #f5f7fa;
      border-radius: 8px;
      transition: all 0.3s;

      &:last-child {
        margin-bottom: 0;
      }

      &:hover {
        background: #e8eaed;
        transform: translateX(5px);
      }

      .fruit-emoji {
        font-size: 28px;
      }

      .fruit-info {
        flex: 1;

        .fruit-name {
          font-weight: 500;
          color: #333;
          margin-bottom: 4px;
        }

        .fruit-sales {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
}
</style>
