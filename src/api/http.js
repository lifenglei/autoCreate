import axios from 'axios'
import qs from 'qs'
import url from '@/utils/url'
// const ua = window.navigator.userAgent.toUpperCase()
export default (params, type) => {
  if (!params.data) params.data = {}

  let config = {}
  config.url = params.url || {}
  config.withCredentials = true
  config.method = params.method || 'get'
  config.baseURL = params.baseURL || '/topic'

  // params.data.debug = url.getQuery('debug') || localStorage.getItem('debug')

  params.data.uid = params.data.uid || url.getQuery('uid') || window.pageInitialData.globalInfo['uid']
  params.data.xy_token =
    params.data.xy_token || url.getQuery('xy_token') || window.pageInitialData.globalInfo['xy_token']

  if (type === 'FormData') {
    // 解决文件上传问题
    config.headers = {
      'Content-Type': 'multipart/form-data'
    }
    config.method = 'post'
    config.data = params.data
  } else {
    if (config.method === 'get') {
      config.params = params.data || {}
      // config.params.sys = 0
    } else if (config.method === 'post') {
      config.headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      params.data.sys = params.data.sys || 0
      params.data.device_id = params.data.device_id || window.pageInitialData.globalInfo.device_id || ''
      config.data = qs.stringify(params.data || {})
    }
  }

  return new Promise((resolve, reject) => {
    axios(config).then(
      res => {
        if (!!res.data && +res.data.status === 401) {
          return window.myVue.$utils.goLogin()
        }
        if (!!res.data && +res.data.status === 1414148906) {
          let url = res.data.data.img_url
          let div = document.createElement('div')
          div.style =
            'width: 100vw;height: 100vh;position: fixed;top: 0px;left: 0px;display: flex;align-items: center;justify-content: center;background-color: rgba(0,0,0,0.6);'
          div.innerHTML = `<img style="width:80%" src="${url}" />`
          document.body.appendChild(div)
        }
        resolve(res.data)
      },
      error => reject(error)
    )
  })
}
