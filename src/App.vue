<template>
  <div id="app">
    <span class="text">ABCDEEFG</span>
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
.text {
  font-family: "Days One";
  color: orange;
  font-size: px2rem(20);
}
</style>
