<template>
  <div class="store-home">
    <SearchBar />
    <Scroll :top="top" @onScroll="onScroll" ref="scroll">
      <div class="banner-wrapper">
        <div
          class="banner-img"
          :style="{ backgroundImage: `url('${banner}')` }"
        ></div>
      </div>
      <GuessYouLike :data="guessYouLike" />
      <Recommend :data="recommend" class="recommend"/>
      <Featured :data="featured" :titleText="$t('home.featured')" :btnText="$t('home.seeAll')" class="featured"/>
      <div class="category-list-wrapper" v-for = '(item,index) in categoryList' :key="index">
          <CategoryBook :data="item"/>
      </div>
      <Category class="categories" :data="categories"/>
    </Scroll>
    <FlapCard v-show="flapCardVisible" :data="random" />
  </div>
</template>

<script>
import Category from '@/components/home/Category'
import CategoryBook from '@/components/home/CategoryBook'
import Featured from '@/components/home/Featured'
import Recommend from '@/components/home/Recommend'
import GuessYouLike from "@/components/home/GuessYouLike";
import FlapCard from "@/components/home/FlapCard";
import Scroll from "@/components/common/Scroll";
import SearchBar from "@/components/home/SearchBar";
import { storeHomeMixin } from "@/utils/mixin";
import { home } from "@/api/store";
export default {
  name: "StoreHome",
  mixins: [storeHomeMixin],
  data() {
    return {
      top: 94,
      // 随机推荐图书
      random: null,
      banner: '',
      guessYouLike: null,
      recommend:null,
      featured:null,
      categoryList:null,
      categories:null,
    };
  },
  components: {
    SearchBar,
    Scroll,
    FlapCard,
    GuessYouLike,
    Recommend,
    Featured,
    CategoryBook,
    Category
  },
  methods: {
    onScroll(offsetY) {
      this.$store.dispatch("setOffsetY", offsetY);
    },
  },
  watch: {
    offsetY(offsetY) {
      if (offsetY > 0) {
        this.top = 56;
      } else {
        this.top = 94;
      }
      this.$refs.scroll.refresh();
    },
  },
  mounted() {
    home().then((res) => {
      if (res && res.status === 200) {
        const data = res.data;
        const randomIndex = Math.floor(Math.random() * data.random.length);
        this.random = data.random[randomIndex];
        this.banner = data.banner;
        this.guessYouLike = data.guessYouLike;
        this.recommend = data.recommend;
        this.featured = data.featured;
        this.categoryList = data.categoryList;
        this.categories = data.categories;
      }
    });
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global";
.store-home {
  width: 100%;
  height: 100%;
  .banner-wrapper {
    width: 100%;
    padding: px2rem(10);
    box-sizing: border-box;
    .banner-img {
      width: 100%;
      height: px2rem(160);
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }
  .recommend {
      margin-top: px2rem(20);
  }
  .featured {
      margin-top: px2rem(20);
  }
  .category-list-wrapper {
      margin-top: px2rem(20);
  }
  .categories {
      margin-top: px2rem(20);
  }
}
</style>