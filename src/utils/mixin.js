import { mapGetters,mapActions } from "vuex";
import { removeAllCss, ThemeList } from "@/utils/book";
import { addCss, getReadMinute } from '@/utils/book';
import { getBookmark, saveLocation,getBookShelf, saveBookShelf } from "./localStorage";
import { shelf } from "@/api/store";
import {gotoBookDetail,AppendAddToShelf,computeId,removeAddFromShelf} from '@/utils/store';

export const storeShelfMixin = {
  computed: {
    ...mapGetters([
      'isEditMode',
      'shelfList',
      'shelfSelected',
      'shelfTitleVisible',
      'offsetY',
      'shelfCategory',
      'currentType',
      'shelfSearchList'
    ])
  },
  methods: {
    ...mapActions([
      'setIsEditMode',
      'setShelfList',
      'setShelfSelected',
      'setShelfTitleVisible',
      'setOffsetY',
      'setShelfCategory',
      'setCurrentType',
      'setShelfSearchList'
    ]),
    showBookDetail(book) {
      gotoBookDetail(this, book)
    },
    getCategoryList(title) {
      this.getShelfList().then(() => {
        const categoryList = this.shelfList.filter(book => book.type === 2 && book.title === title)[0]
        this.setShelfCategory(categoryList)
      })
    },
    getShelfList() {
      let shelfList = getBookShelf()
      if (!shelfList) {
        // shelf().then(response => {
        //   if (response.status === 200 && response.data && response.data.bookList) {
        //     shelfList = AppendAddToShelf(response.data.bookList)
        //     saveBookShelf(shelfList)
        //     return this.setShelfList(shelfList)
        //   }
        // })
        shelfList = AppendAddToShelf([])
        saveBookShelf(shelfList)
        return this.setShelfList(shelfList)
      } else {
        return this.setShelfList(shelfList)
      }
    },
    moveOutOfGroup(f) {
      this.setShelfList(this.shelfList.map(book => {
        if (book.type === 2 && book.itemList) {
          book.itemList = book.itemList.filter(subBook => !subBook.selected)
        }
        return book
      })).then(() => {
        const list = computeId(AppendAddToShelf([].concat(
          removeAddFromShelf(this.shelfList), ...this.shelfSelected)))
        this.setShelfList(list).then(() => {
          this.simpleToast(this.$t('shelf.moveBookOutSuccess'))
          if (f) f()
        })
      })
    },
    getCategoryList(title){
      this.getShelfList().then(()=> {
        const categoryList = this.shelfList.filter(book=> book.type===2 && book.title===title)[0]
        this.setShelfCategory(categoryList);
      })
    },
    flatShelfList(searchText,list){
      let results = []
      if(searchText) {
        results = list.filter(item=> {
          if(item.fileName && item.fileName.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) {
            return true
          }else {
            if(item.itemList) {
              this.flatShelfList(searchText,item.itemList)
            }else {
              return false
            }
          }
        })
        if(this.shelfSearchList) {
          let temp = this.shelfSearchList
          results = [...results,...temp]
        }
        this.setShelfSearchList(results);
      }
    }
    
  }
}

export const storeHomeMixin = {
  computed: {
    ...mapGetters(['offsetY','hotSearchOffsetY','flapCardVisible'])
  },
  methods: {
    showBookDetail(book){ 
      this.$router.push({
        path:'/store/detail',
        query: {
          fileName:book.fileName,
          category:book.categoryText 
        }
      })
    }
  }
}

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
    getSectionName(){
      // if(this.section) {
      //   const sectionInfo = this.currentBook.section(this.section);
      //   if(sectionInfo&&sectionInfo.href&&this.currentBook&&this.currentBook.navigation) {
      //     return this.currentBook.navigation.get(sectionInfo.href).label;
      //   }
      // }else {
      //   return '';
      // }
     if(this.navigation&&this.navigation[this.section]){
      return this.section ? this.navigation[this.section].label : '';
     }
    }
  },
  methods: {
    // 初始化全局主题
    initGlobalStyle() {
      removeAllCss();
      switch (this.defaultTheme) {
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
      if (currentLocation && currentLocation.end) {
        const endCfi = currentLocation.end.cfi;
        const progress = this.currentBook.locations.percentageFromCfi(endCfi);
        this.$store.dispatch('setProgress', Math.floor(progress * 100));
        this.$store.dispatch('setSection', currentLocation.end.index);
        saveLocation(this.filename, endCfi);
        //书签功能 
        const bookmark = getBookmark(this.filename);
        // console.log(currentLocation.start.cfi,bookmark);
        if (bookmark) {

          // forEach方法设置该页是否有书签不能用return结束，只能用try catch以抛出错误的形式结束
          // 不符合设计原理
          // try {
          //   bookmark.forEach(item => {
          //     if (item.cfi === currentLocation.start.cfi) {
          //       this.$store.dispatch('setIsBookmark', true);
          //       throw new Error('强制结束forEach');
          //     } else {
          //       this.$store.dispatch('setIsBookmark', false);
          //     }
          //   });
          // } catch (error) {
          //   console.log(error.message);
          // }


          // array的some方法只会在那些“有值”的索引上调用回调
          // 若书签数组中的链接和当前页的链接一致，则显示
          if(bookmark.some(item=>item.cfi === currentLocation.start.cfi)){
            this.$store.dispatch('setIsBookmark',true);
          }else {
            this.$store.dispatch('setIsBookmark',false);
          }
        } else {
          // 没有书签数组，表示没有加过书签，固然不显示
          this.$store.dispatch('setIsBookmark', false);
        }
      }

    },
    display(target, cb) {
      if (target) {
        this.currentBook.rendition.display(target).then(() => {
          this.refreshLocation();
          if (cb) cb();
        });
      } else {
        this.currentBook.rendition.display().then(() => {
          this.refreshLocation();
          if (cb) cb();
        });
      }
    },
    // 点击电子书实现显示隐藏menu
    toggleMenu() {
      // 隐藏设置组件
      if (this.settingVisible >= 0) {
        this.$store.dispatch("setSettingVisible", -1);
      }
      // 隐藏设置字体组件
      if (this.fontFamilyVisible) {
        this.$store.dispatch("setFontFamilyVisible", false);
      }
      // 切换菜单状态
      this.$store.dispatch(
        "setMenuVisible",
        !this.$store.state.ebook.menuVisible
      );
    },
    // 获取读书时间
    getReadTimeText() {
      return this.$t('book.haveRead').replace('$1', getReadMinute(this.filename));
    },
  }
}