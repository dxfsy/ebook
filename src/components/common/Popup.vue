<template>
  <div class="popup" v-if="PopupVisible">
    <transition name="fade">
      <div
        class="popup-bg"
        @click.stop.prevent="hide"
        v-if="PopupVisible"
      ></div>
    </transition>
    <transition name="popup-slide-up">
      <div class="popup-wrapper" v-if="visible">
        <div class="popup-title" v-if="title && title.length > 0">
          {{ title }}
        </div>
        <div
          class="popup-btn"
          :class="{ danger: item.type === 'danger' }"
          v-for="(item, index) in btn"
          :key="index"
          @click="item.click"
        >
          {{ item.text }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "popup",
  props: {
    title: String,
    btn: Array,
  },
  data() {
    return {
      PopupVisible: false,
      visible: false,
    };
  },
  methods: {
    show() {
      this.PopupVisible = true;
      setTimeout(() => {
        this.visible = true;
      });
    },
    hide() {
      this.visible = false;
      setTimeout(() => {
        this.PopupVisible = false;
      },200);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global";
.popup {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 2000;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  .popup-bg {
    width: 100%;
    height: 100%;
  }
  .popup-wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 2000;
    width: 100%;
    background-color: #fff;
    .popup-title {
      width: 100%;
      height: px2rem(44);
      border-bottom: px2rem(1) solid #eee;
      padding: px2rem(15);
      line-height: px2rem(14);
      font-size: px2rem(12);
      color: #999;
      box-sizing: border-box;
      @include center;
    }
    .popup-btn {
      width: 100%;
      height: px2rem(60);
      border-bottom: px2rem(1) solid #eee;
      font-size: px2rem(16);
      font-weight: bold;
      box-shadow: border-box;
      @include center;
      &.danger {
        color: $color-pink;
      }
    }
  }
}
</style>