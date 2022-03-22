<template>
  <print-page />
</template>

<script>
import PrintPage from './view/print'

export default {
  name: 'App',
  components: {
    PrintPage
  }
}
</script>

<style>
#app {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>
