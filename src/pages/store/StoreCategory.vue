<template>
  <div class="book-shelf">
    <StoreTitle :title="shelfCategory.title"/>
    <Scroll
      class="store-shelf-scroll-wrapper"
      :top="0"
      :bottom="scrollBottom"
      @onScroll="onScroll"
      ref="scroll"
      v-if="shelfCategory.itemList  && shelfCategory.itemList.length>0"
    >
      <ShelfList :top="42" :data="shelfCategory.itemList" />
    </Scroll>
    <div class="store-shelf-empty-view" v-else>
      {{$t('shelf.groupNone')}}
    </div>
    <ShelfFooter />
  </div>
</template>

<script>
import { storeShelfMixin } from "../../utils/mixin";
import StoreTitle from "@/components/shelf/ShelfTitle.vue";
import ShelfList from "@/components/shelf/ShelfList";
import Scroll from "@/components/common/Scroll.vue";
import ShelfFooter from "@/components/shelf/ShelfFooter";
export default {
  mixins: [storeShelfMixin],
  name: "StoreShelf",
  components: {
    StoreTitle,
    Scroll,
    ShelfList,
    ShelfFooter,
  },
  watch: {
    isEditMode(isEditMode) {
      this.scrollBottom = isEditMode ? 48 : 0;
      this.$nextTick(() => {
        this.$refs.scroll.refresh();
      });
    },
  },
  data() {
    return {
      scrollBottom: 0,
    };
  },
  methods: {
    onScroll(offsetY) {
      this.setOffsetY(offsetY);
    },
    // getShelfList() {
    //   let shelfList = getBookShelf()
    //   if (!shelfList) {
    //     shelf().then((res) => {
    //       if (res.status === 200 && res.data && res.data.bookList) {
    //         shelfList = AppendAddToShelf(res.data.bookList)
    //         saveBookShelf(shelfList)
    //         this.setShelfList(shelfList)
    //       }
    //     })
    //   }else {
    //     this.setShelfList(shelfList)
    //   }
    // },
  },
  mounted() {
    this.getCategoryList(this.$route.query.title);
    // 当前属于category，置2
    this.setCurrentType(2);
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/global';
.book-shelf {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: white;
  .store-shelf-scroll-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 101;
  }
  .store-shelf-empty-view{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-size: px2rem(14);
    color: #333;
    @include center;
  }
}
</style>