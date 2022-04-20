<template>
<div>
   <transition name="slide-up">
    <div
      class="menu-wrapper"
      :class="{ 'hide-box-shadow':!menuVisible || settingVisible >=0 }"
      v-show="menuVisible"
    >
      <div class="icon-wrapper">
        <span class="icon-menu icon" @click="showSetting(3)"></span>
      </div>
      <div class="icon-wrapper">
        <span class="icon-progress icon" @click="showSetting(2)"></span>
      </div>
      <div class="icon-wrapper">
        <span class="icon-bright icon" @click="showSetting(1)"></span>
      </div>
      <div class="icon-wrapper">
        <span class="icon-A icon" @click="showSetting(0)"></span>
      </div>
    </div>
  </transition>
  <EbookSettingFont />
  <EbookSettingFontPopup />
  <EbookSettingTheme />
  <EbookSettingProgress />
  <EbookSlide />
</div>
 
  
</template>

<script>
import EbookSettingTheme from '@/components/ebook/EbookSettingTheme'
import EbookSettingFontPopup from '@/components/ebook/EbookSettingFontPopup'
import EbookSettingFont from '@/components/ebook/EbookSettingFont.vue'
import EbookSettingProgress from '@/components/ebook/EbookSettingProgress'
import EbookSlide from '@/components/ebook/EbookSlide'
import { ebookMixin } from "@/utils/mixin";

export default {
  name: "EbookMenu",
  mixins: [ebookMixin],
  methods: {
      showSetting(key){
          this.$store.dispatch('setSettingVisible',key);
      }
  },
  components: {
    EbookSettingFont,
    EbookSettingFontPopup,
    EbookSettingTheme,
    EbookSettingProgress,
    EbookSlide
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/global';
.menu-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 152;
  display: flex;
  width: 100%;
  height: px2rem(48);
  background: white;
  box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
  font-size: px2rem(20);
  &.hide-box-shadow {
    box-shadow: none;
  }
  .icon-wrapper {
    flex: 1;
    @include center;
    .icon-progress {
      font-size: px2rem(24);
    }
    .icon-bright {
      font-size: px2rem(22);
    }
  }
}
</style>