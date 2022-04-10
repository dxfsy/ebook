<template>
  <div class="ebook-reader">
    <div id="read"></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Epub from "epubjs";
global.epub = Epub;
export default {
  name: "EbookReader",
  computed: {
    ...mapGetters(["filename"]),
  },
  methods: {
    prevPage() {
      if (this.rendition) {
        this.rendition.prev();
      }
    },
    nextPage() {
      if (this.rendition) {
        this.rendition.next();
      }
    },
    toggleTitleAndMenu() {},
    initEpub() {
      // 获取epub文件的url
      let url = "http://10.77.162.36:8081/epub/" + this.filename + ".epub";
      this.book = new Epub(url);
      console.log(this.book);
      //   将epub渲染在页面上
      this.rendition = this.book.renderTo("read", {
        // epubjs高版本实现滑屏
        // flow: "paginated",
        // manager: "continuous",
        // snap: true
        width: innerWidth,
        height: innerHeight,
        
      });
      this.rendition.display();

      // 实现翻页和展示菜单 低版本实现滑屏
        this.rendition.on("touchstart", (event) => {
          this.touchStartX = event.changeTouches[0].clientX;
          this.touchStartTime = event.timeStamp;
        });
        this.rendition.on("touchend", (event) => {
          const offsetX = event.changeTouches[0].clientX - this.touchStartX;
          const time = event.timeStamp - this.touchStartTime;
          if (time < 500 && offsetX > 40) {
            this.prevPage();
          } else if (time < 500 && offsetX < -40) {
            this.nextPage();
          } else {
            this.toggleTitleAndMenu();
          }
          event.preventDefault();
          event.stopPropagation();
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