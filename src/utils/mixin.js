import { mapGetters } from "vuex";
import { removeAllCss, ThemeList } from "@/utils/book";
import {addCss} from '@/utils/book';
import { saveLocation } from "./localStorage";
export const ebookMixin = {
  computed: {
    ...mapGetters([
      "filename", 
      "menuVisible", 
      'settingVisible', 
      'defaultFontSize', 
      'currentBook', 
      'defaultFontFamily',
      'fontFamilyVisible',
      'defaultTheme',
      'bookAvailable',
      'progress',
      'section',
      'isPaginating',
      'navigation',
      'cover',
      'metadata',
      'paginate',
      'pagelist',
      'offsetY',
      'isBookmark']),
      themeList() {
        return ThemeList(this);
      },
  },
  methods: {
    // 初始化全局主题
    initGlobalStyle(){
      removeAllCss();
      switch(this.defaultTheme){
        case 'Default':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
        case 'Gold':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
          break
        case 'Eye':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
          break
        case 'Night':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
          break
      }
      
    },
    // 刷新当前电子书的所处位置
    refreshLocation() {
      // currentLocation 的api有问题，获取进度会出错 将就用
      const currentLocation = this.currentBook.rendition.currentLocation();
      const startCfi =  currentLocation.start.cfi;
      const progress = this.currentBook.locations.percentageFromCfi(startCfi);
      this.$store.dispatch('setProgress',Math.floor(progress*100));
      this.$store.dispatch('setSection',currentLocation.start.index);
      saveLocation(this.filename,startCfi);
    },
    display(target,cb){
      if(target) {
        this.currentBook.rendition.display(target).then(()=> {
          this.refreshLocation();
          if(cb) cb();
        });
      }else {
        this.currentBook.rendition.display().then(()=> {
          this.refreshLocation();
          if(cb) cb();
        });
      }
    }
  }
}