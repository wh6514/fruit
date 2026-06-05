<!-- G:\Code\A_project\QingGe\vue\src\views\FruitInventory.vue -->
<template>
  <div class="inventory-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card" @click="editStat('total')" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon fruit-apple">
              <el-icon><Apple /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ inventoryStats.total }}</div>
              <div class="stat-label">
                水果种类
                <el-icon class="edit-icon"><Edit /></el-icon>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card" @click="editStat('fresh')" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon fruit-fresh">
              <el-icon><SuccessFilled /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ inventoryStats.fresh }}</div>
              <div class="stat-label">
                新鲜库存
                <el-icon class="edit-icon"><Edit /></el-icon>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card" @click="editStat('lowStock')" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon fruit-warning">
              <el-icon><Warning /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ inventoryStats.lowStock }}</div>
              <div class="stat-label">
                库存预警
                <el-icon class="edit-icon"><Edit /></el-icon>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card" @click="editStat('todaySales')" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon fruit-sales">
              <el-icon><TrendCharts /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥{{ inventoryStats.todaySales }}</div>
              <div class="stat-label">
                今日销售额
                <el-icon class="edit-icon"><Edit /></el-icon>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="header-title">
            <el-icon><List /></el-icon>
            水果库存列表
          </span>
          <div>
            <el-button type="warning" @click="resetToDefault" style="margin-right: 8px;">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
            <el-button type="primary" @click="handleAddFruit">
              <el-icon><Plus /></el-icon>
              添加水果
            </el-button>
          </div>
        </div>
      </template>

      <el-table :data="fruitList" stripe style="width: 100%" :row-class-name="getRowClassName">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="水果" min-width="250">
          <template #default="{ row }">
            <div class="fruit-cell">
              <span class="fruit-emoji">{{ row.emoji }}</span>
              <span class="fruit-name">{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="单价" width="130">
          <template #default="{ row }">
            <span class="price-text">¥{{ row.price.toFixed(2) }}/kg</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="120">
          <template #default="{ row }">
            <span class="stock-text">{{ row.stock }} kg</span>
          </template>
        </el-table-column>
        <el-table-column prop="origin" label="产地" width="150" />
        <el-table-column prop="freshness" label="新鲜度" width="120">
          <template #default="{ row }">
            <el-tag :type="getFreshnessType(row.freshness)" effect="dark">
              {{ getFreshnessText(row.freshness) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '在售' ? 'success' : 'info'" effect="dark">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">
              下架
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="fruitForm" :rules="fruitRules" label-width="100px">
        <el-form-item label="水果名称" prop="name">
          <el-input v-model="fruitForm.name" placeholder="请输入水果名称">
            <template #prepend>
              <el-select v-model="fruitForm.emoji" style="width: 80px">
                <el-option label="🍎" value="🍎" />
                <el-option label="🍌" value="🍌" />
                <el-option label="🍑" value="🍑" />
                <el-option label="🍉" value="🍉" />
                <el-option label="🍇" value="🍇" />
                <el-option label="🍊" value="🍊" />
                <el-option label="🍓" value="🍓" />
                <el-option label="🍍" value="🍍" />
              </el-select>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input-number v-model="fruitForm.price" :min="0" :precision="2" :step="0.5" style="width: 100%" />
          <span style="margin-left: 10px; color: #999;">元/kg</span>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="fruitForm.stock" :min="0" :step="5" style="width: 100%" />
          <span style="margin-left: 10px; color: #999;">kg</span>
        </el-form-item>
        <el-form-item label="产地" prop="origin">
          <el-input v-model="fruitForm.origin" placeholder="请输入产地" />
        </el-form-item>
        <el-form-item label="新鲜度" prop="freshness">
          <el-rate v-model="fruitForm.freshness" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="fruitForm.status">
            <el-radio value="在售">在售</el-radio>
            <el-radio value="售罄">售罄</el-radio>
            <el-radio value="预售">预售</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="editDialogVisible"
      :title="editDialogTitle"
      width="500px"
    >
      <el-form label-width="100px">
        <el-form-item :label="editFieldLabel">
          <el-input-number
            v-model="editFieldValue"
            :min="0"
            :step="getEditStep()"
            :precision="currentEditField === 'todaySales' ? 2 : 0"
            style="width: 100%"
            size="large"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEditStat">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Apple, SuccessFilled, Warning, TrendCharts, List, Plus, Edit, Refresh } from '@element-plus/icons-vue'

const defaultStats = {
  total: 0,
  fresh: 0,
  lowStock: 0,
  todaySales: 0
}

const defaultFruitList = []

const inventoryStats = ref({ ...defaultStats })

const fruitList = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)

const editDialogVisible = ref(false)
const currentEditField = ref('')
const editFieldValue = ref(0)
const editDialogTitle = ref('')
const editFieldLabel = ref('')

const fruitForm = reactive({
  id: null,
  emoji: '🍎',
  name: '',
  price: 0,
  stock: 0,
  origin: '',
  freshness: 5,
  status: '在售'
})

const fruitRules = {
  name: [{ required: true, message: '请输入水果名称', trigger: 'blur' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入库存', trigger: 'blur' }],
  origin: [{ required: true, message: '请输入产地', trigger: 'blur' }]
}

const loadFromStorage = () => {
  const savedStats = localStorage.getItem('inventory_stats')
  if (savedStats) {
    try {
      inventoryStats.value = JSON.parse(savedStats)
    } catch (e) {
      console.error('加载统计数据失败:', e)
    }
  }

  const savedFruits = localStorage.getItem('inventory_fruits')
  if (savedFruits) {
    try {
      fruitList.value = JSON.parse(savedFruits)
    } catch (e) {
      console.error('加载水果列表失败:', e)
      fruitList.value = [...defaultFruitList]
    }
  } else {
    fruitList.value = [...defaultFruitList]
  }
}

const saveToStorage = () => {
  localStorage.setItem('inventory_stats', JSON.stringify(inventoryStats.value))
  localStorage.setItem('inventory_fruits', JSON.stringify(fruitList.value))
}

const getEditStep = () => {
  switch(currentEditField.value) {
    case 'total':
    case 'fresh':
    case 'lowStock':
      return 1
    case 'todaySales':
      return 100
    default:
      return 1
  }
}

const editStat = (field) => {
  currentEditField.value = field
  editFieldValue.value = inventoryStats.value[field]

  const titles = {
    total: '编辑水果种类',
    fresh: '编辑新鲜库存',
    lowStock: '编辑库存预警',
    todaySales: '编辑今日销售额'
  }

  const labels = {
    total: '种类数量',
    fresh: '新鲜库存',
    lowStock: '预警数量',
    todaySales: '销售金额'
  }

  editDialogTitle.value = titles[field]
  editFieldLabel.value = labels[field]
  editDialogVisible.value = true
}

const saveEditStat = () => {
  if (editFieldValue.value < 0) {
    ElMessage.error('数值不能为负数')
    return
  }

  inventoryStats.value[currentEditField.value] = editFieldValue.value
  saveToStorage()

  const names = {
    total: '水果种类',
    fresh: '新鲜库存',
    lowStock: '库存预警',
    todaySales: '今日销售额'
  }

  ElMessage.success(`${names[currentEditField.value]}已更新为: ${editFieldValue.value}`)
  editDialogVisible.value = false
}

const resetToDefault = () => {
  inventoryStats.value = { ...defaultStats }
  fruitList.value = [...defaultFruitList]
  saveToStorage()
  ElMessage.success('已恢复默认数据')
}

const getFreshnessType = (freshness) => {
  if (freshness >= 5) return 'success'
  if (freshness >= 4) return ''
  if (freshness >= 3) return 'warning'
  return 'danger'
}

const getFreshnessText = (freshness) => {
  const texts = ['', '极差', '较差', '一般', '良好', '极佳']
  return texts[freshness] || '未知'
}

const getRowClassName = ({ row }) => {
  if (row.stock < 20) return 'low-stock-row'
  return ''
}

const handleAddFruit = () => {
  dialogTitle.value = '添加水果'
  isEdit.value = false
  Object.assign(fruitForm, {
    id: Date.now(),
    emoji: '🍎',
    name: '',
    price: 0,
    stock: 0,
    origin: '',
    freshness: 5,
    status: '在售'
  })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑水果'
  isEdit.value = true
  Object.assign(fruitForm, { ...row })
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要下架"${row.name}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = fruitList.value.findIndex(f => f.id === row.id)
    if (index > -1) {
      fruitList.value.splice(index, 1)
      saveToStorage()
      ElMessage.success('下架成功')
    }
  })
}

const handleSubmit = () => {
  if (isEdit.value) {
    const index = fruitList.value.findIndex(f => f.id === fruitForm.id)
    if (index > -1) {
      fruitList.value[index] = { ...fruitForm }
    }
    ElMessage.success('修改成功')
  } else {
    fruitList.value.push({ ...fruitForm })
    ElMessage.success('添加成功')
  }

  saveToStorage()
  dialogVisible.value = false
}

onMounted(() => {
  loadFromStorage()
})
</script>

<style scoped lang="scss">
.inventory-container {
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

        &.fruit-apple {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        &.fruit-fresh {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        &.fruit-warning {
          background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        }

        &.fruit-sales {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

  .table-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .header-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 18px;
        font-weight: bold;
        color: #333;
      }
    }

    .fruit-cell {
      display: flex;
      align-items: center;
      gap: 12px;
      min-height: 40px;

      .fruit-emoji {
        font-size: 32px;
        line-height: 1;
        flex-shrink: 0;
        display: inline-block;
        width: 40px;
        text-align: center;
      }

      .fruit-name {
        font-weight: 500;
        white-space: nowrap;
      }
    }

    .price-text {
      color: #f56c6c;
      font-weight: bold;
      font-size: 16px;
    }

    .stock-text {
      font-size: 14px;
      color: #666;
      font-weight: 500;
    }
  }

  :deep(.low-stock-row) {
    background-color: #fef0f0;
  }
}
</style>
