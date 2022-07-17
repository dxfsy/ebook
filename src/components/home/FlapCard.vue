<template>
  <div class="flap-card-wrapper">
    <div class="flap-card-bg" :class="{ RunAnimation: runFlapCardAnimation }" v-show="runFlapCardAnimation">
      <div
        class="flap-card"
        v-for="(item, index) in flapCardList"
        :key="index"
        :style="`zIndex:${item.zIndex}`"
      >
        <div class="flap-card-circle">
          <div
            class="flap-card-semi-circle flap-card-semi-circle-left"
            :style="semiCircleStyle(item, 'left')"
            ref="left"
          ></div>
          <div
            class="flap-card-semi-circle flap-card-semi-circle-right"
            :style="semiCircleStyle(item, 'right')"
            ref="right"
          ></div>
        </div>
      </div>
      <div class="point-wrapper">
        <div
          class="point"
          v-for="item in pointList"
          :key="item"
          :class="{ animation: runPointAnimation }"
        ></div>
      </div>
    </div>
    <div class="book-card" :class="{'animation': runBookCardAnimation}" v-show="runBookCardAnimation">
      <div class="book-card-wrapper">
        <div class="img-wrapper">
          <img class="img" :src="data ? data.cover : ''">
        </div>
        <div class="content-wrapper">
          <div class="content-title">{{data ? data.title : ''}}</div>
          <div class="content-author sub-title-medium">{{data ? data.author : ''}}</div>
          <div class="content-category">{{categoryText()}}</div>
        </div>
        <div class="read-btn" @click.stop="showBookDetail(data)">{{$t('home.readNow')}}</div>
      </div>
    </div>
    <div class="close-btn-wrapper">
      <span class="icon-close" @click="close"></span>
    </div>
  </div>
</template>

<script>
import { storeHomeMixin } from "@/utils/mixin";
import { flapCardList,categoryText } from "@/utils/store";
export default {
  name: "FlapCard",
  mixins: [storeHomeMixin],
  props:{
    data:Object
  },
  data() {
    return {
      flapCardList,
      //   卡片动画的正面背面指针
      front: 0,
      back: 1,
      intervalTime: 25, // 卡片动画的执行频率
      runFlapCardAnimation: false,
      pointList: null,
      runPointAnimation: false,
      runBookCardAnimation:false,
    };
  },
  methods: {
    // 关闭卡片窗口
    close() {
      this.$store.dispatch("setFlapCardVisible", false);
      this.stopAnimation();
      this.runFlapCardAnimation = false;
      if(this.task) {
        clearInterval(this.task);
      }
      if(this.timeout) {
        clearTimeout(this.timeout);
      }
    },
    semiCircleStyle(item, dir) {
      return {
        backgroundColor: `rgb(${item.r},${item.g},${item.b})`,
        backgroundImage: dir === "left" ? item.imgLeft : item.imgRight,
        backgroundSize: item.backgroundSize,
      };
    },
    rotate(index, type) {
      const item = this.flapCardList[index];
      let dom;
      if (type === "front") {
        dom = this.$refs.right[index];
      } else {
        dom = this.$refs.left[index];
      }
      dom.style.transform = `rotateY(${item.rotateDegree}deg)`;
      dom.style.backgroundColor = `rgb(${item.r},${item._g},${item.b})`;
    },
    flapCardRotate() {
      const front = flapCardList[this.front];
      const back = flapCardList[this.back];
      front.rotateDegree += 10;
      front._g -= 5;
      back.rotateDegree -= 10;
      if (back.rotateDegree < 90) {
        back._g += 5;
      }
      if (front.rotateDegree === 90 && back.rotateDegree === 90) {
        back.zIndex += 2;
      }
      this.rotate(this.front, "front");
      this.rotate(this.back, "back");
      if (front.rotateDegree === 180 && back.rotateDegree === 0) {
        this.next();
      }
    },
    // 开始动画，开启定时任务（调用flapCardRotate操作dom）
    startFlapCardAnimation() {
      this.prepare();
      this.task = setInterval(() => {
        this.flapCardRotate();
      }, this.intervalTime);
      this.timeout = setTimeout(() => {
        this.stopAnimation();
        this.runBookCardAnimation = true;
      }, 2500);
    },
    // 停止播放动画
    stopAnimation() {
      if (this.task) {
        clearInterval(this.task);
      }
      this.reset();
    },
    // 重置动画元素位置
    reset() {
      this.front = 0;
      this.back = 1;
      this.flapCardList.forEach((item, index) => {
        item.zIndex = 100 - index;
        item._g = item.g;
        item.rotateDegree = 0;
        this.rotate(index, "front");
        this.rotate(index, "back");
      });
      this.runBookCardAnimation = false;
      this.runFlapCardAnimation = false;
      this.runPointAnimation = false;
    },
    // 给背面翻转动画定义初始状态（初始状态在180deg,与需要翻转的正面刚好是重合的）
    prepare() {
      const back = flapCardList[this.back];
      back.rotateDegree = 180;
      back._g -= 9 * 5;
      this.rotate(this.back, "back");
    },
    // 动画播放完一轮，进行下一轮播放（重置本次操作的dom，将指针指向下一个，并且改变zindex的值
    // 以确保当前执行完的dom不会覆盖在接下来要执行的dom上面，导致动画效果无法显示）
    next() {
      const front = flapCardList[this.front];
      const back = flapCardList[this.back];
      front._g = front.g;
      front.rotateDegree = 0;
      back._g = back.g;
      back.rotateDegree = 0;
      this.rotate(this.front, "front");
      this.rotate(this.back, "back");

      this.front++;
      this.back++;
      const len = this.flapCardList.length;
      if (this.front >= len) {
        this.front = 0;
      }
      if (this.back >= len) {
        this.back = 0;
      }

      this.flapCardList.forEach((item, index) => {
        item.zIndex = 100 - ((index - this.front + len) % len);
      });
      this.prepare();
    },
    startPointAnimation() {
      this.runPointAnimation = true;
      setTimeout(() => {
        this.runPointAnimation = false;
      }, 750);
    },
    runAnimation() {
      this.runFlapCardAnimation = true;
      this.startFlapCardAnimation();
      this.startPointAnimation();
    },
    categoryText(){
      if(this.data) {
        categoryText(this.data.category,this);
      }
    }
  },
  watch: {
    flapCardVisible(v) {
      if (v) {
        this.runAnimation();
      }
    },
  },
  created() {
    this.pointList = [];
    for (let i = 0; i < 17; i++) {
      this.pointList.push(`point${i}`);
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global";
@import "@/assets/styles/flapCard";
.flap-card-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  @include center;

  .flap-card-bg {
    width: px2rem(64);
    height: px2rem(64);
    background-color: #fff;
    border-radius: px2rem(5);
    transform: scale(0);
    opacity: 0;
    &.RunAnimation {
      animation: flap-card-move 0.3s ease-in both;
    }
    @keyframes flap-card-move {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      50% {
        transform: scale(1.2);
        opacity: 1;
      }
      75% {
        transform: scale(0.9);
        opacity: 1;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
    .flap-card {
      @include absCenter;
      width: px2rem(48);
      height: px2rem(48);
      .flap-card-circle {
        width: 100%;
        height: 100%;
        display: flex;
        .flap-card-semi-circle {
          flex: 0 0 50%;
          width: 50%;
          height: 100%;
          background-repeat: no-repeat;
          backface-visibility: hidden;
        }
        .flap-card-semi-circle-left {
          border-radius: px2rem(48) 0 0 px2rem(48);
          background-position: center right;
          transform-origin: right;
        }
        .flap-card-semi-circle-right {
          border-radius: 0 px2rem(48) px2rem(48) 0;
          background-position: center left;
          transform-origin: left;
        }
      }
    }
    .point-wrapper {
      z-index: 1500;
      @include absCenter;
      .point {
        border-radius: 50%;
        @include absCenter;
        &.animation {
          @for $i from 1 to length($moves) {
            &:nth-child(#{$i}) {
              @include move($i);
            }
          }
        }
      }
    }
  }
  .book-card {
      position: relative;
      width: 65%;
      max-width: px2rem(400);
      box-sizing: border-box;
      border-radius: px2rem(15);
      background: white;
      &.animation {
        animation: scale .3s ease-in both;
        @keyframes scale {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      }
      .book-card-wrapper {
        width: 100%;
        height: 100%;
        margin-bottom: px2rem(30);
        @include columnTop;
        .img-wrapper {
          width: 100%;
          margin-top: px2rem(20);
          @include center;
          .img {
            width: px2rem(90);
            height: px2rem(130);
          }
        }
        .content-wrapper {
          padding: 0 px2rem(20);
          margin-top: px2rem(15);
          .content-title {
            color: #333;
            font-weight: bold;
            font-size: px2rem(18);
            line-height: px2rem(20);
            max-height: px2rem(40);
            text-align: center;
            @include mutilEllipsis(2)
          }
          .content-author {
            margin-top: px2rem(10);
            text-align: center;
          }
          .content-category {
            color: #999;
            font-size: px2rem(14);
            margin-top: px2rem(10);
            text-align: center;
          }
        }
        .read-btn {
          position: absolute;
          bottom: 0;
          left: 0;
          z-index: 1100;
          width: 100%;
          border-radius: 0 0 px2rem(15) px2rem(15);
          padding: px2rem(12) 0;
          text-align: center;
          color: white;
          font-size: px2rem(14);
          background: $color-blue;
        }
      }
    }
  .close-btn-wrapper {
    position: absolute;
    bottom: px2rem(30);
    width: 100%;
    @include center;
    color: white;

    .icon-close {
      width: px2rem(45);
      height: px2rem(45);
      border-radius: 50%;
      background-color: #333;
      font-size: px2rem(25);
      @include center;
    }
  }
}
</style>