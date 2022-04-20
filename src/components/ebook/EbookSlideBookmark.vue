<template>
  <div class="ebook-slide-bookmark">
    <div class="slide-bookmark-title">
      {{ $t("book.bookmark") }}^{{ bookmark ? bookmark.length : 0 }}
    </div>
    <Scroll class="slide-bookmark-list" :top="48" :bottom="48">
      <div
        class="slide-bookmark-item"
        v-for="(item, index) in bookmark"
        :key="index"
        @click="displayBookmark(item)"
      >
        <div class="slide-bookmark-item-icon">
          <span class="icon-bookmark"></span>
        </div>
        <div class="slide-bookmark-text">{{ item.text }}</div>
      </div>
    </Scroll>
  </div>
</template>

<script>
import Scroll from "@/components/common/Scroll.vue";
import { ebookMixin } from "@/utils/mixin";
import { getBookmark } from "@/utils/localStorage";
export default {
  name: "EbookSlideBookmark",
  data() {
    return {
      bookmark: null,
    };
  },
  mixins: [ebookMixin],
  components: {
    Scroll,
  },
  methods: {
      displayBookmark(item){
          this.display(item.cfi,()=> {
              this.toggleMenu();
          })
      }
  },
  mounted() {
    this.bookmark = getBookmark(this.filename);
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global";
.ebook-slide-bookmark {
  .slide-bookmark-title {
    width: 100%;
    height: px2rem(30);
    line-height: px2rem(30);
    font-size: px2rem(12);
    padding-left: px2rem(50);
  }
  .slide-bookmark-list {
    font-size: px2rem(16);
    padding: 0 px2rem(10);
    box-sizing: border-box;
    .slide-bookmark-item {
      display: flex;
      padding: px2rem(10) px2rem(5);
      box-sizing: border-box;
      .slide-bookmark-item-icon {
        flex: 0 0 px2rem(30);
        font-size: px2rem(12);
        @include center;
        margin-right: px2rem(10);
        box-sizing: border-box;
        .icon-bookmark {
          height: px2rem(30);
          width: px2rem(30);
          border-radius: px2rem(30);
          background-color: rgb(196, 195, 195);
          @include center;
        }
      }
      .slide-bookmark-text {
        flex: 1;
        @include mutilEllipsis(3);
        font-size: px2rem(14);
        line-height: px2rem(20);
      }
    }
  }
}
</style>