export default {
  getQuery(key) {
    var reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)')
    var res = window.location.search.substr(1).match(reg)
    return res != null ? window.filterXSS(decodeURIComponent(res[2])) : null
  }
}
