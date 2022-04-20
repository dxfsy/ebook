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
## v-show和v-if的区别：
    1）加载时，v-if性能更好，因为v-if不需要加载不显示的dom，而v-show需要全部加载

    2）切换时，v-show性能更好，因为切换时，v-show只需要修改display属性，而v-if需要加载整个dom所以最终选择哪一条看你是否需要频繁切换，如果频繁切换，选v-show，如果对首屏打开速度比较敏感选v-if
## bug1 记录阅读进度永远是倒数第二页
## bug2 渲染出来的电子书首页永远不是从封面开始，在首页也不能用手势往回翻页，但是如果是用section重新display渲染电子书，可以回去封面。

## apply会将数组变为参数逐一进行传递,可以实现数组的降维
    const a = [[1,2,3],[4,5,6,7,8]]
    console.log([].concat.apply([],a)); //[1, 2, 3, 4, 5, 6, 7, 8]





