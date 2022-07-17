<template>
  <div class="shelf-item-category">
    <div class="shelf-item-category-list" v-if="data.itemList.length>0">
      <div class="shelf-item-category-item" v-for="item in data.itemList" :key="item.id">
        <img class="shelf-item-category-item-cover" :src="item.cover" alt="">
      </div>
    </div>
    <div class="shelf-item-category-bg" v-else>
      <span class="icon-book2"></span>
    </div>
  </div>
</template>

<script> 
export default {
  name:"ShelfItemCategory",
  props: {
    data: Object
  },
  // mounted(){
  //   console.log(this.data);
  // }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global";
.shelf-item-category{
  width: 100%;
  height: 100%;
  .shelf-item-category-list {
    display: flex;
    flex-flow: row wrap;
    align-content: flex-start;
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: px2rem(5) px2rem(2.5);
    box-sizing: border-box;
    .shelf-item-category-item{
      flex: 0 0 33.33%;
      width: 33.33%;
      height: 33.33%;
      padding: px2rem(2.5);
      box-sizing: border-box;
      .shelf-item-category-item-cover{
        width: 100%;
        height: 100%;
      }
    }
  }
  .shelf-item-category-bg{
      width: 100%;
      height: 100%;
      background: #fff;
      font-size: px2rem(30);
      color: #ccc;
      @include center;
  }
}
</style>