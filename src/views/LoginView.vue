<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <h2 class="text-center text-dark mt-5 text-uppercase">
          Вход в систему
        </h2>
        <h3 v-if="loginError">Неправильный логин или пароль</h3>
        <div class="card my-5">
          <form
            class="card-body cardbody-color p-lg-5"
            v-on:submit.prevent="submitForm()"
          >
            <div class="text-center"></div>

            <div class="mb-3">
              <input
                type="email"
                autocomplete="email"
                class="form-control"
                id="Email"
                aria-describedby="emailHelp"
                placeholder="Электронная почта"
                v-model="user.email"
              />
            </div>
            <div class="mb-3">
              <input
                type="password"
                class="form-control"
                id="password"
                placeholder="Пароль"
                v-model="user.password"
              />
            </div>
            <div class="text-center">
              <button type="submit" class="btn btn-color px-5 mt-3 mb-5 w-50">
                Войти
              </button>
            </div>
            <div class="form-text text-center mb-1 text-dark">
              У Вас нет учетной записи?
              <router-link class="text-dark fw-bold" to="/signup">
                Зарегистрироваться
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSessionDataStore } from '@/stores/SessionData'
import authService from '@/services/AuthService'

const router = useRouter()
const user = ref({
  email: '',
  password: ''
})
const sessionData = useSessionDataStore()
const loginError = ref(false)
const loginErrorMessage = ref('')
const loading = ref(false)

async function submitForm() {
  loginError.value = false
  loginErrorMessage.value = ''
  loading.value = true

  try {
    const result = await authService.login(user.value)

    if (result.success) {
      console.log(result)
      const authState = authService.getAuthState()
      sessionData.writeData(authState)
      router.push('/')
    } else {
      loginError.value = true
      loginErrorMessage.value = result.error || 'Wrong password or email'
    }
  } catch (error) {
    console.error('Login error:', error)
    loginError.value = true
    loginErrorMessage.value = 'network error'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.btn-color {
  background-color: #0e1c36;
  color: #fff;
}

.cardbody-color {
  background-color: #ebf2fa;
}
</style>
