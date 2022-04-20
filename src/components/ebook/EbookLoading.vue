<template>
  <div class="ebook-loading">
    <div class="ebook-loading-wrapper">
      <div
        class="ebook-loading-item"
        v-for="(item, index) in data"
        :key="index"
      >
        <div
          class="ebook-loading-line-wrapper"
          v-for="(subItem, subIndex) in item"
          :key="subIndex"
        >
          <div class="ebook-loading-line" ref="line"></div>
          <div class="ebook-loading-mask" ref="mask"></div>
        </div>
      </div>
      <div class="ebook-loading-center"></div>
    </div>
  </div>
</template>

<script>
import { px2rem } from "@/utils/utils";
export default {
  name: "EbookLoading",
  data() {
    return {
      data: [
        [{}, {}, {}],
        [{}, {}, {}],
      ],
      maskWidth: [
        { value: 0 },
        { value: 0 },
        { value: 0 },
        { value: 0 },
        { value: 0 },
        { value: 0 },
      ],
      lineWidth: [
        { value: 16 },
        { value: 16 },
        { value: 16 },
        { value: 16 },
        { value: 16 },
        { value: 16 },
      ],
      add: true,
      end: false,
    };
  },
  mounted() {
    this.task = setInterval(() => {
      this.$refs.mask.forEach((item, index) => {
        // 获取线条和mask的宽度
        const mask = this.$refs.mask[index];
        let maskWidth = this.maskWidth[index];
        const line = this.$refs.line[index];
        let lineWidth = this.lineWidth[index];

        // 对mask和line的长度进行调整（阶梯式）
        if (index === 0) {
            // 限制宽度不能超过16
          if (this.add && maskWidth.value<16) {
            maskWidth.value++;
            lineWidth.value--;
          } else if(!this.add&&lineWidth.value<16){
            lineWidth.value++;
            maskWidth.value--;
          }
        } else {
            // console.log(1);
            if(this.add && maskWidth.value<16) {
                // 获取上一个mask的宽度
                let preMaskWidth = this.maskWidth[index - 1];
                // 若上一个mask宽度大于8了，则开始增加自身mask的宽度
                if(preMaskWidth.value>=8) {
                    maskWidth.value++;
                    lineWidth.value--;
                }
            }else if(!this.add && lineWidth.value<16){
                let preLineWidth = this.lineWidth[index-1];
                if(preLineWidth.value>=8) {
                    maskWidth.value--;
                    lineWidth.value++;
                }
            }
        }

        // 将改变后的宽度赋值给对应的css样式
        mask.style.width = `${px2rem(maskWidth.value)}rem`;
        mask.style.flex = `0 0 ${px2rem(maskWidth.value)}rem`;
        line.style.width = `${px2rem(lineWidth.value)}rem`;
        line.style.flex = `0 0 ${px2rem(lineWidth.value)}rem`;

        // 判断当前是否是mask自增或自减的最后
        if (index === this.maskWidth.length - 1) {
          if (this.add) {
            if (maskWidth.value === 16) {
              this.end = true;
            }
          } else {
            if (maskWidth.value === 0) {
              this.end = true;
            }
          }
        }
        
        // 如果当前是mask自增（自减）的最后，则将mask改变为自减（自增），且end又赋值为false，表示新的变化开始
        if (this.end) {
          this.add = !this.add;
          this.end = false;
        }
      });
    }, 15);
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global";
.ebook-loading {
  position: relative;
  z-index: 400;
  width: px2rem(63);
  height: px2rem(40);
  background: transparent;
  border: px2rem(2) solid #d7d7d7;
  border-radius: px2rem(3);
  .ebook-loading-wrapper {
    display: flex;
    width: 100%;
    height: 100%;
    .ebook-loading-item {
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: px2rem(7) 0;
      box-sizing: border-box;
      .ebook-loading-line-wrapper {
        flex: 1;
        height: 100%;
        padding: 0 px2rem(7);
        box-sizing: border-box;
        @include left;
        .ebook-loading-line {
          flex: 0 0 px2rem(16);
          width: px2rem(16);
          height: px2rem(2);
          background: #d7d7d7;
        }
        .ebook-loading-mask {
          flex: 0 0 0;
          width: 0;
          height: px2rem(2);
        }
      }
    }
    .ebook-loading-center {
      position: absolute;
      left: 50%;
      top: 0;
      width: px2rem(1.5);
      height: 100%;
      background: #d7d7d7;
    }
  }
}
</style>