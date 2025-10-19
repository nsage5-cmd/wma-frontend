<template>
  <div class="container">
    <div class="row">
      <div class="col-md-4 offset-md-4">
        <h2 class="text-center text-dark mt-5 text-uppercase">
          Добро пожаловать!
        </h2>
        <h3 v-if="logged">{{ username }} {{ userId }}</h3>
        <div class="card bg-light my-5">
          <div class="card-body cardbody-color p-lg-5">
            <div class="col md-6">
              <div class="text-center mb-1">
                <router-link
                  class="link-text fs-4 text-dark fw-bold text-decoration-none"
                  to="/login"
                >
                  Войти в систему
                </router-link>
              </div>
            </div>
            <div class="col md-6">
              <div class="text-center mb-1 mt-5">
                <router-link class="link-text text-dark fw-bold" to="/signup">
                  Создать учетную запись
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSessionDataStore } from '@/stores/SessionData'
import { onMounted, toRefs } from 'vue'
import { useRouter } from 'vue-router'

const sessionData = useSessionDataStore()
const { logged, username, userId } = toRefs(sessionData)
const router = useRouter()

onMounted(async () => {
  if (logged.value) {
    router.push('/items')
  }
})
</script>

<style scoped>
.link-text:hover {
  color: rgb(63, 63, 63);
  opacity: 0.7;
}
</style>
