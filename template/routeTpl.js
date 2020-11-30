module.exports = {
  routeTpl: (fileTitle, pageArr) => {
    let str = ''
    pageArr.forEach(name => {
      str += `
          /**
           * @api 接口文档
           * @wiki 贴需求地址
           * @author 姓名
           * @param 参数
           * @url 页面地址
           */
          {
              path: '/${fileTitle}/${name}',
              name: '${fileTitle}-${name}',
              component: () => import('@/views/${fileTitle}/${name}'),
              meta: {
                st: { 
                  page_name: '',
                  page_info:{

                  } 
                }
              }
          },
       `
    })
    return `
    export default [
      ${str}
    ]`
  }
}
