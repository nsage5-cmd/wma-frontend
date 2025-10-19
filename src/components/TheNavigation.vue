<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <img
          src=".//../assets/locked-chest_39032.png"
          alt="logo"
          width="30"
          height="30"
        />
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Домашняя</router-link>
          </li>

          <li v-if="sessionData?.logged" class="nav-item">
            <router-link class="nav-link" to="/items/create">
              Добавление товара
            </router-link>
          </li>
          <li v-if="sessionData?.logged === false" class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Авторизация
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li>
                <router-link class="dropdown-item" to="/login">
                  Вход
                </router-link>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <router-link class="dropdown-item" to="/signup">
                  Регистрация
                </router-link>
              </li>
            </ul>
          </li>
        </ul>
        <div class="nav-items" v-if="logged">
          <span class="user-info me-3">Привет, {{ username }}!</span>
          <LogoutButton />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useSessionDataStore } from '@/stores/SessionData'
import LogoutButton from './LogoutButton.vue'
import { storeToRefs } from 'pinia'

const sessionData = useSessionDataStore()
const { username, logged } = storeToRefs(sessionData)
</script>

<style></style>
