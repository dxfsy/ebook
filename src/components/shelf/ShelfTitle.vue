<template>
  <transition name="fade">
    <div
      class="shelf-title"
      v-show="shelfTitleVisible"
      :class="{ 'hide-shadow': ifHideShadow }"
    >
      <div class="shelf-title-text-wrapper">
        <div class="shelf-title-text">{{ title }}</div>
        <div class="shelf-sub-title-text" v-show="isEditMode">
          {{ selectedBook }}
        </div>
      </div>
      <div class="shelf-title-btn-wrapper left-btn" v-show="showClear">
        <span class="shelf-title-clear" @click="clearCache">{{
          $t("shelf.clearCache")
        }}</span>
      </div>
      <div class="shelf-title-btn-wrapper right-btn" v-show="showEdit">
        <span class="shelf-title-edit" @click="onEditClick">{{
          isEditMode ? $t("shelf.cancel") : $t("shelf.edit")
        }}</span>
      </div>
      <div
        class="shelf-title-btn-wrapper left-btn"
        v-show="showBack"
        @click="back"
      >
        <span class="icon-back"></span>
      </div>
      <div
        class="shelf-title-btn-wrapper"
        :class="{ 'left-btn': changeGroupLeft, 'right-btn': changeGroupRight }"
        @click="changeGroup"
        v-show="showChangeGroup"
      >
        <span class="shelf-title-btn-text">{{ $t("shelf.editGroup") }}</span>
      </div>
    </div>
  </transition>
</template>

<script>
import { clearLocalStorage, saveBookShelf } from "@/utils/localStorage";
import { storeShelfMixin } from "../../utils/mixin";
import { clearLocalForage } from "@/utils/localForage";
export default {
  mixins: [storeShelfMixin],
  name: "ShelfTitle",
  computed: {
    selectedBook() {
      const selectNumber = this.shelfSelected ? this.shelfSelected.length : 0;
      return selectNumber <= 0
        ? this.$t("shelf.selectBook")
        : selectNumber === 1
        ? this.$t("shelf.haveSelectedBook").replace("$1", selectNumber)
        : this.$t("shelf.haveSelectedBooks").replace("$1", selectNumber);
    },
    showBack() {
      return this.currentType === 2 && !this.isEditMode;
    },
    changeGroupLeft() {
      return !this.emptyCategory;
    },
    changeGroupRight() {
      return this.emptyCategory;
    },
    showChangeGroup() {
      return this.currentType === 2 && (this.isEditMode || this.emptyCategory);
    },
    showClear() {
      return this.currentType === 1;
    },
    emptyCategory() {
      return (
        !this.shelfCategory ||
        !this.shelfCategory.itemList ||
        this.shelfCategory.itemList.length === 0
      );
    },
    showEdit() {
      return this.currentType === 1 || !this.emptyCategory;
    },
  },
  props: {
    title: {
      type: String,
    },
  },
  data() {
    return {
      ifHideShadow: true,
    };
  },
  watch: {
    offsetY(offsetY) {
      if (offsetY > 0) {
        this.ifHideShadow = false;
      } else {
        this.ifHideShadow = true;
      }
    },
  },
  methods: {
    // 隐藏弹窗
    hidePopup() {
      this.popupMenu.hide();
    },
    // 创建popup中的按钮（参数）
    createPopupBtn(text, onClick, type = "normal") {
      return {
        text,
        type,
        click: onClick,
      };
    },
    // 修改分组的名字
    changeGroupName() {
      this.hidePopup();
      this.dialog({
        showNewGroup: true,
        groupName: this.shelfCategory.title,
      }).show();
    },
    // （删除分组）对分组数据进行过滤
    onComplete(){
      this.hidePopup()
      this.setShelfList(this.shelfList.filter(book=> book.id!==this.shelfCategory.id)).then(()=> {
        saveBookShelf(this.shelfList)
        this.$router.go(-1);
        this.setIsEditMode(false);
      })
    },
    // 删除分组
    deleteGroup(){
      // 当分组不为空
      if(!this.emptyCategory) {
        // 将分组中的书籍全部置为选中状态
        this.setShelfSelected(this.shelfCategory.itemList)
        // 调用将选中的书籍从分组中移除的方法（移回到书架上）
        this.moveOutOfGroup(this.onComplete)
      }else {
        // 
        this.onComplete()
      }
    },
    // 显示删除分组的弹窗（二级弹窗）
    showDeleteGroup() {
      this.hidePopup();
      setTimeout(() => {
        this.popupMenu = this.popup({
          title: this.$t("shelf.deleteGroupTitle"),
          btn: [
            this.createPopupBtn(this.$t('shelf.confirm'),()=> {
              this.deleteGroup()
            },'danger'),
            this.popupCancelBtn()
          ]
        }).show();
      }, 200);
    },
    // 点击“取消”，关闭popup弹窗
    popupCancelBtn(){
      return this.createPopupBtn(this.$t("shelf.cancel"), () => {
            this.hidePopup();
          })
    },
    // 点击“修改分组”触发的函数
    changeGroup() {
      this.popupMenu = this.popup({
        btn: [
          this.createPopupBtn(this.$t("shelf.editGroupName"), () => {
            this.changeGroupName();
          }),
          this.createPopupBtn(
            this.$t("shelf.deleteGroup"),
            () => {
              this.showDeleteGroup();
            },
            "danger"
          ),
          
          this.popupCancelBtn()
        ],
      }).show();
    },
    onEditClick() {
      if (!this.isEditMode) {
        this.setShelfSelected([]);
        this.shelfList.forEach((item) => {
          item.selected = false;
          if (item.itemList)
            item.itemList.forEach((subItem) => {
              subItem.selected = false;
            });
        });
      }
      this.setIsEditMode(!this.isEditMode);
    },
    clearCache() {
      clearLocalStorage();
      clearLocalForage();
      this.setShelfList([]);
      this.setShelfSelected([]);
      this.getShelfList();
      this.simpleToast(this.$t("shelf.clearCacheSuccess"));
    },
    back() {
      this.$router.go(-1);
      this.setIsEditMode(false);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global";
.shelf-title {
  position: relative;
  z-index: 130;
  top: 0;
  width: 100%;
  height: px2rem(42);
  background-color: #fff;
  box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, 0.1);
  transition: box-shadow $animationTime;
  &.hide-shadow {
    box-shadow: none;
  }
  .shelf-title-text-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: px2rem(42);
    @include columnCenter;
    .shelf-title-text {
      font-size: px2rem(16);
      line-height: px2rem(20);
      font-weight: bold;
      color: #333;
    }
    .shelf-sub-title-text {
      font-size: px2rem(10);
      color: #333;
    }
  }
  .shelf-title-btn-wrapper {
    position: absolute;
    width: fit-content;
    height: px2rem(42);
    font-size: px2rem(14);
    color: #666;
    @include columnCenter;
    box-sizing: border-box;
    &.right-btn {
      right: 0;
      padding-right: px2rem(15);
    }
    &.left-btn {
      left: 0;
      padding-left: px2rem(15);
    }
    .icon-back {
      font-size: px2rem(20);
    }
  }
}
</style>