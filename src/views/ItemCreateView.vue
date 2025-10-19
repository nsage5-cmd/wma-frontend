<template>
  <div class="container">
    <div class="row">
      <!-- Боковая панель для сообщений -->
      <div class="col-md-3">
        <div class="sticky-sidebar">
          <!-- Сообщение об авторизации -->
          <div v-if="!isAuthenticated" class="alert alert-warning">
            <strong>Внимание!</strong>
            Вы не авторизованы.
            <a href="/login" class="alert-link">Войдите в систему</a>
            чтобы добавить товар.
          </div>

          <!-- сообщение о статусе авторизации -->
          <div v-if="isAuthenticated" class="alert alert-success">
            ✅ Вы авторизованы и можете добавлять товары
          </div>

          <!-- Сообщения об ошибках/успехе операции -->
          <div
            v-if="message"
            :class="[
              'alert',
              messageType === 'success' ? 'alert-success' : 'alert-danger'
            ]"
          >
            <div class="d-flex align-items-center">
              <span v-if="messageType === 'success'" class="me-2">✅</span>
              <span v-else class="me-2">❌</span>
              <span>{{ message }}</span>
            </div>
          </div>

          <!-- Информация о заполнении -->
          <div class="card">
            <div class="card-body">
              <h6 class="card-title">💡 Подсказки</h6>
              <ul class="small ps-3 mb-0">
                <li>Заполните все обязательные поля</li>
                <li>Проверьте правильность цен</li>
                <li>Срок годности можно отключить</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Основная форма -->
      <div class="col-md-9">
        <div class="card">
          <form
            class="card-body cardbody-color p-sm-5"
            v-on:submit.prevent="submitForm()"
          >
            <h2 class="text-center mb-4">Добавление товара</h2>

            <div class="row">
              <div class="col-sm-6 mb-3">
                <label for="name" class="form-label">Название товара</label>
                <input
                  type="text"
                  class="form-control"
                  id="firstname"
                  placeholder="Название"
                  v-model="item.name"
                />
              </div>
              <div class="col-sm-6 mb-3">
                <label for="checkname" class="form-label">
                  Название товара в чеке
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="checkname"
                  placeholder="Название в чеке"
                  v-model="item.checkName"
                />
              </div>
            </div>

            <div class="row">
              <div class="col-sm-6 mb-3">
                <label for="stock-keeping-unit" class="form-label">
                  Артикул
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="stock-keeping-unit"
                  placeholder="Артикул"
                  v-model="item.vendorCode"
                />
              </div>
              <div class="col-sm-6 mb-3">
                <label for="category" class="form-label">Категория</label>
                <input
                  type="text"
                  class="form-control"
                  id="category"
                  placeholder="Категория"
                  v-model="item.category"
                />
              </div>
            </div>

            <div class="row">
              <div class="col-sm-6 mb-3">
                <label for="amount" class="form-label">Количество</label>
                <input
                  type="number"
                  class="form-control"
                  id="amount"
                  min="0"
                  placeholder="Введите количество"
                  v-model="item.quantity"
                />
              </div>
              <div class="col-sm-6 mb-3">
                <label for="select-unit" class="form-label">
                  Единицы измерения
                </label>
                <select
                  class="form-select"
                  id="select-units"
                  v-model="item.quantityType"
                >
                  <option value="g">Граммы</option>
                  <option value="kg">Килограммы</option>
                  <option value="pcs">Штуки</option>
                  <option value="l">Литры</option>
                  <option value="m">Метры</option>
                  <option value="m2">Квадратные метры</option>
                  <option value="set">Комплекты</option>
                </select>
              </div>
            </div>

            <div class="form-check form-switch mb-3">
              <input
                class="form-check-input"
                type="checkbox"
                name="expiration-date"
                id="expiration-date"
                v-model="expDateIsShown"
              />
              <label class="form-check-label" for="expiration-date">
                Срок годности
              </label>
            </div>

            <div v-show="expDateIsShown" class="row">
              <div class="col-sm-6 mb-3">
                <label for="production-date" class="form-label">
                  Дата изготовления
                </label>
                <input
                  type="date"
                  class="form-control"
                  id="production-date"
                  v-model="item.prodDate"
                />
              </div>
              <div class="col-sm-6 mb-3">
                <label for="best-before-date" class="form-label">
                  Годен до
                </label>
                <input
                  type="date"
                  class="form-control"
                  id="best-before-date"
                  v-model="item.expDate"
                />
              </div>
            </div>

            <div class="row">
              <div class="col-sm-6 mb-3">
                <label for="sell-price" class="form-label">Цена продажи</label>
                <div class="input-group">
                  <input
                    type="number"
                    class="form-control"
                    id="sell-price"
                    min="0"
                    step="0.01"
                    placeholder="Цена продажи"
                    v-model="item.sellPrice"
                  />
                  <span class="input-group-text">₽</span>
                </div>
              </div>
              <div class="col-sm-6 mb-3">
                <label for="purchase-price" class="form-label">
                  Цена закупки
                </label>
                <div class="input-group">
                  <input
                    type="number"
                    class="form-control"
                    id="purchase-price"
                    min="0"
                    step="0.01"
                    placeholder="Цена закупки"
                    v-model="item.purchasePrice"
                  />
                  <span class="input-group-text">₽</span>
                </div>
              </div>
            </div>

            <div class="text-center mt-4">
              <button
                type="submit"
                class="btn btn-color px-5 w-50"
                :disabled="loading || !isAuthenticated"
              >
                <span
                  v-if="loading"
                  class="spinner-border spinner-border-sm me-2"
                ></span>
                <span>{{ loading ? 'Добавление...' : 'Добавить товар' }}</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Отладочная информация -->
        <div v-if="debugInfo" class="mt-3">
          <details>
            <summary class="text-muted">Отладочная информация</summary>
            <pre class="bg-light p-3 mt-2 small">{{ debugInfo }}</pre>
          </details>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import ItemsService from '@/services/ItemsService'
import { useSessionDataStore } from '@/stores/SessionData'

const expDateIsShown = ref(true)
const loading = ref(false)
const message = ref('')
const messageType = ref('')
const isAuthenticated = useSessionDataStore().logged
const debugInfo = ref('')

const item = ref({
  name: '',
  checkName: '',
  vendorCode: '',
  category: '',
  quantity: '',
  quantityType: 'pcs',
  prodDate: '',
  expDate: '',
  sellPrice: '',
  purchasePrice: ''
})

onMounted(() => {
  setDefaultDates()
})

function setDefaultDates() {
  const today = new Date().toISOString().split('T')[0]
  const nextYear = new Date()
  nextYear.setFullYear(nextYear.getFullYear() + 1)
  const nextYearFormatted = nextYear.toISOString().split('T')[0]

  item.value.prodDate = today
  item.value.expDate = nextYearFormatted
}

async function submitForm() {
  if (!isAuthenticated.valueOf) {
    message.value = 'Вы не авторизованы'
    messageType.value = 'error'
    return
  }

  loading.value = true
  message.value = ''
  messageType.value = ''
  debugInfo.value = ''

  try {
    const requestData = {
      name: item.value.name,
      checkName: item.value.checkName,
      vendorCode: item.value.vendorCode,
      category: item.value.category,
      quantity: parseInt(item.value.quantity) || 0,
      quantityType: item.value.quantityType,
      prodDate: item.value.prodDate,
      expDate: item.value.expDate,
      sellPrice: parseFloat(item.value.sellPrice) || 0,
      purchasePrice: parseFloat(item.value.purchasePrice) || 0
    }

    console.log('Sending item data:', requestData)
    console.log('Current cookies:', document.cookie)

    const data = await ItemsService.createItem(requestData)

    console.log('📥 Full response:', data)

    debugInfo.value = JSON.stringify(data, null, 2)

    if (data.success) {
      message.value = 'Товар успешно добавлен!'
      messageType.value = 'success'
      resetForm()
    } else {
      message.value = data.message || 'Ошибка при добавлении товара'
      messageType.value = 'error'
    }
  } catch (error) {
    console.error('Request failed:', error)
    message.value = 'Ошибка сети: ' + error.message
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

function resetForm() {
  setDefaultDates()
  item.value.name = ''
  item.value.checkName = ''
  item.value.vendorCode = ''
  item.value.category = ''
  item.value.quantity = ''
  item.value.quantityType = 'pcs'
  item.value.sellPrice = ''
  item.value.purchasePrice = ''
}
</script>

<style scoped>
#stock-keeping-unit {
  text-transform: uppercase;
}

.btn-color {
  background-color: #0e1c36;
  color: #fff;
}

.cardbody-color {
  background-color: #ebf2fa;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.alert {
  border-radius: 0.375rem;
  margin-bottom: 1rem;
}

.alert-success {
  background-color: #d1e7dd;
  color: #0f5132;
  border: 1px solid #badbcc;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.alert-warning {
  background-color: #fff3cd;
  color: #664d03;
  border: 1px solid #ffecb5;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.sticky-sidebar {
  position: sticky;
  top: 20px;
  z-index: 1020;
}

.card {
  min-height: auto;
}

.form-label {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.container {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
</style>
