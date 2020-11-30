;(function() {
  function loadBlobImg(url) {
    return new Promise(function(resolve) {
      caches.open('saveBlobImg').then(function(cache) {
        const req = new Request(url)
        cache.match(req).then(function(res) {
          if (!res) {
            fetch(req).then(function(r) {
              if (!r.ok) {
                throw new TypeError('图片加载失败')
              }
              cache.put(url, r.clone())
              r.blob().then(function(b) {
                resolve(window.URL.createObjectURL(b))
              })
            })
          } else {
            res.blob().then(function(b) {
              resolve(window.URL.createObjectURL(b))
            })
          }
        })
      })
    })
  }

  function initGlobalCacheBlob() {
    if ('caches' in window) {
      var setAttribute = Element.prototype.setAttribute
      Element.prototype.setAttribute = function() {
        let eThis = this
        let args = [].slice.call(arguments)
        if (eThis.localName === 'img' && args[0] === 'src' && !!args[1] && eThis.hasAttribute('cacheBlob')) {
          let w = eThis.offsetWidth || eThis.getAttribute('cacheBlob_w')
          let h = eThis.offsetHeight || eThis.getAttribute('cacheBlob_h')
          if (args[1].indexOf('http') === 0 && args[1].indexOf('?') === -1 && !!w && !!h) {
            args[1] += '?imageView2/1/w/' + w * 2 + '/h/' + h * 2 + '/q/90'
          }
          loadBlobImg(args[1]).then(function(burl) {
            args[1] = burl
            setAttribute.apply(eThis, args)
          })
        } else {
          setAttribute.apply(eThis, args)
        }
      }
    }
  }
  initGlobalCacheBlob()
  window.loadBlobImg = loadBlobImg
})()
