<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1 class="h3 mb-0">📦 Мои товары</h1>
          <div>
            <button
              @click="refreshItems"
              class="btn btn-outline-primary me-2"
              :disabled="loading"
            >
              <span
                v-if="loading"
                class="spinner-border spinner-border-sm"
              ></span>
              🔄 Обновить
            </button>
            <router-link to="/items/create" class="btn btn-primary">
              ➕ Добавить товар
            </router-link>
          </div>
        </div>

        <!-- Статус сообщения -->
        <div
          v-if="message"
          :class="[
            'alert',
            messageType === 'success' ? 'alert-success' : 'alert-danger'
          ]"
        >
          {{ message }}
        </div>

        <!-- Голосовой поиск -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="row g-3 align-items-end">
              <div class="col-md-10">
                <label class="form-label">Поиск товаров</label>
                <div class="input-group">
                  <div class="input-group-text p-0">
                    <SpeechToTextRecog
                      @start-speech-recog="receiveSpeechToTextEmit"
                    />
                  </div>
                  <input
                    v-model="searchQuery"
                    type="text"
                    class="form-control"
                    placeholder="Название товара или нажмите на микрофон для голосового поиска..."
                    @keyup.enter="performSearch"
                  />
                  <button
                    @click="performSearch"
                    class="btn btn-outline-primary"
                    :disabled="loading"
                  >
                    <span
                      v-if="loading"
                      class="spinner-border spinner-border-sm"
                    ></span>
                    🔍 Поиск
                  </button>
                </div>
              </div>
              <div class="col-md-2">
                <button
                  @click="clearSearch"
                  class="btn btn-outline-secondary w-100"
                  :disabled="loading"
                >
                  ❌ Сбросить
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Загрузка -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Загрузка...</span>
          </div>
          <p class="mt-2 text-muted">Загружаем ваши товары...</p>
        </div>

        <!-- Нет товаров -->
        <div v-else-if="items.length === 0" class="text-center py-5">
          <div class="empty-state">
            <i class="bi bi-inbox display-1 text-muted"></i>
            <h3 class="mt-3" v-if="hasActiveSearch">Товары не найдены</h3>
            <h3 class="mt-3" v-else>Товаров пока нет</h3>
            <p class="text-muted" v-if="hasActiveSearch">
              Попробуйте изменить параметры поиска
            </p>
            <p class="text-muted" v-else>
              Начните добавлять свои первые товары
            </p>
            <button
              @click="clearSearch"
              class="btn btn-outline-secondary me-2"
              v-if="hasActiveSearch"
            >
              Показать все товары
            </button>
            <router-link to="/items/create" class="btn btn-primary btn-lg">
              ➕ Добавить товар
            </router-link>
          </div>
        </div>

        <!-- Сетка товаров -->
        <div v-else>
          <div class="row mb-3">
            <div class="col-12">
              <div class="d-flex justify-content-between align-items-center">
                <p class="text-muted mb-0">
                  Найдено товаров:
                  <strong>{{ filteredItems.length }}</strong>
                  <span v-if="hasActiveSearch" class="ms-2 text-primary">
                    <i class="bi bi-mic"></i>
                    По запросу: "{{ searchQuery }}"
                  </span>
                </p>
                <div class="d-flex gap-2">
                  <select
                    v-model="itemsPerPage"
                    class="form-select form-select-sm"
                    style="width: auto"
                    @change="currentPage = 1"
                  >
                    <option value="12">12 на странице</option>
                    <option value="24">24 на странице</option>
                    <option value="48">48 на странице</option>
                    <option value="96">96 на странице</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Карточки товаров -->
          <div class="row">
            <div
              v-for="item in paginatedItems"
              :key="item.id"
              class="col-xl-4 col-lg-6 col-md-6 mb-4"
            >
              <div class="card h-100 item-card">
                <div
                  class="card-header d-flex justify-content-between align-items-center"
                >
                  <h5 class="card-title mb-0 text-truncate">{{ item.name }}</h5>
                  <span
                    class="badge"
                    :class="getCategoryBadgeClass(item.category)"
                  >
                    {{ item.category }}
                  </span>
                </div>

                <div class="card-body">
                  <div class="mb-3">
                    <small class="text-muted">Артикул:</small>
                    <p class="mb-1 fw-bold">{{ item.vendorCode }}</p>

                    <small class="text-muted">Название в чеке:</small>
                    <p class="mb-2 text-truncate">{{ item.checkName }}</p>
                  </div>

                  <div class="row g-2 mb-3">
                    <div class="col-6">
                      <small class="text-muted">Количество:</small>
                      <p class="mb-0 fw-bold">
                        {{ item.quantity }}
                        {{ getQuantityTypeText(item.quantityType) }}
                      </p>
                    </div>
                    <div class="col-6">
                      <small class="text-muted">Цена продажи:</small>
                      <p class="mb-0 fw-bold text-success">
                        {{ formatPrice(item.sellPrice) }} ₽
                      </p>
                    </div>
                  </div>

                  <div v-if="item.prodDate || item.expDate" class="mb-3">
                    <small class="text-muted">Срок годности:</small>
                    <div class="small">
                      <div v-if="item.prodDate">
                        <span class="text-muted">Произведено:</span>
                        {{ formatDate(item.prodDate) }}
                      </div>
                      <div v-if="item.expDate">
                        <span class="text-muted me-1">Годно до:</span>
                        <span
                          :class="{ 'text-danger': isExpired(item.expDate) }"
                        >
                          {{ formatDate(item.expDate) }}
                          <span
                            v-if="isExpired(item.expDate)"
                            class="badge bg-danger ms-1"
                          >
                            Просрочено
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="profit-info">
                    <small class="text-muted">Закупочная цена:</small>
                    <p class="mb-1">{{ formatPrice(item.purchasePrice) }} ₽</p>

                    <small class="text-muted">Прибыль с единицы:</small>
                    <p
                      class="mb-0 fw-bold"
                      :class="
                        getProfitClass(item.sellPrice - item.purchasePrice)
                      "
                    >
                      {{ formatPrice(item.sellPrice - item.purchasePrice) }} ₽
                    </p>
                  </div>
                </div>

                <div class="card-footer bg-transparent">
                  <div class="d-flex gap-2">
                    <button
                      @click="editItem(item)"
                      class="btn btn-outline-primary btn-sm flex-fill"
                    >
                      ✏️ Редактировать
                    </button>
                    <button
                      @click="deleteItem(item.id)"
                      class="btn btn-outline-danger btn-sm"
                      :disabled="deleteLoading === item.id"
                    >
                      <span
                        v-if="deleteLoading === item.id"
                        class="spinner-border spinner-border-sm"
                      ></span>
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Пагинация -->
          <div class="col-12" v-if="totalPages > 1">
            <nav>
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <button class="page-link" @click="currentPage--">‹</button>
                </li>

                <li
                  v-for="page in pages"
                  :key="page"
                  class="page-item"
                  :class="{ active: page === currentPage }"
                >
                  <button class="page-link" @click="currentPage = page">
                    {{ page }}
                  </button>
                </li>

                <li
                  class="page-item"
                  :class="{ disabled: currentPage === totalPages }"
                >
                  <button class="page-link" @click="currentPage++">›</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно редактирования -->
    <div
      v-if="editingItem"
      class="modal fade show"
      style="display: block; background: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Редактировать товар</h5>
            <button
              type="button"
              class="btn-close"
              @click="editingItem = null"
            ></button>
          </div>
          <div class="modal-body">
            <div v-if="editingItem" class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Название товара</label>
                <input
                  v-model="editingItem.name"
                  type="text"
                  class="form-control"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Название в чеке</label>
                <input
                  v-model="editingItem.checkName"
                  type="text"
                  class="form-control"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Артикул</label>
                <input
                  v-model="editingItem.vendorCode"
                  type="text"
                  class="form-control"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Категория</label>
                <input
                  v-model="editingItem.category"
                  type="text"
                  class="form-control"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Количество</label>
                <input
                  v-model.number="editingItem.quantity"
                  type="number"
                  class="form-control"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Единица измерения</label>
                <select v-model="editingItem.quantityType" class="form-select">
                  <option value="g">Граммы</option>
                  <option value="kg">Килограммы</option>
                  <option value="pcs">Штуки</option>
                  <option value="l">Литры</option>
                  <option value="m">Метры</option>
                  <option value="m2">Квадратные метры</option>
                  <option value="set">Комплекты</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Цена продажи (₽)</label>
                <input
                  v-model.number="editingItem.sellPrice"
                  type="number"
                  step="0.01"
                  class="form-control"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Цена закупки (₽)</label>
                <input
                  v-model.number="editingItem.purchasePrice"
                  type="number"
                  step="0.01"
                  class="form-control"
                />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="editingItem = null"
            >
              Отмена
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="saveItem"
              :disabled="updateLoading"
            >
              <span
                v-if="updateLoading"
                class="spinner-border spinner-border-sm"
              ></span>
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ItemsService from '@/services/ItemsService'
import SpeechToTextRecog from '@/components/SpeechToTextRecog.vue'

const items = ref([])
const loading = ref(false)
const deleteLoading = ref(null)
const updateLoading = ref(false)
const message = ref('')
const messageType = ref('')
const editingItem = ref(null)

// Поиск и пагинация
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(12)

// Получение голосового ввода
function receiveSpeechToTextEmit(value) {
  console.log('Voice input received:', value)

  if (value && value.finalTranscript) {
    searchQuery.value = value.finalTranscript.trim()
    console.log('Setting search query to:', searchQuery.value)
    performSearch()
  } else if (value && value.transcription && value.transcription.length > 0) {
    const lastTranscription =
      value.transcription[value.transcription.length - 1]
    if (lastTranscription && lastTranscription.trim()) {
      searchQuery.value = lastTranscription.trim()
      console.log('Setting search query to:', searchQuery.value)
      performSearch()
    }
  }
}

function performSearch() {
  currentPage.value = 1
}

function clearSearch() {
  searchQuery.value = ''
  currentPage.value = 1
}

// Проверка активного поиска
const hasActiveSearch = computed(() => {
  return searchQuery.value.trim() !== ''
})

// Отфильтрованные товары
const filteredItems = computed(() => {
  if (!searchQuery.value.trim()) {
    return items.value
  }

  const query = searchQuery.value.toLowerCase().trim()
  return items.value.filter(
    (item) =>
      item.name.toLowerCase().includes(query) ||
      item.checkName.toLowerCase().includes(query) ||
      item.vendorCode.toLowerCase().includes(query) ||
      (item.category && item.category.toLowerCase().includes(query))
  )
})

// Пагинация
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredItems.value.slice(start, end)
})

const totalPages = computed(() =>
  Math.ceil(filteredItems.value.length / itemsPerPage.value)
)

const pages = computed(() => {
  const pages = []
  const maxVisiblePages = 5
  let startPage = Math.max(
    1,
    currentPage.value - Math.floor(maxVisiblePages / 2)
  )
  let endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1)

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  return pages
})

const loadItems = async () => {
  loading.value = true
  message.value = ''

  try {
    const result = await ItemsService.getUserItems()

    if (result.success) {
      items.value = result.items
    } else {
      message.value = result.message
      messageType.value = 'error'
    }
  } catch (error) {
    console.error('Load items error:', error)
    message.value = 'Ошибка при загрузке товаров'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

const deleteItem = async (itemId) => {
  if (!confirm('Вы уверены, что хотите удалить этот товар?')) return

  deleteLoading.value = itemId
  message.value = ''

  try {
    const result = await ItemsService.deleteItem(itemId)

    if (result.success) {
      message.value = result.message
      messageType.value = 'success'
      items.value = items.value.filter((item) => item.id !== itemId)
    } else {
      message.value = result.message
      messageType.value = 'error'
    }
  } catch (error) {
    console.error('Delete error:', error)
    message.value = 'Ошибка при удалении товара'
    messageType.value = 'error'
  } finally {
    deleteLoading.value = null
  }
}

const editItem = (item) => {
  editingItem.value = { ...item }
}

const saveItem = async () => {
  if (!editingItem.value) return

  updateLoading.value = true
  message.value = ''

  try {
    const result = await ItemsService.updateItem(editingItem.value)

    if (result.success) {
      message.value = result.message
      messageType.value = 'success'
      const index = items.value.findIndex(
        (item) => item.id === editingItem.value.id
      )
      if (index !== -1) {
        items.value[index] = { ...editingItem.value }
      }
      editingItem.value = null
    } else {
      message.value = result.message
      messageType.value = 'error'
    }
  } catch (error) {
    console.error('Update error:', error)
    message.value = 'Ошибка при обновлении товара'
    messageType.value = 'error'
  } finally {
    updateLoading.value = false
  }
}

const refreshItems = () => {
  currentPage.value = 1
  searchQuery.value = ''
  loadItems()
}

const formatPrice = (price) => {
  return parseFloat(price).toFixed(2)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ru-RU')
}

const getQuantityTypeText = (type) => {
  const types = {
    g: 'г',
    kg: 'кг',
    pcs: 'шт',
    l: 'л',
    m: 'м',
    m2: 'м²',
    set: 'компл.'
  }
  return types[type] || type
}

const getCategoryBadgeClass = (category) => {
  const categories = {
    Электроника: 'bg-primary',
    Продукты: 'bg-success',
    Одежда: 'bg-info',
    Книги: 'bg-warning',
    Другое: 'bg-secondary'
  }
  return categories[category] || 'bg-dark'
}

const getProfitClass = (profit) => {
  return profit > 0 ? 'text-success' : profit < 0 ? 'text-danger' : 'text-muted'
}

const isExpired = (expDate) => {
  return new Date(expDate) < new Date()
}

onMounted(() => {
  loadItems()
})
</script>

<style scoped>
.item-card {
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.empty-state {
  padding: 3rem 1rem;
}

.profit-info {
  border-top: 1px solid #eee;
  padding-top: 1rem;
  margin-top: 1rem;
}

.badge {
  font-size: 0.7em;
}

.card-title {
  font-size: 1.1rem;
}

.modal {
  backdrop-filter: blur(2px);
}

.input-group-text {
  background-color: transparent;
  border-right: none;
}
</style>
