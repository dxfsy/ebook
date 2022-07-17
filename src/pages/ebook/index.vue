<template>
  <transition name="slide-up">
    <div class="ebook" :style="{ top,transition}">
      <EbookHeader />
      <EbookTitle />
      <EbookReader />
      <EbookMenu />
      <EbookBookmark />
      <EbookFooter />
    </div>
  </transition>
</template>

<script>
import EbookHeader from '@/components/ebook/EbookHeader';
import EbookReader from "@/components/ebook/EbookReader";
import EbookTitle from "@/components/ebook/EbookTitle.vue";
import EbookMenu from "@/components/ebook/EbookMenu";
import EbookBookmark from '@/components/ebook/EbookBookmark';
import EbookFooter from '@/components/ebook/EbookFooter';
import { getReadTime, saveReadTime } from "@/utils/localStorage";
import { ebookMixin } from "@/utils/mixin";
export default {
  name: "Ebook",
  mixins: [ebookMixin],
  components: {
    EbookReader,
    EbookTitle,
    EbookMenu,
    EbookBookmark,
    EbookHeader,
    EbookFooter
  },
  data(){
    return {
      transition:'',
      top:''
    }
  },
  methods: {
    startLoopReadTime() {
      let readTime = getReadTime(this.filename);
      // console.log(readTime);
      if (readTime === undefined) {
        saveReadTime(this.filename, 0);
      } else {
        this.task = setInterval(() => {
          readTime++;
          if (readTime % 5 === 0) {
            saveReadTime(this.filename, readTime);
          }
        }, 1000);
      }
    },
  },
  watch: {
    offsetY(newVal) {
      if(this.menuVisible && !this.bookAvailable) {
        this.top = '';
      }else if(!this.menuVisible&&this.bookAvailable&&newVal === 0) {
        this.top = '';
        this.transition = "all .2s linear";
        this.timer = setTimeout(()=>{
          this.transition = "";
          clearTimeout(this.timer);
        },200)
      }else if(!this.menuVisible && this.bookAvailable&& newVal >0) {
        this.top = newVal + 'px';
      }
    }
  },
  mounted() {
    this.startLoopReadTime();
  },
  beforeDestroy() {
    if (this.task) clearInterval(this.task);
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global";
.ebook {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>