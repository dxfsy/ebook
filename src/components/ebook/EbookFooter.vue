<template>
  <div class="ebook-footer">
    <div class="ebook-footer-page">{{this.progress}}%</div>
  </div>
</template>

<script>
import {ebookMixin} from '@/utils/mixin';
export default {
  name: "EbookFooter",
  mixins: [ebookMixin],
};
</script>

<style lang='scss' scoped>
@import "@/assets/styles/global";
.ebook-footer {
  position: absolute;
  bottom: px2rem(10);
  right: px2rem(10);
  font-size: px2rem(12);
}
</style>