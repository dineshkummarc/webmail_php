<template>
  <main-layout>
    <h5 class="error-info">Something went wrong. Adminpanel cannot be loaded.</h5>
  </main-layout>
</template>

<script>
import MainLayout from 'src/layouts/MainLayout'

export default {
  name: 'AppNotLoaded',

  components: {
    MainLayout,
  },
}
</script>

<style lang="scss">
.error-info {
  color: #503d68;
  margin: 0 auto;
}
</style>
