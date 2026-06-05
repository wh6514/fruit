<template>
  <div class="purchase-container">
    <div class="content-wrapper">
      <div class="page-header">
        <el-button @click="goBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <h2 class="page-title">
          <span class="title-icon">🛒</span>
          水果采购下单
        </h2>
        <el-button type="success" @click="goToInventory" class="inventory-btn">
          <el-icon><Box /></el-icon>
          查看库存
        </el-button>
      </div>

      <el-card class="search-card" shadow="never">
        <div class="search-section">
          <el-input
            v-model="searchKeyword"
            placeholder="请输入水果名称查询库存..."
            clearable
            size="large"
            class="search-input"
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button type="primary" size="large" @click="handleSearch" class="search-btn">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
        </div>

        <div v-if="searchResults.length > 0" class="search-results">
          <el-row :gutter="16">
            <el-col
              v-for="fruit in searchResults"
              :key="fruit.id"
              :xs="24"
              :sm="12"
              :md="8"
              :lg="6"
            >
              <el-card class="result-item" shadow="hover">
                <div class="fruit-info">
                  <div class="fruit-emoji">{{ fruit.emoji }}</div>
                  <div class="fruit-details">
                    <div class="fruit-name">{{ fruit.name }}</div>
                    <div class="fruit-meta">
                      <span class="meta-item">
                        <el-tag size="small" :type="getCategoryType(fruit.category)">
                          {{ fruit.category }}
                        </el-tag>
                      </span>
                      <span class="meta-item price">¥{{ fruit.price.toFixed(2) }}/kg</span>
                    </div>
                    <div class="stock-info">
                      <el-progress
                        :percentage="(fruit.stock / 100) * 100"
                        :color="getStockColor(fruit.stock)"
                        :stroke-width="6"
                      />
                      <span class="stock-text">{{ fruit.stock }}kg</span>
                    </div>
                    <div class="origin">
                      <el-icon><Location /></el-icon>
                      {{ fruit.origin }}
                    </div>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <el-empty
          v-else-if="hasSearched"
          description="未找到相关水果"
          :image-size="100"
        />
      </el-card>

      <el-alert
        title="💡 温馨提示"
        type="info"
        :closable="false"
        show-icon
        class="purchase-tips"
      >
        <template #default>
          <p>请填写采购信息，选择需要采购的水果品种和数量</p>
        </template>
      </el-alert>

      <el-card class="form-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span class="header-icon">📋</span>
            <span class="card-title">采购信息</span>
          </div>
        </template>

        <el-form :model="purchaseForm" label-width="120px" class="purchase-form">
          <el-form-item label="供应商">
            <el-input
              v-model="purchaseForm.supplier"
              placeholder="请输入供应商名称"
              clearable
            >
              <template #prefix>
                <el-icon><OfficeBuilding /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="采购日期">
            <el-date-picker
              v-model="purchaseForm.date"
              type="date"
              placeholder="选择采购日期"
              style="width: 100%"
            >
              <template #prefix>
                <el-icon><Calendar /></el-icon>
              </template>
            </el-date-picker>
          </el-form-item>

          <el-form-item label="备注说明">
            <el-input
              v-model="purchaseForm.remark"
              type="textarea"
              :rows="3"
              placeholder="请填写采购备注信息"
            />
          </el-form-item>

          <el-divider content-position="left">
            <el-icon><ShoppingBag /></el-icon>
            水果选择
          </el-divider>

          <el-form-item label="采购水果">
            <el-select
              v-model="purchaseForm.fruits"
              multiple
              placeholder="请选择采购水果"
              style="width: 100%"
              collapse-tags
              collapse-tags-tooltip
            >
              <el-option
                v-for="item in fruitOptions"
                :key="item.id"
                :label="`${item.emoji} ${item.label}`"
                :value="item.name"
              >
                <span style="float: left">{{ item.emoji }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="联系人">
            <el-input
              v-model="purchaseForm.contact"
              placeholder="请输入联系人姓名"
              clearable
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-divider content-position="left">
            <el-icon><Phone /></el-icon>
            联系方式
          </el-divider>

          <el-form-item label="联系电话">
            <el-input
              v-model="purchaseForm.phone"
              placeholder="请输入联系电话"
              clearable
            >
              <template #prefix>
                <el-icon><Phone /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item>
            <div class="button-group">
              <el-button type="primary" @click="handleSubmit" class="action-btn submit-btn">
                <el-icon><Check /></el-icon>
                <span>提交采购单</span>
              </el-button>
              <el-button @click="handleReset" class="action-btn reset-btn">
                <el-icon><Refresh /></el-icon>
                <span>重置表单</span>
              </el-button>
              <el-button type="success" @click="showHistory" class="action-btn history-btn">
                <el-icon><Document /></el-icon>
                <span>采购记录</span>
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <el-dialog
      v-model="dialogVisible"
      title="📜 采购记录"
      width="900px"
    >
      <el-empty v-if="purchaseHistory.length === 0" description="暂无采购记录" />
      <div v-else class="history-content">
        <el-timeline>
          <el-timeline-item
            v-for="(record, index) in paginatedData"
            :key="index"
            :timestamp="record.time"
            placement="top"
            color="#67c23a"
          >
            <el-card class="timeline-card">
              <div class="card-header-actions">
                <el-button
                  type="danger"
                  size="small"
                  @click="deleteRecord((currentPage - 1) * pageSize + index)"
                >
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </div>
              <el-descriptions :column="2" border>
                <el-descriptions-item label="供应商">
                  {{ record.data.supplier || '未填写' }}
                </el-descriptions-item>
                <el-descriptions-item label="采购日期">
                  {{ record.data.date || '未选择' }}
                </el-descriptions-item>
                <el-descriptions-item label="联系人">
                  {{ record.data.contact || '未填写' }}
                </el-descriptions-item>
                <el-descriptions-item label="联系电话">
                  {{ record.data.phone || '未填写' }}
                </el-descriptions-item>
                <el-descriptions-item label="采购水果" :span="2">
                  {{ record.data.fruits.length > 0 ? record.data.fruits.join('、') : '未选择' }}
                </el-descriptions-item>
                <el-descriptions-item label="备注" :span="2">
                  {{ record.data.remark || '无' }}
                </el-descriptions-item>
              </el-descriptions>
            </el-card>
          </el-timeline-item>
        </el-timeline>

        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="purchaseHistory.length"
          layout="prev, pager, next, jumper, total"
          background
          class="pagination"
        />
      </div>
      <template #footer v-if="purchaseHistory.length > 0">
        <el-button @click="clearHistory" type="danger">
          <el-icon><Delete /></el-icon>
          清空全部
        </el-button>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft, Box, OfficeBuilding, Calendar, ShoppingBag,
  User, Phone, Check, Refresh, Document, Delete, Search, Location
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const dialogVisible = ref(false)
const purchaseHistory = ref([])
const currentPage = ref(1)
const pageSize = ref(3)

const searchKeyword = ref('')
const searchResults = ref([])
const hasSearched = ref(false)

const purchaseForm = reactive({
  supplier: '',
  date: '',
  remark: '',
  fruits: [],
  contact: '',
  phone: ''
})

const fruitOptions = [
  { id: 1, label: '红富士苹果', name: 'apple_fuji', emoji: '🍎' },
  { id: 2, label: '进口香蕉', name: 'banana_import', emoji: '🍌' },
  { id: 3, label: '水蜜桃', name: 'peach_honey', emoji: '🍑' },
  { id: 4, label: '麒麟西瓜', name: 'watermelon_qilin', emoji: '🍉' },
  { id: 5, label: '巨峰葡萄', name: 'grape_jufeng', emoji: '🍇' },
  { id: 6, label: '砂糖橘', name: 'orange_sugar', emoji: '🍊' },
  { id: 7, label: '奶油草莓', name: 'strawberry_cream', emoji: '🍓' },
  { id: 8, label: '金钻凤梨', name: 'pineapple_gold', emoji: '🍍' }
]

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return purchaseHistory.value.slice(start, end)
})

const handleSubmit = () => {
  const now = new Date()
  const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`

  purchaseHistory.value.unshift({
    time: timeStr,
    data: {
      supplier: purchaseForm.supplier,
      date: purchaseForm.date,
      remark: purchaseForm.remark,
      fruits: [...purchaseForm.fruits],
      contact: purchaseForm.contact,
      phone: purchaseForm.phone
    }
  })

  ElMessage.success('采购单提交成功！')
  handleReset()
}

const handleReset = () => {
  purchaseForm.supplier = ''
  purchaseForm.date = ''
  purchaseForm.remark = ''
  purchaseForm.fruits = []
  purchaseForm.contact = ''
  purchaseForm.phone = ''
  ElMessage.info('已重置表单')
}

const showHistory = () => {
  dialogVisible.value = true
  currentPage.value = 1
}

const deleteRecord = (index) => {
  ElMessageBox.confirm('确定要删除这条采购记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    purchaseHistory.value.splice(index, 1)
    if (paginatedData.value.length === 0 && currentPage.value > 1) {
      currentPage.value--
    }
    ElMessage.success('删除成功')
  }).catch(() => {
    ElMessage.info('已取消')
  })
}

const clearHistory = () => {
  ElMessageBox.confirm('确定要清空所有采购记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    purchaseHistory.value = []
    currentPage.value = 1
    ElMessage.success('已清空所有记录')
  }).catch(() => {
    ElMessage.info('已取消')
  })
}

const goBack = () => {
  router.back()
}

const goToInventory = () => {
  router.push('/business/inventory')
}

const handleSearch = () => {
  if (!searchKeyword.value.trim()) {
    searchResults.value = []
    hasSearched.value = false
    return
  }

  const keyword = searchKeyword.value.toLowerCase().trim()
  const allFruits = [
    { id: 1, emoji: '🍎', name: '红富士苹果', category: '温带水果', price: 12.8, stock: 85, origin: '山东烟台' },
    { id: 2, emoji: '🍌', name: '进口香蕉', category: '热带水果', price: 8.5, stock: 62, origin: '菲律宾' },
    { id: 3, emoji: '🍑', name: '水蜜桃', category: '温带水果', price: 18.9, stock: 23, origin: '浙江奉化' },
    { id: 4, emoji: '🍉', name: '麒麟西瓜', category: '温带水果', price: 6.8, stock: 45, origin: '江苏东台' },
    { id: 5, emoji: '🍇', name: '巨峰葡萄', category: '浆果类', price: 15.6, stock: 8, origin: '新疆吐鲁番' },
    { id: 6, emoji: '🍊', name: '砂糖橘', category: '柑橘类', price: 9.9, stock: 92, origin: '广西桂林' },
    { id: 7, emoji: '🍓', name: '奶油草莓', category: '浆果类', price: 28.8, stock: 15, origin: '辽宁丹东' },
    { id: 8, emoji: '🍍', name: '金钻凤梨', category: '热带水果', price: 16.5, stock: 38, origin: '海南三亚' }
  ]

  searchResults.value = allFruits.filter(fruit =>
    fruit.name.toLowerCase().includes(keyword) ||
    fruit.category.toLowerCase().includes(keyword) ||
    fruit.origin.toLowerCase().includes(keyword)
  )

  hasSearched.value = true

  if (searchResults.value.length === 0) {
    ElMessage.info('未找到相关水果')
  } else {
    ElMessage.success(`找到 ${searchResults.value.length} 种水果`)
  }
}

const getCategoryType = (category) => {
  const types = {
    '热带水果': 'warning',
    '温带水果': 'success',
    '浆果类': 'danger',
    '柑橘类': 'primary'
  }
  return types[category] || ''
}

const getStockColor = (stock) => {
  if (stock < 20) return '#f56c6c'
  if (stock < 50) return '#e6a23c'
  return '#67c23a'
}

onMounted(() => {
  if (route.query.msg) {
    ElMessage.success(`收到消息：${route.query.msg}`)
  }
})
</script>

<style scoped lang="scss">
.purchase-container {
  min-height: calc(100vh - 100px);
  background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
  padding: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  .back-btn, .inventory-btn {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .page-title {
    font-size: 24px;
    color: #333;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;

    .title-icon {
      font-size: 28px;
    }
  }
}

.search-card {
  margin-bottom: 20px;
  border-radius: 12px;
  border: none;

  .search-section {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;

    .search-input {
      flex: 1;
    }

    .search-btn {
      min-width: 120px;
      height: 40px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
  }

  .search-results {
    .result-item {
      margin-bottom: 16px;
      border-radius: 8px;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      }

      .fruit-info {
        display: flex;
        gap: 12px;

        .fruit-emoji {
          font-size: 40px;
          line-height: 1;
        }

        .fruit-details {
          flex: 1;

          .fruit-name {
            font-size: 16px;
            font-weight: bold;
            color: #333;
            margin-bottom: 8px;
          }

          .fruit-meta {
            display: flex;
            gap: 8px;
            margin-bottom: 8px;
            flex-wrap: wrap;

            .meta-item {
              font-size: 12px;

              &.price {
                color: #f56c6c;
                font-weight: bold;
              }
            }
          }

          .stock-info {
            margin-bottom: 6px;

            .stock-text {
              display: block;
              margin-top: 4px;
              font-size: 12px;
              color: #666;
            }
          }

          .origin {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 12px;
            color: #999;
          }
        }
      }
    }
  }
}

.purchase-tips {
  margin-bottom: 20px;
}

.content-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

.form-card {
  border-radius: 12px;
  border: none;

  .card-header {
    display: flex;
    align-items: center;
    gap: 10px;

    .header-icon {
      font-size: 24px;
    }

    .card-title {
      font-size: 18px;
      font-weight: bold;
      color: #333;
    }
  }

  .purchase-form {
    :deep(.el-divider__text) {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: bold;
      color: #666;
    }
  }
}

.button-group {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  width: 100%;

  .action-btn {
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-weight: 500;

    &.submit-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
    }

    &.reset-btn {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      border: none;
      color: #fff;
    }

    &.history-btn {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      border: none;
      color: #fff;
    }
  }
}

.history-content {
  max-height: 500px;
  overflow-y: auto;
  padding-right: 10px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #dcdfe6;
    border-radius: 3px;
  }
}

.timeline-card {
  border-radius: 8px;
  position: relative;

  .card-header-actions {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10;
  }
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .button-group {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    gap: 15px;
  }

  .search-section {
    flex-direction: column;

    .search-btn {
      width: 100%;
    }
  }
}
</style>


