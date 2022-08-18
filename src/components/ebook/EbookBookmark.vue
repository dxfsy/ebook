<template>
  <div class="ebook-bookmark" ref="bookmark">
    <div class="ebook-bookmark-text-wrapper">
      <div class="ebook-bookmark-down-wrapper" ref="bookmarkDown">
        <span class="icon-down" ref="bookmarkIcon"></span>
      </div>
      <div class="ebook-bookmark-text">{{ text }}</div>
    </div>
    <div class="ebook-bookmark-icon-wrapper" :style="isFixed ? fixedStyle : {}">
      <Bookmark :color="color" :width="15" :height="35" />
    </div>
  </div>
</template>

<script>
import Bookmark from "@/components/common/Bookmark";
import { ebookMixin } from "@/utils/mixin";
import { px2rem, realPx } from "@/utils/utils";
import { getBookmark,saveBookmark } from '@/utils/localStorage';
const BLUE = "#346cbc";
const WHITE = "#fff";
export default {
  name: "EbookBookmark",
  mixins: [ebookMixin],
  data() {
    return {
      color: "",
      text: "",
      isFixed: false,
    };
  },
  components: {
    Bookmark,
  },
  computed: {
    height() {
      return realPx(35);
    },
    threshold() {
      return realPx(65);
    },
    fixedStyle() {
      return {
        position: "fixed",
        top: 0,
        right: `${(window.innerWidth - this.$refs.bookmark.clientWidth) / 2}px`,
      };
    },
  },
  watch: {
    offsetY(v) {
      if (!this.bookAvailable || this.menuVisible || this.settingVisible > 0) {
        return;
      }
      if (v >= this.height && v < this.threshold) {
        this.beforeThreshold(v);
      } else if (v >= this.threshold) {
        this.afterThreshold(v);
      } else if (v > 0 && v < this.height) {
        this.beforeHeight();
      } else if (v === 0) {
        this.restore();
      }
    },
    isBookmark(isBookmark){
        this.isFixed = isBookmark;
        if(isBookmark) {
            this.color = BLUE;
        }else {
            this.color = WHITE;
        }
    }
  },
  methods: {
    addBookmark(){
        this.bookmark = getBookmark(this.filename);
        // console.log(this.bookmark);
        if(!this.bookmark) {
            this.bookmark = []
        }
        const currentLocation = this.currentBook.rendition.currentLocation();
        const cfibase = currentLocation.start.cfi.replace(/!.*/,'');
        const cfistart = currentLocation.start.cfi.replace(/.*!/,'').replace(/\)/,'');
        const cfiend = currentLocation.end.cfi.replace(/.*!/,'').replace(/\)/,'');
        const cfirange = `${cfibase}!,${cfistart},${cfiend})`;
        // getRange方法获取cfi范围内的文本
        this.currentBook.getRange(cfirange).then((range)=>{
            const text = range.toString().replace(/\s\s/g,'');
            this.bookmark.push({
                cfi: currentLocation.start.cfi,
                text:text,
            })
            saveBookmark(this.filename,this.bookmark);
        })
    },
    removeBookmark(){
        const currentLocation = this.currentBook.rendition.currentLocation();
        const cfi = currentLocation.start.cfi;
        this.bookmark = getBookmark(this.filename);
        if(this.bookmark) {
            this.bookmark = this.bookmark.filter(item=> {
                return item.cfi !==  cfi
            })
            saveBookmark(this.filename,this.bookmark);
            this.$store.dispatch('setIsBookmark',false);
        }
    },  
    restore() {
      // 状态4 归位
      this.timer = setTimeout(() => {
        this.$refs.bookmark.style.top = `-${this.height}px`;
        this.$refs.bookmarkDown.style.transform = `rotate(0deg)`;
        // clearTimeout(this.timer);
      }, 200);
      if (this.isFixed) {
        this.$store.dispatch("setIsBookmark", true);
        this.addBookmark();
      } else {
        this.$store.dispatch("setIsBookmark", false);
        this.removeBookmark();
      }
    },
    beforeHeight() {
      // 状态1 未超过书签的高度
      if (this.isBookmark) {
        this.text = this.$t("book.pulldownDeleteMark");
        this.color = BLUE;
        this.isFixed = true;
      } else {
        this.text = this.$t("book.pulldownAddMark");
        this.color = WHITE;
        this.isFixed = false;
      }
    },
    beforeThreshold(v) {
      // 状态2，未到达临界状态
      // 相对定位，外层下移，内层向上移相同的像素点，现象为不动。
      this.$refs.bookmark.style.top = `${-v}px`;
      this.beforeHeight();
      const bookmarkDown = this.$refs.bookmarkDown;
      if ((bookmarkDown.style.transform === "rotate(180deg)")) {
        bookmarkDown.style.transform = "rotate(0deg)";
      }
    },
    afterThreshold(v) {
      // 状态3，超过临界状态
      this.$refs.bookmark.style.top = `${-v}px`;
      if (this.isBookmark) {
        this.text = this.$t("book.releaseDeleteMark");
        this.color = WHITE;
        this.isFixed = false;
      } else {
        this.text = this.$t("book.releaseAddMark");
        this.color = BLUE;
        this.isFixed = true;
      }
      const bookmarkDown = this.$refs.bookmarkDown;
      if (
        bookmarkDown.style.transform === "" ||
        bookmarkDown.style.transform === "rotate(0deg)"
      ) {
        bookmarkDown.style.transform = "rotate(180deg)";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global";
.ebook-bookmark {
  position: absolute;
  top: px2rem(-35);
  left: 0;
  width: 100%;
  height: px2rem(35);
  z-index: 200;
  .ebook-bookmark-text-wrapper {
    position: absolute;
    right: px2rem(45);
    bottom: 0;
    font-size: px2rem(16);
    color: #fff;
    display: flex;
    .ebook-bookmark-down-wrapper {
      transition: all 0.2s linear;
      @include center;
    }
    .ebook-bookmark-text {
    }
  }
  .ebook-bookmark-icon-wrapper {
    position: absolute;
    right: 0;
    bottom: 0;
    margin-right: px2rem(15);
  }
}
</style>