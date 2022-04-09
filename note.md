## 解决Invalid options in vue.config.js: "baseUrl" is not allowed报错
    vue-cli3.3之后 baseUrl被废弃了，使用publicPath替代了，将baseUrl换成publicPath即可解决
## npm ERR! code EPERM npm ERR! errno -4048
    其中一个原因：没有用管理员权限打开vscode
## windows naginx配置问题
    \会被解析为特殊字符，路径需要换成//  如：C://Users//lvjiaqi//Desktop//resource