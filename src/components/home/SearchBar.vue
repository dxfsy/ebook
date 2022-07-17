<template>
  <div>
    <div
      class="search-bar"
      :class="{ 'hide-title': IsSlideHome, 'show-shadow': shadowVisible }"
    >
      <div
        class="search-bar-title-wrapper"
        :class="{ 'hide-title': IsSlideHome }"
      >
        <div
          class="title-icon-back-wrapper"
          :class="{ 'back-move': IsSlideHome }"
          @click="hideHotSearch"
        >
          <span class="icon-back icon"></span>
        </div>
        <transition name="title-move">
          <div class="search-bar-title-text" v-show="!IsSlideHome">
            <span class="search-bar-title title">{{ $t("home.title") }}</span>
          </div>
        </transition>
        <transition name="title-move">
          <div
            class="title-icon-shake-wrapper"
            v-show="!IsSlideHome"
            @click="showCard"
          >
            <span class="icon-shake icon"></span>
          </div>
        </transition>
      </div>
      <div
        class="search-bar-search-wrapper"
        :class="{ 'search-move ': IsSlideHome }"
      >
        <div class="search-bar-icon-wrapper">
          <span class="icon-search icon"></span>
        </div>
        <div class="search-bar-input-wrapper">
          <input
            type="text"
            class="search-bar-input"
            :placeholder="$t('home.hint')"
            v-model="searchText"
            @click="showHotSearch"
            @keyup.13.exact="search"
          />
        </div>
      </div>
    </div>
    <transition name="hot-search-slide">
      <HotSearchList
        v-show="searchVisible"
        class="hot-search-list"
        ref="hotsearch"
      />
    </transition>
  </div>
</template>

<script>
import HotSearchList from "@/components/home/HotSearchList";
import { storeHomeMixin } from "@/utils/mixin";

export default {
  name: "SearchBar",
  mixins: [storeHomeMixin],
  data() {
    return {
      searchText: "",
      IsSlideHome: false,
      shadowVisible: false,
      searchVisible: false,
    };
  },
  watch: {
    offsetY(offsetY) {
      if (offsetY > 0) {
        this.hideTitle();
        this.showShadow();
      } else {
        this.showTitle();
        this.hideShadow();
      }
    },
    hotSearchOffsetY(offsetY) {
      if (offsetY > 0) {
        this.showShadow();
      } else {
        this.hideShadow();
      }
    },
  },
  components: {
    HotSearchList,
  },
  methods: {
    showHotSearch() {
      this.hideTitle();
      this.hideShadow();
      this.searchVisible = true;
      this.$nextTick(() => {
        this.$refs.hotsearch.reset();
      });
    },
    hideHotSearch() {
      if (!this.searchVisible) {
        this.$router.push({
          path:'/store/shelf'
        })
      } else {
        this.searchVisible = false;
        if (this.offsetY > 0) {
          this.hideTitle();
          this.showShadow();
        } else {
          this.showTitle();
          this.hideShadow();
        }
      }
    },
    showTitle() {
      this.IsSlideHome = false;
    },
    hideTitle() {
      this.IsSlideHome = true;
    },
    hideShadow() {
      this.shadowVisible = false;
    },
    showShadow() {
      this.shadowVisible = true;
    },
    showCard() {
      this.$store.dispatch("setFlapCardVisible", true);
    },
    search() {
      this.$router.push({
        path: "/store/list",
        query: {
          keyword: this.searchText,
        },
      });
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global";
.search-bar {
  height: px2rem(94);
  &.hide-title {
    height: px2rem(56);
  }
  &.show-shadow {
    box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, 0.1);
  }
  transition: all 0.2s linear;
  .search-bar-title-wrapper {
    display: flex;
    height: px2rem(42);
    &.hide-title {
      height: px2rem(52);
    }
    .title-icon-back-wrapper {
      flex: 0 0 px2rem(20);
      height: px2rem(42);
      @include center;
      margin-left: px2rem(10);
      &.back-move {
        margin-top: px2rem(6);
      }
      transition: all $animationTime $animationType;
    }
    .search-bar-title-text {
      flex: 1;
      width: 100%;
      height: px2rem(42);
      @include center;
    }
    .title-icon-shake-wrapper {
      flex: 0 0 px2rem(20);
      height: px2rem(42);
      @include center;
      margin-right: px2rem(10);
    }
  }
  .search-bar-search-wrapper {
    position: relative;
    bottom: 0;
    left: 0;
    z-index: 150;
    height: px2rem(52);
    background-color: #f4f4f4;
    margin: px2rem(4) px2rem(10);
    box-sizing: border-box;
    border-radius: px2rem(50);
    border: px2rem(1) solid #eee;
    display: flex;
    &.search-move {
      bottom: px2rem(52);
      left: px2rem(42);
      width: 80%;
      height: px2rem(45);
    }
    transition: all $animationTime $animationType;
    .search-bar-icon-wrapper {
      flex: 0 0 px2rem(30);
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-right: px2rem(5);
    }
    .search-bar-input-wrapper {
      flex: 1;
      @include center;
      .search-bar-input {
        width: 100%;
        height: px2rem(40);
        background-color: transparent;
        font-size: px2rem(14);
        border: none;
        &:focus {
          outline: none;
        }
        &::placeholder {
          color: #ccc;
        }
      }
    }
  }
}
.hot-search-list {
  margin-top: px2rem(3);
}
</style>