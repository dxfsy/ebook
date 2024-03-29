<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 2">
      <div class="setting-progress">
        <div class="read-time-wrapper">
          <span class="read-time-text">{{getReadTimeText()}}</span>
          <span class="icon-forward"></span>
        </div>
        <div class="progress-wrapper">
          <div class="progress-icon-wrapper" @click="prevSection">
            <div class="icon-back"></div>
          </div>
          <input
            class="progress"
            type="range"
            max="100"
            min="0"
            step="1"
            @change="onProgressChange($event.target.value)"
            @input="onProgressInput($event.target.value)"
            :value="progress"
            :disabled="!bookAvailable"
            ref="progress"
          />
          <div class="progress-icon-wrapper" @click="nextSection">
            <div class="icon-forward"></div>
          </div>
        </div>
        <div class="text-wrapper">
          <span class="progress-chapter-text">{{getSectionName}}</span>
          <span>({{ bookAvailable ? progress + "%" : "加载中..." }})</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ebookMixin } from "@/utils/mixin";

export default {
  name: "EbookSettingProgress",
  mixins: [ebookMixin],
  methods: {
    // 进度条改变
    onProgressChange(progress) {
      this.$store.dispatch("setProgress", progress).then(() => {
        this.displayProgress();
      });
      this.updateProgressbg();
    },
    // 拖动进度条
    onProgressInput(progress) {
      this.$store.dispatch("setProgress", progress);
      this.updateProgressbg();
    },
    // 显示进度条
    displayProgress() {
      const cfi = this.currentBook.locations.cfiFromPercentage(
        this.progress / 100
      );
      this.display(cfi);
    },
    // 更新进度条背景
    updateProgressbg() {
      this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`;
    },
    // 上一章
    prevSection() {
      if (this.section > 0 && this.bookAvailable) {
        this.$store.dispatch("setSection", this.section - 1).then(() => {
          this.displaySection(this.section);
          
        });
      }
    },
    // 下一章
    nextSection() {
      if (this.section < this.currentBook.spine.length - 1) {
        this.$store.dispatch("setSection", this.section + 1).then(() => {
          this.displaySection(this.section);
        });
      }
    },
    // 将对应章节渲染到页面上
    displaySection(section) {
      const sectionInfo = this.currentBook.section(section);
      if (sectionInfo && sectionInfo.href) {
        this.display(sectionInfo.href)
      }
    },
  },
  updated() {
    this.updateProgressbg();
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global";
.setting-wrapper {
  position: absolute;
  bottom: px2rem(48);
  left: 0;
  z-index: 151;
  width: 100%;
  height: px2rem(90);
  background: white;
  box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);

  .setting-progress {
    position: relative;
    width: 100%;
    height: 100%;
    .read-time-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: px2rem(40);
      font-size: px2rem(14);
      @include center;
    }
    .progress-wrapper {
      width: 100%;
      height: 100%;
      @include center;
      padding: 0 px2rem(15);
      box-sizing: border-box;
      .progress-icon-wrapper {
        font-size: px2rem(20);
      }
      .progress {
        width: 100%;
        -webkit-appearance: none;
        height: px2rem(2);
        // background: -webkit-linear-gradient(#999, #999) no-repeat, #ddd;
        // background-size: 0 100% !important;
        margin: 0 px2rem(10);
        &:focus {
          outline: none;
        }
        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: px2rem(20);
          width: px2rem(20);
          border-radius: 50%;
          background: white;
          box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.15);
          border: px2rem(1) solid #ddd;
        }
      }
    }
    .text-wrapper {
      position: absolute;
      left: 0;
      bottom: px2rem(10);
      width: 100%;
      color: #333;
      font-size: px2rem(12);
      // text-align: center;
      @include center;
      padding: 0 px2rem(15);
      box-sizing: border-box;
      .progress-chapter-text {
        @include Ellipsis;
      }
    }
  }
}
</style>