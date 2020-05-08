# html-version-check-webpack-plugin

用于检查 SPA 中的 index.html 是否缓存，并于缓存状态时执行更新操作的 webpack plugin。如由 vue 构建的 SPA 应用。 


## 使用方式

#### 1 安装插件

```bash
npm i html-version-check-webpack-plugin -D
```

#### 2 引入插件

> vue.config.js 引入

```javascript
module.exports = {
  chainWebpack: config => {
    const pluginParams = { enable: true }
    config.plugin('HtmlVersionCheck').use(require('html-version-check-webpack-plugin'), [pluginParams])
  }
}
```


## plugin params 说明

* `enable` `<Boolean>` 默认值 `false` - 是否启用插件
* `version` `<String>` 默认值 `new Date().getTime()` - 生成的版本号，作为检查版本是否一致的比较值
* `htmlFileName`  `<String>` 默认值 `index.html` - 项目构建的 html 文件名，插件将会根据文件名找到 html 并写入 version
* `versionJSFileName` `<String>` 默认值 `__version__.js` - 插件生成的用于服务端存储 version 的 js 文件名


## 相关内容

### index.html 的缓存问题

前端使用 webpack 打包后文件名通过加入 hash，来保证每次 dist 的文件名不一样，来应对部署新版本后的缓存问题。

但是若 index.html 被客户端缓存的话，就可能存在新版本 dist 部署后，客户端依然在运行旧版本 dist。

### 解决方式/设计思路

1. 客户端通过 index.html meta、服务端通过一个 js 文件，一同存储当前 dist 的 version。
2. 客户端每次加载 index.html 时都会执行一个 jsonp 去获取服务端 js 文件中的 version 版本并进行比对。
3. 若新的 dist 部署后，意味着服务端 js 文件携带的 version 也发生更新。此时若客户端加载了旧的 dist index.html，则会通过 jsonp 发现 version 不一致，于是执行 `location.reload(true)` 加载新的 dist。
