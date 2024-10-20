<script setup lang="ts">
useScript('https://telegram.org/js/telegram-web-app.js', {
  bundle: true,
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator />
  <NuxtPage />
</template>
