<template>
  <div class="shelf-search-wrapper" :class="{'search-top': ifInputClicked,'hide-shadow': ifHideShadow}" 
    >
    <!-- 搜索栏 -->
    <div class="shelf-search" :class="{ 'search-top': ifInputClicked }">
      <!-- 搜索框 -->
      <div class="search-wrapper">
        <div class="icon-search-wrapper">
          <span class="icon-search icon"></span>
        </div>
        <div class="search-input-wrapper" @click="onSearchClick">
          <input
            class="search-input"
            type="text"
            :placeholder="$t('shelf.search')"
            v-model="searchText"
            @keyup.enter = "searchBook"
          />
        </div>
        <div
          class="icon-clear-wrapper"
          v-show="searchText.length > 0"
          @click="clearSearchText"
        >
          <span class="icon-close-circle-fill"></span>
        </div>
      </div>
      <!-- 中英文 -->
      <div
        class="icon-locale-wrapper"
        v-if="!ifInputClicked"
        @click="switchLocale"
      >
        <span class="icon-cn icon" v-if="lang === 'cn'"></span>
        <span class="icon-en icon" v-else></span>
      </div>
      <!-- 取消按钮 -->
      <div class="cancel-btn-wrapper" @click="onCancelClick" v-else>
        <span class="cancel-text">{{ $t("shelf.cancel") }}</span>
      </div>
    </div>
    <!-- 排序列表 -->
    <transition name="hot-search-slide">
      <div class="shelf-search-tab-wrapper" v-show="ifInputClicked">
        <div
          class="shelf-search-tab-item"
          v-for="item in tabs"
          :key="item.id"
          @click="onTabClick(item.id)"
        >
          <span
            class="shelf-search-tab-text"
            :class="{ 'is-selected': item.id === selectedTab }"
            >{{ item.text }}</span
          >
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { setLocalStorage } from "@/utils/localStorage";
import { storeShelfMixin } from "@/utils/mixin";
// import { flatShelfList } from '@/utils/store';

export default {
  mixins: [storeShelfMixin],
  data() {
    return {
      ifInputClicked: false,
      searchText: "",
      selectedTab: 1,
      ifHideShadow:true
    };
  },
  computed: {
    lang() {
      return this.$i18n.locale;
    },
    tabs() {
      return [
        {
          id: 1,
          text: this.$t("shelf.default"),
        },
        {
          id: 2,
          text: this.$t("shelf.progress"),
        },
        {
          id: 3,
          text: this.$t("shelf.purchase"),
        },
      ];
    }, 
  },
  methods: {
    onSearchClick() {
      this.ifInputClicked = true;
      this.setShelfTitleVisible(false);
    },
    onCancelClick() {
      this.ifInputClicked = false;
      this.setShelfTitleVisible(true);
    },
    switchLocale() {
      // if(this.$i18n.locale === 'en') {
      //   this.$i18n.locale = 'cn'
      // }else {
      //   this.$i18n.locale = 'en'
      // }
      this.$i18n.locale = this.$i18n.locale === "en" ? "cn" : "en";
      setLocalStorage("locale", this.$i18n.locale);
    },
    clearSearchText() {
      this.searchText = "";
    },
    onTabClick(id) {
      this.selectedTab = id;
    },
    searchBook() {
      this.flatShelfList(this.searchText,this.shelfList)
      this.$router.push({
        path:'/store/list',
        query: {
          keyword:'STORE_LIST_SEARCH'
        }
      })
    }
  },
  watch: {
    offsetY(offsetY) {
      if(offsetY>0 && this.ifInputClicked) {
        this.ifHideShadow = false;
      }else {
        this.ifHideShadow = true;
      }
    } 
  },

};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global";
.shelf-search-wrapper {
  position: relative;
  z-index: 105;
  width: 100%;
  height: px2rem(94);
  font-size: px2rem(16);
  background: white;
  box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0,0,0,.1);
  transition: box-shadow $animationTime;
  &.hide-shadow {
    box-shadow: none;
  }
  &.search-top {
    position: fixed;
    top: 0;
    left: 0;
  }
  .shelf-search {
    display: flex;
    position: absolute;
    top: px2rem(42);
    left: 0;
    z-index: 105;
    width: 100%;
    height: px2rem(52);
    transition: top $animationTime linear;
    &.search-top {
      top: 0;
    }
    .search-wrapper {
      display: flex;
      flex: 1;
      margin: px2rem(8) 0 px2rem(8) px2rem(10);
      border: px2rem(1) solid #ccc;
      border-radius: px2rem(3);
      .icon-search-wrapper {
        flex: 0 0 px2rem(22);
        @include right;
        .icon-search {
          font-size: px2rem(12);
        }
      }
      .search-input-wrapper {
        flex: 1;
        padding: 0 px2rem(10);
        box-sizing: border-box;
        @include center;
        .search-input {
          width: 100%;
          font-size: px2rem(14);
          border: none;
          color: #333;
          &:focus {
            outline: none;
          }
          &::-webkit-input-placeholder {
            font-size: px2rem(14);
            color: #ccc;
          }
        }
      }
      .icon-clear-wrapper {
        flex: 0 0 px2rem(24);
        @include left;
        .icon-close-circle-fill {
          font-size: px2rem(14);
          color: #ccc;
        }
      }
    }
    .icon-locale-wrapper {
      flex: 0 0 px2rem(55);
      @include center;
      .icon-cn,
      .icon-en {
        font-size: px2rem(22);
        color: #666;
      }
    }
    .cancel-btn-wrapper {
      flex: 0 0 px2rem(55);
      @include center;
      .cancel-text {
        font-size: px2rem(14);
        color: $color-blue;
      }
    }
  }
  .shelf-search-tab-wrapper {
    position: absolute;
    top: px2rem(52);
    height: px2rem(42);
    width: 100%;
    display: flex;
    .shelf-search-tab-item {
      flex: 1;
      @include center;
      .shelf-search-tab-text {
        font-size: px2rem(12);
        color: #999;
        // @include center;
        &.is-selected {
          color: $color-blue;
        }
      }
    }
  }
}
</style>