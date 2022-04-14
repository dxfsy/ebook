<template>
  <div class="ebook-slide-contents">
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
        />
      </div>
      <div class="slide-contents-search-cancel" v-if="searchCancelisible" @click="hideCancel()">{{$t('book.cancel')}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EbookSlideContents",
  data(){
      return {
          searchCancelisible: false,
      }
  },
  methods: {
      hideCancel(){
          this.searchCancelisible = false;
      },
      showCancel(){
          this.searchCancelisible = true;
      }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/global';
    .ebook-slide-contents {
        width: 100%;
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
                .slide-contents-search-input{
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
    }
</style>