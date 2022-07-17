<template>
  <div class="ebook-header">
      <div class="ebook-header-text">{{getSectionName}}</div>
  </div>
</template>

<script>
import {ebookMixin} from '@/utils/mixin';
export default {
    name:"EbookHeader",
    mixins:[ebookMixin],
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/global';
    .ebook-header {
        position: absolute;
        top: px2rem(20);
        left: px2rem(20);
        z-index: 150;
        font-size: px2rem(12);
    }
</style>