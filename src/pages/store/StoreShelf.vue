<template>
  <div class="book-shelf">
    <StoreTitle :title="$t('shelf.title')"/>
    <Scroll
      class="store-shelf-scroll-wrapper"
      :top="0"
      :bottom="scrollBottom"
      @onScroll="onScroll"
      ref="scroll"
    >
      <ShelfSearch />
      <ShelfList :data="shelfList" />
    </Scroll>
    <ShelfFooter />
  </div>
</template>

<script>
import { storeShelfMixin } from "../../utils/mixin";
import ShelfSearch from "@/components/shelf/ShelfSearch";
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
    ShelfSearch,
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
    this.getShelfList();
    // 当前属于是书架列表，不是category，所以要把category置空
    this.setShelfCategory([]);
    // currenttype置为1，表示当前属于是书架列表
    this.setCurrentType(1);
  },
};
</script>

<style lang="scss" scoped>
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
}
</style>