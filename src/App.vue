<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
// 引入rem
document.addEventListener("DOMContentLoaded", () => {
  const html = document.querySelector("html");
  let fontSize = window.innerWidth / 10;
  fontSize = fontSize > 50 ? 50 : fontSize;
  html.style.fontSize = fontSize + 'px';
});
export default {};

</script>

<style lang="scss">
@import '@/assets/styles/global.scss';
#app {
  width: 100%;
  height:100%;
  overflow: hidden;
}
html {
  background-color: gray;
}
</style>
