<!-- 书城列表组件 -->
<template>
  <div class="book-list-wrapper">
    <detail-title :title="title"
                  :showShelf="true"
                  @back="back"
                  ref="title"></detail-title>
    <scroll class="book-list-scroll-wrapper"
            :top="42"
            @onScroll="onScroll"
            ref="scroll">
            <div v-if="shelfSearchList.length===0">
      <featured :data="value" :titleText="titleText ? titleText : getCategoryText(key)" :btnText="''" v-for="(value, key, index) in list"
                :key="index"></featured>
            </div>
            <div v-else>
              <featured :data="shelfSearchList" :titleText="titleText" :btnText="''" ></featured>
            </div>
    </scroll>
  </div>
</template>

<script>
  import DetailTitle from '../../components/detail/DetaiTitle'
  import Scroll from '../../components/common/Scroll'
  import Featured from '../../components/home/Featured'
  import {storeShelfMixin} from '../../utils/mixin'
  import { realPx } from '../../utils/utils'
  import { list } from '../../api/store'
  import { categoryList, categoryText } from '../../utils/store'

  export default {
    mixins: [storeShelfMixin],
    components: {
      DetailTitle,
      Scroll,
      Featured
    },
    computed: {
      // 动态生成标题数据
      title() {
        if (this.list || this.shelfSearchList.length !== 0) {
          return this.$t('home.allBook').replace('$1', this.totalNumber)
        } else {
          return null
        }
      },
      // 获取当前列表中电子书总数
      totalNumber() {
        let num = 0
        if(this.list) {
          Object.keys(this.list).forEach(key => {
            num += this.list[key].length
          })
        }
        if(this.shelfSearchList.length!==0) {
          num = this.shelfSearchList.length
        }
        return num
      }
    },
    data() {
      return {
        list: null,
        total: null,
        titleText: ''
      }
    },
    methods: {
      // 获取分类文本
      getCategoryText(key) {
        return `${categoryText(categoryList[key], this)}(${this.list[key].length})`
      },
      back() {
        this.$router.go(-1)
        if(this.shelfSearchList.length!==0) {
          this.setShelfSearchList([])
          this.setShelfTitleVisible(true)
        }
        
      },
      // 标题阴影的隐藏状态
      onScroll(offsetY) {
        if (offsetY > realPx(42)) {
          this.$refs.title.showShadow()
        } else {
          this.$refs.title.hideShadow()
        }
      },
      // 通过API获取分类列表
      getList() {
        list().then(response => {
          this.list = response.data.data
          this.total = response.data.total
          const category = this.$route.query.category
          const keyword = this.$route.query.keyword
          if (category) {
            // 如果用户传入了分类数据，则从结果中搜索相应的分类数据并进行展示
            const key = Object.keys(this.list).filter(item => item === category)[0]
            const data = this.list[key]
            this.list = {}
            this.list[key] = data
          } else if (keyword) {
            // 如果用户输入了关键字，则通过书名进行关键字匹配（搜索算法）
            Object.keys(this.list).filter(key => {
              this.list[key] = this.list[key].filter(book => book.fileName.indexOf(keyword) >= 0)
              return this.list[key].length > 0
            })
          }
        })
      }
    },
    created() {
      if(this.$route.query.keyword!=='STORE_LIST_SEARCH') {
        this.getList()
        this.titleText = this.$route.query.categoryText
      }else {
        this.titleText = this.shelfSearchList[0].categoryText
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .book-list-wrapper {
    width: 100%;
    height: 100%;
    background: white;
  }
</style>
