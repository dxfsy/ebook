<template>
  <div class="ebook-slide-contents">
    <!-- 目录搜索模块 -->
    <div class="slide-contents-search-wrapper">
      <div class="slide-contents-search-input-wrapper">
        <div class="slide-contents-search-input-icon">
          <span class="icon-search"></span>
        </div>
        <input
          class="slide-contents-search-input"
          type="text"
          :placeholder="$t('book.searchHint')"
          @click="showCancel"
          v-model="searchText"
          @keyup.enter.exact="searchForAllPage"
        />
      </div>
      <div
        class="slide-contents-search-cancel"
        v-if="searchVisible"
        @click="hideCancel()"
      >
        {{ $t("book.cancel") }}
      </div>
    </div>
    <!-- 目录图书模块 -->
    <div class="slide-contents-book-wrapper" v-show="!searchVisible">
      <div class="slide-contents-book-img-wrapper">
        <img :src="cover" class="slide-contents-book-img" />
      </div>
      <div class="slide-contents-book-info-wrapper">
        <div class="slide-contents-book-title">{{ metadata.title }}</div>
        <div class="slide-contents-book-author">{{ metadata.creator }}</div>
      </div>
      <div class="slide-contens-book-progress-wrapper">
        <div class="slide-contents-book-progress">
          <span class="progress">{{ progress }}%</span>
          <span class="progress-text">{{ $t("book.haveRead2") }}</span>
        </div>
        <div class="slide-contents-book-time">{{ getReadTimeText() }}</div>
      </div>
    </div>
    <!-- 目录列表 -->
    <Scroll
      class="slide-contents-list"
      :top="156"
      :bottom="48"
      ref="scroll"
      v-show="!searchVisible"
    >
      <div
        class="slide-contents-item"
        v-for="(item, index) in navigation"
        :key="index"
      >
        <div
          class="slide-contents-item-label"
          :class="{ selected: section === index }"
          :style="contentItemStyle(item)"
          @click="displayContent(item.href)"
        >
          {{ item.label }}
        </div>
        <div class="slide-contents-item-page"></div>
      </div>
    </Scroll>
    <!-- 搜索列表 -->
    <Scroll
      class="slide-search-list"
      :top="66"
      :bottom="48"
      v-show="searchVisible"
    >
      <div
        class="slide-search-item"
        v-for="(item, index) in searchList"
        :key="index"
        v-html ="item.excerpt"
        v-show="searchList"
        @click="displayContent(item.cfi,true)"
      >
      </div>
      <div class="slide-search-item" v-show="!searchList">
        搜索内容为空 或 未进行搜索
      </div>
    </Scroll>
  </div>
</template>

<script>
import { ebookMixin } from "@/utils/mixin";
import { px2rem } from "@/utils/utils";
import Scroll from "@/components/common/Scroll.vue";
export default {
  name: "EbookSlideContents",
  mixins: [ebookMixin],
  data() {
    return {
      searchVisible: false,
      searchText: "",
      searchList: null,
    };
  },
  components: {
    Scroll,
  },
  methods: {
    // epubjs官方的全文搜索
    doSearch(q) {
      return Promise.all(
        this.currentBook.spine.spineItems.map((item) =>
          item
            .load(this.currentBook.load.bind(this.currentBook))
            .then(item.find.bind(item, q))
            .finally(item.unload.bind(item))
        )
      ).then((results) => Promise.resolve([].concat.apply([], results)));
    },
    // 隐藏取消按钮
    hideCancel() {
      this.searchVisible = false;
      this.searchText = "";
      this.searchList = null;
    },
    // 显示取消按钮
    showCancel() {
      this.searchVisible = true;
    },
    // 目录缩进设置
    contentItemStyle(item) {
      return {
        marginLeft: `${px2rem(15 * item.level)}rem`,
      };
    },
    // 点击跳转到对应页面进行展示
    displayContent(target,highlight = false) {
      this.display(target, () => {
        this.toggleMenu();
        if(highlight) {
          // 高亮显示api
          this.currentBook.rendition.annotations.highlight(target);
        }
      });
    },
    // 全文搜索
    searchForAllPage() {
      // 需要判断字符串是否为空，如果为空检测会对整个电子书进行遍历，十分耗时耗资源
      const trimSearchText = this.searchText.trim();
      if (trimSearchText && trimSearchText.length > 0) {
        this.doSearch(trimSearchText).then((list) => {
          this.searchList = list;
          this.searchList.map(item=> {
            item.excerpt = item.excerpt.replace(trimSearchText,`<span class="content-search-text">
            ${trimSearchText}</span>`)
            return item;
          })
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global";
.ebook-slide-contents {
  width: 100%;
  font-size: 0;
  .slide-contents-search-wrapper {
    display: flex;
    width: 100%;
    height: px2rem(36);
    margin: px2rem(20) 0 px2rem(10) 0;
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-contents-search-input-wrapper {
      flex: 1;
      @include center;
      .slide-contents-search-input-icon {
        font-size: px2rem(12);
        flex: 0 0 px2rem(28);
        @include center;
      }
      .slide-contents-search-input {
        flex: 1;
        width: 100%;
        height: px2rem(32);
        background: transparent;
        border: none;
        &:focus {
          outline: none;
        }
      }
    }
    .slide-contents-search-cancel {
      flex: 0 0 px2rem(50);
      font-size: px2rem(14);
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
  .slide-contents-book-wrapper {
    display: flex;
    width: 100%;
    height: px2rem(90);
    padding: px2rem(10) px2rem(15) px2rem(20) px2rem(15);
    box-sizing: border-box;
    .slide-contents-book-img-wrapper {
      flex: 0 0 px2rem(45);
      .slide-contents-book-img {
        width: px2rem(45);
        height: px2rem(60);
      }
    }
    .slide-contents-book-info-wrapper {
      flex: 1;
      padding: 0 px2rem(10);
      .slide-contents-book-title {
        // 计算中间部分实际的宽度（精确宽度）
        // 375*0.85-30-20-45-70 = 153.75
        width: px2rem(153.75);
        font-size: px2rem(14);
        line-height: px2rem(16);
        margin-bottom: px2rem(5);
        // 这里的文字省略需要有宽度才能有效果

        // 这里实现多行文字省略（超出指定多行就省略文字）
        @include mutilEllipsis(2);
      }
      .slide-contents-book-author {
        width: px2rem(153.75);
        font-size: px2rem(12);
        @include Ellipsis;
      }
    }
    .slide-contens-book-progress-wrapper {
      flex: 0 0 px2rem(70);
      padding: px2rem(10) 0;
      .slide-contents-book-progress {
        .progress {
          font-size: px2rem(14);
        }
        .progress-text {
          font-size: px2rem(12);
        }
      }
      .slide-contents-book-time {
        font-size: px2rem(12);
        margin-top: px2rem(5);
      }
    }
  }
  .slide-contents-list {
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-contents-item {
      padding: px2rem(20) 0;
      .slide-contents-item-label {
        font-size: px2rem(14);
        line-height: px2rem(18);
        @include Ellipsis;
      }
      .slide-contents-item-page {
      }
    }
  }
  .slide-search-list {
    padding: 0 px2rem(15);
    width: 100%;
    box-sizing: border-box;
    .slide-search-item {
      font-size: px2rem(14);
      padding: px2rem(20) 0;
      line-height: px2rem(16);
    }
  }
}
</style>