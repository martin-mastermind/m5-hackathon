<script setup lang="ts">
const initData = ref('')

onMounted(() => {
  if (Telegram.WebApp) {
    initData.value = Telegram.WebApp.initData
  }
})
</script>

<template>
  <div class="centered">
    {{ initData }}
  </div>
</template>

<style scoped>
.centered {
  position: absolute;
  width: 100%;
  text-align: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Open Sans',
    'Helvetica Neue',
    sans-serif;
}

h1 {
  font-size: 32px;
}

@media (min-width: 768px) {
  h1 {
    font-size: 64px;
  }
}

a {
  color: #888;
  text-decoration: none;
  font-size: 18px;
}

a:hover {
  text-decoration: underline;
}
</style>
