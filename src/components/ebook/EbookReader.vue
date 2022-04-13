<template>
  <div class="ebook-reader">
    <div id="read"></div>
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
  getLocation
} from "@/utils/localStorage";

import { ebookMixin } from "@/utils/mixin";
import Epub from "epubjs";
global.epub = Epub;
export default {
  name: "EbookReader",
  mixins: [ebookMixin],
  methods: {
    // 上一页
    prevPage() {
      if (this.rendition) {
        this.rendition.prev();
      }
    },
    // 下一页
    nextPage() {
      if (this.rendition) {
        this.rendition.next();
      }
    },
    // 切换菜单状态
    toggleTitleAndMenu() {
      this.$store.dispatch(
        "setMenuVisible",
        !this.$store.state.ebook.menuVisible
      );
    },
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
      console.log(defaultTheme);
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
    initRendition() {
      //   将epub渲染在页面上
      this.rendition = this.book.renderTo("read", {
        // epubjs高版本实现滑屏
        flow: "paginated",
        manager: "continuous",
        width: innerWidth,
        height: innerHeight,
        snap: true,
      });

      //初始化电子书
      const location = getLocation(this.filename);
      this.display(location, () => {
        this.initFontFamily();
        this.initFontSize();
        this.initTheme();
        this.initGlobalStyle();
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
    initGesture() {
      // 实现显示隐藏菜单栏
      this.rendition.on("click", (event) => {
        // 隐藏设置组件
        if (this.settingVisible >= 0) {
          this.$store.dispatch("setSettingVisible", -1);
        }
        // 隐藏设置字体组件
        if (this.fontFamilyVisible) {
          this.$store.dispatch("setFontFamilyVisible", false);
        }
        this.toggleTitleAndMenu();
      });
    },
    // 初始化电子书
    initEpub() {
      // 获取epub文件的url
      let url =
        `${process.env.VUE_APP_RES_URL}/epub/` + this.filename + ".epub";
      this.book = new Epub(url);
      this.$store.dispatch("setCurrentBook", this.book);
      console.log(this.book);
      this.initRendition();
      this.initGesture();

      // 对电子书进行分页。
      this.book.ready
        .then(() => {
          return this.book.locations.generate(
            750 * (window.innerWidth / 375) * (getFontSize(this.filename) / 16)
          );
        })
        .then((locations) => {
          // console.log(locations);
          this.$store.dispatch("setBookAvailable", true);
          this.refreshLocation();
        });
    },
  },
  mounted() {
    this.$store
      .dispatch("setFileName", this.$route.params.filename.split("|").join("/"))
      .then(() => {
        this.initEpub();
      });
  },
};
</script>

<style>
</style>