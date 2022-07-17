<template>
  <div class="shelf-list-wrapper" :style="{top: shelfListTop}">
    <transition-group name="list" tag="div" id="shelf-list">
      <div
        class="shelf-list-item-wrapper"
        v-for="item in data"
        :key="item.id"
      >
        <ShelfItem :data="item" :style="{ height: itemHeight }" />
        <div class="shelf-list-title-wrapper">
          <span class="shelf-list-title title-small">
            {{ item.title }}
          </span>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { storeShelfMixin } from "@/utils/mixin";
import ShelfItem from "@/components/shelf/ShelfItem";
import { px2rem, realPx } from "@/utils/utils";
export default {
  name: "ShelfList",
  props: {
    top:{
      type: Number,
      default: 94
    },
    data: {
      type: Array
    }
  },
  components: {
    ShelfItem,
  },
  mixins: [storeShelfMixin],
  computed: {
    itemHeight() {
      // w / 250 = h / 350
      // h = w * 350 / 250
      return ((window.innerWidth - realPx(120)) / 3 / 250) * 350 + "px";
    },
    shelfListTop(){
      return px2rem(this.top) + 'rem'
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global";
.shelf-list-wrapper {
  position: absolute;
  left: 0;
  width: 100%;
  #shelf-list {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    padding: 0 px2rem(15);
    box-sizing: border-box;
  }
  .shelf-list-item-wrapper {
    flex: 0 0 33.33%;
    width: 33.33%;
    padding: px2rem(15);
    box-sizing: border-box;
    &.list-leave-active {
      display: none;
    }
    &.list-move {
      transition: transform .5s;
    }
    .shelf-list-title-wrapper {
      margin-top: px2rem(10);
    }
  }
}
</style>