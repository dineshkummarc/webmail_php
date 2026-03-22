<template>
  <q-layout view="hHh LpR lfr">
    <q-page-container style="height: 100vh">
      <q-page class="flex flex-center">
        <slot />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'LoginLayout',
}
</script>

<style lang="scss" scoped>
</style>
