<template>
  <div class="" v-for="error of validationObj.$errors" v-bind:key="error.id">
    <div class="alert alert-secondary">{{ error.$message }}</div>
  </div>
</template>

<script setup>
defineProps(['validationObj'])
</script>
