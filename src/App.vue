<template>
  <div id="app">
    <PlenaWallet msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import PlenaWallet from "./components/PlenaWallet.vue";

export default {
  name: "App",
  components: {
    PlenaWallet,
  },
};
</script>

<style>
#app {
  text-align: center;
}
</style>
