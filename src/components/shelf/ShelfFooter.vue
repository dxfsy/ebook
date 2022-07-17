<template>
  <div class="shelf-footer" v-show="isEditMode">
    <div
      class="shelf-footer-tabs-wrapper"
      v-for="item in tabs"
      :key="item.index"
      @click="onTabClick(item)"
    >
      <div class="shelf-footer-tab" :class="{ 'is-selected': isSelected }">
        <div
          class="icon-private tab-icon"
          v-show="item.index === 1 && !isPrivate"
        ></div>
        <div
          class="icon-private-see tab-icon"
          v-show="item.index === 1 && isPrivate"
        ></div>
        <div
          class="icon-download tab-icon"
          v-show="item.index === 2 && !isDownload"
        ></div>
        <div
          class="icon-download-remove tab-icon"
          v-show="item.index === 2 && isDownload"
        ></div>
        <div class="icon-move tab-icon" v-show="item.index === 3"></div>
        <div class="icon-shelf tab-icon" v-show="item.index === 4"></div>
        <div class="tab-text" :class="{ 'remove-text': item.index === 4 }">
          {{ label(item) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { storeShelfMixin } from "@/utils/mixin";
import { removeLocalStorage, saveBookShelf } from "@/utils/localStorage";
import { download } from "@/api/store";
import { removeLocalForage } from '@/utils/localForage';
export default {
  name: "ShelfFooter",
  mixins: [storeShelfMixin],
  computed: {
    tabs() {
      return [
        {
          label: this.$t("shelf.private"),
          label2: this.$t("shelf.noPrivate"),
          index: 1,
        },
        {
          label: this.$t("shelf.download"),
          label2: this.$t("shelf.delete"),
          index: 2,
        },
        {
          label: this.$t("shelf.move"),
          index: 3,
        },
        {
          label: this.$t("shelf.remove"),
          index: 4,
        },
      ];
    },
    isSelected() {
      return this.shelfSelected && this.shelfSelected.length > 0;
    },
    isPrivate() {
      if (!this.isSelected) {
        return false;
      } else {
        return this.shelfSelected.every((item) => item.private);
      }
    },
    isDownload() {
      if (!this.isSelected) {
        return false;
      } else {
        return this.shelfSelected.every((item) => item.cache);
      }
    },
  },
  data() {
    return {
      popupMenu: null,
    };
  },
  methods: {
    // 选出被选中的图书进行下载
    async downloadSelectedBook() {
      for (let i = 0; i < this.shelfSelected.length; i++) {
        await this.downloadBook(this.shelfSelected[i]).then((book) => {
          book.cache = true;
        });
      }
    },
    downloadBook(book) {
      let text = "";
      const toast = this.toast({
        text,
      });
      toast.continueShow();
      return new Promise((resolve, reject) => {
        download(
          book,
          (book) => {
            // console.log("下载完毕");
            setTimeout(() => {
              toast.remove();
            }, 3000);
            resolve(book);
          },
          reject,
          (progressEvent) => {
            const progress =
              Math.floor((progressEvent.loaded / progressEvent.total) * 100) +
              "%";
            text = this.$t("shelf.progressDownload").replace(
              "$1",
              `${book.fileName}.epub(${progress})`
            );
            // console.log(text);
            toast.updateText(text);
          }
        );
      });
    },
    // 删除已经选中的在本地保存的图书
    async removeSelectedBook(){
      await Promise.all(this.shelfSelected.map(book=> this.removeBook(book)))
      .then(books=> {
        books.map(book=> book.cache = false)
      })
      saveBookShelf(this.shelfList)
      this.simpleToast(this.$t("shelf.removeDownloadSuccess"));
    },
    // 删除在本地保存的图书
    removeBook(book){
      return new Promise((resolve,reject)=> {
        removeLocalStorage(`${book.categoryText}/${book.fileName}-info`)
        removeLocalForage(`${book.fileName}`)
        resolve(book)
      })
    },
    label(item) {
      switch (item.index) {
        case 1:
          return this.isPrivate ? item.label2 : item.label;
        case 2:
          return this.isDownload ? item.label2 : item.label;
        default:
          return item.label;
      }
    },
    hidePopup() {
      this.popupMenu.hide();
    },
    onComplete() {
      this.hidePopup();
      this.setIsEditMode(false);
      saveBookShelf(this.shelfList);
    },
    // 设置为私有书架
    setPrivate() {
      let isPrivate;
      if (this.isPrivate) {
        isPrivate = false;
      } else {
        isPrivate = true;
      }
      this.shelfSelected.forEach((book) => {
        book.private = isPrivate;
      });
      this.onComplete();
      if (isPrivate) {
        this.simpleToast(this.$t("shelf.setPrivateSuccess"));
      } else {
        this.simpleToast(this.$t("shelf.closePrivateSuccess"));
      }
    },
    // 设置开始离线缓存
    async setDownload() {
      this.onComplete();
      if (this.isDownload) {
        this.removeSelectedBook();
      }else {
        await this.downloadSelectedBook();
        saveBookShelf(this.shelfList)
        this.simpleToast(this.$t("shelf.setDownloadSuccess"));
      }
    },
    // 将选中图书从书架中移除
    removeSelected() {
      this.shelfSelected.forEach((selected) => {
        this.setShelfList(this.shelfList.filter((book) => book !== selected));
      });
      this.setShelfSelected([]), this.onComplete();
    },
    showDownload() {
      this.popupMenu = this.popup({
        title: this.isDownload
          ? this.$t("shelf.removeDownloadTitle")
          : this.$t("shelf.setDownloadTitle"),
        btn: [
          {
            text: this.isDownload
              ? this.$t("shelf.delete")
              : this.$t("shelf.open"),
            click: () => {
              this.setDownload();
            },
          },
          {
            text: this.$t("shelf.cancel"),
            click: () => {
              this.hidePopup();
            },
          },
        ],
      }).show();
    },
    showPrivate() {
      this.popupMenu = this.popup({
        title: this.isPrivate
          ? this.$t("shelf.closePrivateTitle")
          : this.$t("shelf.setPrivateTitle"),
        btn: [
          {
            text: this.isPrivate
              ? this.$t("shelf.close")
              : this.$t("shelf.open"),
            click: () => {
              this.setPrivate();
            },
          },
          {
            text: this.$t("shelf.cancel"),
            click: () => {
              this.hidePopup();
            },
          },
        ],
      }).show();
    },
    showRemove() {
      let title =
        this.shelfSelected.length === 1
          ? this.$t("shelf.removeBookTitle").replace(
              "$1",
              `《${this.shelfSelected[0].title}》`
            )
          : this.$t("shelf.removeBookTitle").replace(
              "$1",
              this.$t("shelf.selectedBooks")
            );
      this.popupMenu = this.popup({
        title: title,
        btn: [
          {
            text: this.$t("shelf.removeBook"),
            type: "danger",
            click: () => {
              this.removeSelected();
            },
          },
          {
            text: this.$t("shelf.cancel"),
            click: () => {
              this.hidePopup();
            },
          },
        ],
      }).show();
    },
    onTabClick(item) {
      if (!this.isSelected) {
        return;
      } else {
        switch (item.index) {
          case 1:
            this.showPrivate();
            break;
          case 2:
            this.showDownload();
            break;
          case 3:
            this.dialog().show();
            break;
          case 4:
            this.showRemove();
            break;
          default:
            break;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global";
.shelf-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 120;
  width: 100%;
  height: px2rem(48);
  display: flex;
  background-color: #fff;
  box-shadow: 0 px2rem(-2) px2rem(4) 0 rgba(0, 0, 0, 0.1);
  .shelf-footer-tabs-wrapper {
    flex: 1;
    width: 25%;
    height: 100%;
    .shelf-footer-tab {
      width: 100%;
      height: 100%;
      @include columnCenter;
      opacity: 0.5;
      &.is-selected {
        opacity: 1;
      }
      .tab-icon {
        font-size: px2rem(20);
        color: #666;
      }
      .tab-text {
        font-size: px2rem(12);
        color: #666;
        &.remove-text {
          color: $color-pink;
        }
      }
      .icon-shelf {
        color: $color-pink;
      }
    }
  }
}
</style>