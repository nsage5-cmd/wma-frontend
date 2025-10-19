<template>
  <header>
    <TheNavigation></TheNavigation>
  </header>

  <router-view></router-view>
</template>

<script>
import TheNavigation from './components/TheNavigation.vue'
// import authService from '@/services/AuthService'
// import { useSessionDataStore } from './stores/SessionData'

export default {
  components: { TheNavigation }
  // async created() {
  //   const authState = await authService.waitForInit()
  //   console.log('Auth state:', authState.isAuthenticated)
  //   const sessionStore = useSessionDataStore()
  //   sessionStore.writeData(authState)
  // }
}
</script>
