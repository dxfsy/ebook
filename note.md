## 解决Invalid options in vue.config.js: "baseUrl" is not allowed报错
    vue-cli3.3之后 baseUrl被废弃了，使用publicPath替代了，将baseUrl换成publicPath即可解决
## npm ERR! code EPERM npm ERR! errno -4048
    其中一个原因：没有用管理员权限打开vscode
## windows naginx配置问题
    \会被解析为特殊字符，路径需要换成//  如：C://Users//lvjiaqi//Desktop//resource
## web-storage-cache插件
    此插件可以实现localstorage的功能，并且将对象传入时可以自动将对象转为字符串存储，读取时也可以将字符串重新转换为对象
## 开发时与上线时的服务器资源问题
    开发时与上线时的服务器资源路径不一样，可以用env.development来存储开发时的资源路径，引用资源时需要process.env.VUE_APP_...
## i18n进行国际化(切换语言)
    配置 :const i18n = new VueI18N({
            locale,
            messages
        })
    使用 :$t('book.xxx');
## bug1 记录阅读进度永远是倒数第二页
## bug2 渲染出来的电子书首页永远不是从封面开始，在首页也不能用手势往回翻页，但是如果是用section重新display渲染电子书，可以回去封面。





          // 实现翻页和展示菜单 低版本实现滑屏
      function a() {
        // this.rendition.on("touchstart", (event) => {
        //   this.touchStartX = event.changeTouches[0].clientX;
        //   this.touchStartTime = event.timeStamp;
        // });
        // this.rendition.on("touchend", (event) => {
        //   const offsetX = event.changeTouches[0].clientX - this.touchStartX;
        //   const time = event.timeStamp - this.touchStartTime;
        //   if (time < 500 && offsetX > 40) {
        //     this.prevPage();
        //   } else if (time < 500 && offsetX < -40) {
        //     this.nextPage();
        //   } else {
        //     this.toggleTitleAndMenu();
        //   }
        //   event.preventDefault();
        //   event.stopPropagation();
        // });
      }