function createAsset (content) {
  return {
    source () {
      return content
    },
    size () {
      return content.length
    }
  }
}

module.exports = {
  createAsset
}
