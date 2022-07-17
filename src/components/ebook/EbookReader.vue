<template>
  <div class="ebook-reader">
    <div id="read"></div>
    <div
      class="ebook-reader-mask"
      @click="onMaskClick"
      @touchstart="moveStart"
      @touchmove="move"
      @touchend="moveEnd"
      @mousedown.left="mouseEnter"
      @mousemove.left="mouseMove"
      @mouseup.left="mouseEnd"
    ></div>
  </div>
</template>

<script>
import {
  getFontFamily,
  saveFontFamily,
  getFontSize,
  saveFontSize,
  getTheme,
  saveTheme,
  getLocation,
} from "@/utils/localStorage";

import { ebookMixin } from "@/utils/mixin";
import { flatten } from "@/utils/book";
import Epub from "epubjs";
import { getLocalForage } from "@/utils/localForage";
global.epub = Epub;
export default {
  name: "EbookReader",
  mixins: [ebookMixin],
  methods: {
    mouseEnter(e) {
      this.mouseState = 1;
      // this.startTime = e.timeStamp;
      const startY = e.clientY;
      this.firstOffsetY = startY;
      e.preventDefault();
      e.stopPropagation();
    },
    mouseMove(e) {
      if (this.mouseState === 1) {
        this.mouseState = 2;
      } else if (this.mouseState === 2) {
        let offsetY = 0;
        if (this.firstOffsetY) {
          offsetY = e.clientY - this.firstOffsetY;
          if (offsetY > 0) {
            this.$store.dispatch("setOffsetY", offsetY);
          }
        }
      }
      e.preventDefault();
      e.stopPropagation();
    },
    mouseEnd(e) {
      if (this.mouseState === 2) {
        this.$store.dispatch("setOffsetY", 0);
        this.firstOffsetY = 0;
        this.mouseState = 3;
      } else {
        this.mouseState = 4;
      }
      // const time = e.timeStamp - this.startTime;
      // if(time < 200) {
      //   this.mouseState = 4;
      // }
      e.preventDefault();
      e.stopPropagation();
    },
    move(e) {
      let offsetY = 0;
      if (this.firstOffsetY) {
        offsetY = e.changedTouches[0].clientY - this.firstOffsetY;
        if (offsetY > 0) {
          this.$store.dispatch("setOffsetY", offsetY);
        }
      }
      e.preventDefault();
      e.stopPropagation();
    },
    moveStart(e) {
      const touchStartY = e.changedTouches[0].clientY;
      this.firstOffsetY = touchStartY;
    },
    moveEnd(e) {
      this.firstOffsetY = 0;
      this.$store.dispatch("setOffsetY", 0);
    },
    // 电子书点击事件(翻页，显示隐藏菜单栏)
    onMaskClick(e) {
      if (this.mouseState && (this.mouseState === 2 || this.mouseState === 3)) {
        return;
      }
      const offsetX = e.offsetX;
      const width = window.innerWidth;
      if (offsetX > 0 && offsetX < width * 0.3) {
        this.prevPage();
      } else if (offsetX > 0 && offsetX > width * 0.7) {
        this.nextPage();
      } else {
        this.toggleMenu();
      }
    },
    // 上一页
    prevPage() {
      if (this.rendition) {
        this.rendition.prev().then(() => {
          this.refreshLocation();
        });
        this.hideMenuAndTitle();
      }
    },
    // 下一页
    nextPage() {
      if (this.rendition) {
        this.rendition.next().then(() => {
          this.refreshLocation();
        });
      }
      this.hideMenuAndTitle();
    },
    // 初始化手势点击事件
    // initGesture(){
    //   // 实现翻页和展示菜单 低版本实现滑屏
    //   this.rendition.on("touchstart", (event) => {
    //     this.touchStartX = event.changedTouches[0].clientX;
    //     this.touchStartTime = event.timeStamp;
    //   });
    //   this.rendition.on("touchend", (event) => {
    //     const offsetX = event.changedTouches[0].clientX - this.touchStartX;
    //     const time = event.timeStamp - this.touchStartTime;
    //     if (time < 500 && offsetX > 40) {
    //       this.prevPage();
    //     } else if (time < 500 && offsetX < -40) {
    //       this.nextPage();
    //     } else {
    //       this.toggleMenu();
    //     }
    //     // event.preventDefault();
    //     event.stopPropagation();
    //   });

    // },
    // 初始化字体类型
    initFontFamily() {
      let font = getFontFamily(this.filename);
      if (!font) {
        saveFontFamily(this.filename, this.defaultFontFamily);
      } else {
        this.currentBook.rendition.themes.font(font);
        this.$store.dispatch("setDefaultFontFamily", font);
      }
    },
    // 初始字体大小
    initFontSize() {
      let fontSize = getFontSize(this.filename);
      if (!fontSize) {
        saveFontSize(this.filename, this.defaultFontSize);
      } else {
        this.currentBook.rendition.themes.fontSize(fontSize + "px");
        this.$store.dispatch("settingDefaultFontSize", fontSize);
      }
    },
    // 初始化主题
    initTheme() {
      let defaultTheme = getTheme(this.filename);
      // console.log(defaultTheme);
      if (!defaultTheme) {
        defaultTheme = this.themeList[0].name;
      }
      this.$store.dispatch("setDefaultTheme", defaultTheme);
      saveTheme(this.filename, defaultTheme);

      this.themeList.forEach((theme) => {
        this.rendition.themes.register(theme.name, theme.style);
      });
      this.rendition.themes.select(defaultTheme);
    },
    // 获取电子书信息
    praseBook() {
      // 获取封面信息
      this.book.loaded.cover.then((cover) => {
        // 此处获取的cover还不是真正的链接，需要将cover传入createUrl方法中进一步生成可用链接
        this.book.archive.createUrl(cover).then((url) => {
          this.$store.dispatch("setCover", url);
        });
      });
      // 获取电子书相关信息（作者名称，书籍标题等等）
      this.book.loaded.metadata.then((metedata) => {
        this.$store.dispatch("setMetadata", metedata);
      });
      // 获取电子书的章节信息
      this.book.loaded.navigation.then((nav) => {
        const navItem = flatten(nav.toc);
        // 进行目录层级判断
        function find(item, level = 0) {
          return !item.parent
            ? level
            : find(
                navItem.filter(
                  (parentItem) => parentItem.id === item.parent
                )[0],
                ++level
              );
        }
        navItem.forEach((item) => {
          item.level = find(item);
        });
        this.$store.dispatch("setNavigation", navItem);
      });
    },
    initRendition() {
      //   将epub渲染在页面上
      this.rendition = this.book.renderTo("read", {
        // epubjs高版本实现滑屏
        // flow: "paginated",
        // manager: "continuous",
        // snap: true,
        width: innerWidth,
        height: innerHeight,
      });

      //初始化电子书
      const location = getLocation(this.filename);
      this.display(location, () => {
        this.initFontFamily();
        this.initFontSize();
        this.initTheme();
        this.initGlobalStyle();
        this.praseBook();
      });

      // 服务端加载字体文件
      this.rendition.hooks.content.register((contents) => {
        Promise.all([
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/cabin.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`
          ),
        ]).then(() => {});
      });
    },
    // 隐藏菜单
    hideMenuAndTitle() {
      this.$store.dispatch("setMenuVisible", false);
    },
    // 初始化电子书
    initEpub(url) {
      this.book = new Epub(url);
      this.$store.dispatch("setCurrentBook", this.book);
      // console.log(this.book);
      this.initRendition();
      // this.initGesture();

      // 对电子书进行分页。
      this.book.ready
        .then(() => {
          return this.book.locations.generate(
            750 * (window.innerWidth / 375) * (getFontSize(this.filename) / 16)
          );
        })
        .then((locations) => {
          // console.log(locations);
          this.navigation.forEach(nav => {
            nav.pagelist = []
          })
          locations.forEach(item => {
            let loc = item.match(/\[(.*)\]!/)
            if(loc) {
              loc = loc[1]
            }
            this.navigation.forEach(nav => {
              if (nav.href) {
                const href = nav.href.match(/^(.*)\.html$/)
                if (href) {
                  if (href[1] === loc) {
                    nav.pagelist.push(item)
                  }
                }
              }
            })
            let currentPage = 1
            this.navigation.forEach((nav, index) => {
              if (index === 0) {
                nav.page = 1
              } else {
                nav.page = currentPage
              }
              currentPage += nav.pagelist.length + 1
            })
          })
          this.$store.dispatch('setPagelist',locations)
          this.$store.dispatch("setBookAvailable", true)
          this.refreshLocation();
        });
    },
  },
  mounted() {
    const books = this.$route.params.filename.split("|");
    const fileName = books[1];
    getLocalForage(fileName, (err, blob) => {
      if (!err && blob) {
        // console.log("找到离线缓存电子书");
        this.$store.dispatch("setFileName", books.join("/")).then(() => {
          this.initEpub(blob);
        });
      } else {
        // console.log("在线下载电子书");
        this.$store.dispatch("setFileName", books.join("/")).then(() => {
          // 获取epub文件的url
          let url =
            `${process.env.VUE_APP_EPUB_URL}/` + this.filename + ".epub";
          this.initEpub(url);
        });
      }
    });
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global";
.ebook-reader {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .ebook-reader-mask {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 150;
    width: 100%;
    height: 100%;
    background-color: transparent;
  }
}
</style>