function getVersionMeta (version) {
  return `
    <meta name="version" content="${version}">
  `
}

function getCheckScript (version) {
  return `
    <script>
      function versionCheck () {
        if (!window.getVersion) {
          window.getVersion = JsonpVersion => {
            const storageKey = '__html_version_check_webpack_plugin__'
            if (JsonpVersion === localStorage.getItem(storageKey)) {
              console.log('版本' + JsonpVersion + '已经触发过刷新了')
              return
            }
            
            if (JsonpVersion !== "${version}") {
              localStorage.setItem(storageKey, JsonpVersion)
              location.reload(true)
            }
          }
        }

        const versionScript = document.createElement('script')
        versionScript.src = './__version__.js?now=' + new Date().getTime()
        document.querySelector('head').appendChild(versionScript)
      }
      
      versionCheck()
    </script>
  `
}

function getVersionJS (version) {
  return `
    getVersion("${version}")
  `
}

module.exports = {
  getVersionMeta,
  getCheckScript,
  getVersionJS
}
