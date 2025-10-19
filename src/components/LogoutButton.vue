<template>
  <button @click="handleLogout" class="logout-btn" :disabled="loading">
    <span v-if="loading">Выход...</span>
    <span v-else>Выйти</span>
  </button>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import authService from '@/services/AuthService'
import { useSessionDataStore } from '@/stores/SessionData'

const sessionData = useSessionDataStore()
const router = useRouter()
const loading = ref(false)

const handleLogout = async () => {
  loading.value = true

  try {
    await authService.logout()
    router.push('/login')
    sessionData.logged = authService.isAuthenticated
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.logout-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.logout-btn:hover:not(:disabled) {
  background-color: #c82333;
}

.logout-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
