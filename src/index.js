const { getVersionMeta, getCheckScript, getVersionJS } = require('./getContent')
const { createAsset } = require('./utils')

function HtmlVersionCheckWebpackPlugin (options) {
  this.options = {
    enable: false,
    version: new Date().getTime(),
    htmlFileName: 'index.html',
    versionJSFileName: '__version__.js',
    ...options
  }
}

HtmlVersionCheckWebpackPlugin.prototype.apply = function (compiler) {
  if (!this.options.enable) {
    return
  }

  compiler.hooks.emit.tap('HtmlVersionCheck', (compilation) => {
    if (!compilation.assets[this.options.htmlFileName]) {
      return
    }

    writeVersionMetaAndScript.call(this, compilation)
    addVersionJS.call(this, compilation)
  })
}

function writeVersionMetaAndScript (compilation) {
  let indexHtmlContent = compilation.assets[this.options.htmlFileName].source()

  const headStartKeyword = '<head>'
  const headStartPosition = indexHtmlContent.indexOf(headStartKeyword) + headStartKeyword.length
  indexHtmlContent = indexHtmlContent.slice(0, headStartPosition) + getVersionMeta(this.options.version) + indexHtmlContent.slice(headStartPosition)

  const headEndKeyword = '</head>'
  const headEndPosition = indexHtmlContent.indexOf(headEndKeyword)
  indexHtmlContent = indexHtmlContent.slice(0, headEndPosition) + getCheckScript(this.options.version) + indexHtmlContent.slice(headEndPosition)

  compilation.assets[this.options.htmlFileName] = createAsset(indexHtmlContent)
}

function addVersionJS (compilation) {
  const versionJSContent = getVersionJS(this.options.version)

  compilation.assets[this.options.versionJSFileName] = createAsset(versionJSContent)
}

module.exports = HtmlVersionCheckWebpackPlugin
