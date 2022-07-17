<template>
  <div
    class="shelf-item"
    :class="{ 'shelf-item-shadow': data.type === 1 || data.type === 2 }"
    @click="onClickItem"
  >
    <component
      :is="item"
      :data="data"
      class="shelf-item-comp"
      :class="{ 'is-edit': data.type === 2 && isEditMode }"
    ></component>
    <div
      class="shelf-item-icon-selected icon-selected"
      :class="{ 'is-selected': data.selected }"
      v-show="data.type === 1 && isEditMode"
    ></div>
  </div>
</template>

<script>
import ShelfBook from "@/components/shelf/ShelfItemBook.vue";
import ShelfCategory from "@/components/shelf/ShelfItemCategory.vue";
import ShelfAdd from "@/components/shelf/ShelfItemAdd.vue";
import { storeShelfMixin } from "@/utils/mixin";
import { gotoStoreHome } from "@/utils/store";
export default {
  name: "ShelfItem",
  mixins: [storeShelfMixin],
  props: {
    data: Object,
  },
  data() {
    return {
      book: ShelfBook,
      category: ShelfCategory,
      add: ShelfAdd,
    };
  },
  components: {
    ShelfBook,
    ShelfCategory,
    ShelfAdd,
  },
  computed: {
    item() {
      return this.data.type === 1
        ? this.book
        : this.data.type === 2
        ? this.category
        : this.add;
    },
  },
  methods: {
    onClickItem() {
      // 处于编辑模式
      if (this.isEditMode) {
        // 是图书而不是“列表”和“添加图书”时
        if (this.data.type === 1) {
          this.data.selected = !this.data.selected;
          if (this.data.selected) {
            // 将选中的图书放入“选中书架”列表（去重的放入）
            this.shelfSelected.pushWithoutDuplicate(this.data);
          } else {
            // 将与当前id相同的“选中书架”中的图书过滤掉，用新数组代替
            this.setShelfSelected(
              this.shelfSelected.filter((item) => item.id !== this.data.id)
            );
          }
        }
      } else {
        // 不处于编辑模式
        if (this.data.type === 1) {
          this.showBookDetail(this.data);
        } else if (this.data.type === 2) {
          this.$router.push({
            path:'/store/category',
            query:{
              title: this.data.title
            },
          })
        } else {
          gotoStoreHome(this);
        }
      }
    },
  },
  // mounted() {
  //   console.log(this.data);
  // },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global";
.shelf-item {
  position: relative;
  width: 100%;
  height: 100%;
  &.shelf-item-shadow {
    box-shadow: px2rem(2) px2rem(2) px2rem(6) px2rem(2) rgba(200, 200, 200, 0.3);
  }
  .shelf-item-icon-selected {
    position: absolute;
    bottom: px2rem(2);
    right: px2rem(2);
    font-size: px2rem(18);
    color: rgba(0, 0, 0, 0.4);
    &.is-selected {
      color: $color-blue;
    }
  }
  .shelf-item-comp {
    opacity: 1;
    &.is-edit {
      opacity: 0.5;
    }
  }
}
</style>