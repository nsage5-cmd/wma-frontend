import { defineStore } from 'pinia'

export const useSessionDataStore = defineStore('sessionData', {
  state: () => ({
    userId: null,
    username: null,
    email: null,
    logged: false
  }),
  actions: {
    writeData(data) {
      if (!data) {
        console.warn('Нет данных для аутентификации')
        this.clearData()
        return
      }

      this.logged = Boolean(data.isAuthenticated)

      if (data.isAuthenticated && data.user) {
        this.userId = data.user.id || null
        this.username = data.user.username || null
        this.email = data.user.email || null
      } else {
        this.userId = null
        this.username = null
        this.email = null
      }

      console.log('Состояние сессии:', this.$state)
    },

    clearData() {
      this.userId = null
      this.username = null
      this.email = null
      this.logged = false
    }
  }
})
