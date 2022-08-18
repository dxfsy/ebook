<template>
  <div class="store">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>

export default {
    name:'Store',
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/global';
.store {
    width: 100%;
    height: 100%;
    background-color: #fff;
}
</style>