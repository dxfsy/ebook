<template>
  <transition name="popup-slide-up">
    <div class="ebook-popup-list" v-show="fontFamilyVisible">
      <div class="ebook-popup-title">
        <span class="ebook-popup-title-icon" @click="hide">
          <span class="icon-down2"></span>
        </span>
        <div class="ebook-popup-title-text">{{$t('book.selectFont')}}</div>
      </div>
      <div class="ebook-popup-list-wrapper">
        <div class="ebook-popup-item" v-for="(item,index) in fontFamilyList" :key="index" @click="setFontFamily(item.font)">
          <div class="ebook-popup-item-text" :class="{'selected':isSelected(item)}">{{item.font}}</div>
          <div class="ebook-popup-item-icon" v-show="isSelected(item)">
            <span class="icon-check"></span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {saveFontFamily} from '@/utils/localStorage';
import {FONT_FAMILY} from '@/utils/book';
import { ebookMixin } from "@/utils/mixin";
export default {
  name: "EbookSettingFontPopup",
  mixins: [ebookMixin],
  data(){
    return {
      fontFamilyList:FONT_FAMILY
    }
  },
  methods: {
    hide() {
      this.$store.dispatch("setFontFamilyVisible", false);
    },
    // 判断当前字体是否被选中
    isSelected(item) {
      return item.font === this.defaultFontFamily;
    },
    //设置字体类型 
    setFontFamily(font) {
      this.$store.dispatch('setDefaultFontFamily',font);
      saveFontFamily(this.filename,this.defaultFontFamily);
      if(font==='Default') {
        this.currentBook.rendition.themes.font('Times New Roman')
      }else {
        this.currentBook.rendition.themes.font(font);
      }
      
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global";
.ebook-popup-list {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 300;
  width: 100%;
  background: white;
  box-shadow: 0 px2rem(-4) px2rem(6) rgba(0, 0, 0, 0.1);
  .ebook-popup-title {
    position: relative;
    padding: px2rem(15);
    box-sizing: border-box;
    border-bottom: 1px solid #b8b9bb;
    text-align: center;
    .ebook-popup-title-icon {
      position: absolute;
      left: px2rem(15);
      top: 0;
      height: 100%;
      @include center;
      font-size: px2rem(16);
      font-weight: bold;
    }
    .ebook-popup-title-text {
      font-size: px2rem(14);
      font-weight: bold;
    }
  }
  .ebook-popup-list-wrapper {
    .ebook-popup-item {
      display: flex;
      padding: px2rem(15);
      .ebook-popup-item-text{
        flex: 1;
        text-align: left;
        font-size: px2rem(16);
      }
      .ebook-popup-item-icon{
        flex: 1;
        text-align: right;
        font-size: px2rem(16);
        color: rgb(9, 162, 227);
        font-weight: 700;
      }
    }
  }
}
// 字体被选中的高亮 
.selected {
  color: rgb(9, 162, 227);
  font-weight: 700;
}
</style>