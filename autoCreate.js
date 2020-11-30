#!/usr/bin/env node

const chalk = require('chalk')
const path = require('path')
const symbols = require('log-symbols')
const fs = require('fs')
var child_process = require('child_process')
const resolve = (...file) => path.resolve(__dirname, ...file)
const log = message => console.log(chalk.green(`${message}`))
const successLog = message => console.log(chalk.keyword('orange')(`${message}`))
const errorLog = error => console.log(chalk.red(`${error}`))
const program = require('commander')
const inquirer = require('inquirer')
var _ = require('lodash')
var fuzzy = require('fuzzy')
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))
// 引入默认的模板
// 为了统一规范 尽量避免修改
const {vueTemplate} = require('./template/template')
const {routeTpl} = require('./template/routeTpl')
/**
 * @description:生成需要的文件 
 * @param {*} path
 * @param {*} data
 * @param {*} flag
 * @return {*}
 */
const generateFile = (path, data,flag=false) => {
  if (fs.existsSync(path)&&flag==false) {
    errorLog(`${path}文件已存在`)
    return
  }
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, 'utf8', err => {
      if (err) {
        errorLog(err.message)
        reject(err)
      } else {
        resolve(true)
      }
    })
  })
}
/**
 * @description: 递归创建目录
 * @param {*} directory
 * @param {*} callback
 * @return {*}
 */
function mkdirs(directory, callback) {
  var exists = fs.existsSync(directory)
  if (exists) {
    callback()
  } else {
    mkdirs(path.dirname(directory), function() {
      fs.mkdirSync(directory)
      callback()
    })
  }
}
/** 
 * @description: 创建文件夹
 * @param {*} directory
 * @return {*}
 */
function dotExistDirectoryCreate(directory) {
  return new Promise(resolve => {
    mkdirs(directory, function() {
      resolve(true)
    })
  })
}

/**
 * @description: 打开浏览器方法 前提是项目已经运行
 * @param {*} platform
 * @param {*} componentName
 * @return {*}
 */
function oPenBrowser(platform, componentName) {
  var url = 'http://127.0.0.1'
  var port = 3000
  var cmd = ''
  return new Promise(resolve => {
    switch (platform) {
      case 'win32':
        cmd = 'start'
        break
      case 'linux':
        cmd = 'xdg-open'
        break
      case 'darwin':
        cmd = 'open'
        break
    }
    resolve()
    child_process.exec(cmd + ' ' + url + ':' + port + '/' + componentName + '/index')
  })
}
/**
 * @description: 删除文件夹  递归删除
 * @param {*} url
 * @return {*}
 */
function deleteFolderRecursive(url) {
  return new Promise((resolve, reject) => {
    var files = []
    if (fs.existsSync(url)) {
      let stat = fs.lstatSync(url)
      if (stat.isDirectory()) {
        files = fs.readdirSync(url)
        files.forEach(function(file, index) {
          var curPath = path.join(url, file)
          if (fs.statSync(curPath).isDirectory()) {
            deleteFolderRecursive(curPath)
          } else {
            fs.unlinkSync(curPath)
          }
        })
        fs.rmdirSync(url)
      } else {
        fs.unlinkSync(url)
      }
      resolve()
    } else {
      reject()
      errorLog('给定的路径不存在，请给出正确的路径')
    }
  })
}
/**
 * @description: type为1 读取文件  type为2读取路由
 * @param {*} type
 * @return {*}
 */
function getListByType(type=1){
  let activityList = []
  if(type===1){
    const files = fs.readdirSync('./src/views')
    files.forEach(function(item, index) {
      let stat = fs.lstatSync('./src/views/' + item)
      if (stat.isDirectory() === true) {
        activityList.push(item)
      }
    })
    return activityList
  }else{
    const routeFile = fs.readdirSync('./src/routers')
    routeFile.forEach(function(item, index) {
      let stat = fs.lstatSync('./src/routers/' + item)
      if (!stat.isDirectory() === true&&!item.includes('index')) {
        item = item.match(/^[a-zA-Z_\-0-9]+/)[0]
        activityList.push(item)
      }
    })
     return activityList
  }
}
  /**
   * @description: 获取活动列表
   * @param {*} answers
   * @param {*} input
   * @return {*}
   */  
  function getActivetyList(answers, input=''){
    return new Promise(function(resolve) {
      setTimeout(function() {
        var fuzzyResult = fuzzy.filter(input, getListByType())
        resolve(
          fuzzyResult.map(function(el) {
            return el.original
          })
        )
      }, _.random(30, 500))
    })
  }
  /**
   * @description:获取路由列表
   * @param {*} answers
   * @param {*} input
   * @return {*}
   */  
  function getRouteList(answers, input=''){
    return new Promise(function(resolve) {
      setTimeout(function() {
        var fuzzyResult = fuzzy.filter(input, getListByType(2))
        resolve(
          fuzzyResult.map(function(el) {
            return el.original
          })
        )
      }, _.random(30, 500))
    })
  }
  /**
 * @description: 读取文件列表
 * @param {*} pathName
 * @return {*}
 */
function fileDisplay(pathName){  
  //根据文件路径读取文件，返回文件列表  
    return new Promise((resolve,reject)=>{
        fs.readdir(pathName, function(err, files){  
          var dirs = [];
          (function iterator(i){
            if(i == files.length) {
              resolve(dirs)
              return ;
            }
            fs.stat(path.join(pathName, files[i]), function(err, data){     
              if(data.isFile()){               
                  dirs.push(files[i]);
              }
              iterator(i+1);
            });   
          })(0);
        }); 
    })
}
//
  //创建活动项目  
//
program
  .version('1.0.0', '-v, --version')
  .command('create')
  .description('创建新的面诊需求')
  .action(() => {
    inquirer
      .prompt([
        {
          name: 'fileTitle',
          message: '请输入活动名称'
        },
        {
          name: 'page',
          message: '请输入创建的组件页面 多个页面名称逗号隔开',
          default: 'index'
        },
        {
          type: 'confrim',
          message: '是否需要分享',
          name: 'canshare',
          default: false
        }
      ])
      .then(async answer => {
        const {fileTitle, page, canshare} = answer
        const componentPath = resolve(`./src/views`, fileTitle)
        const hasComponentExists = fs.existsSync(componentPath)
        const pageInfo = page.split(',')
        const routeJs = resolve('./src/routers', `${fileTitle}.route.js`)
        // 获取页面配置信息
        if (hasComponentExists) {
          errorLog(`${fileTitle}页面组件已存在，请重新命名创建`)
          return
        }
        log(`...正在生成 活动名称为 ${fileTitle}的文件目录`)
        log(`${componentPath}`)
        await dotExistDirectoryCreate(componentPath)
        await fs.mkdir(`${componentPath}/components`, () => {})
        pageInfo.forEach(async item => {
          // 生成页面的入口组件 和对应的路由
          const vueFile = resolve(componentPath, `${item}.vue`)
          try {
            // 获取组件名
            await generateFile(vueFile, vueTemplate(fileTitle))
            successLog(`生成src/views/${fileTitle}/${item}.vue成功`)
          } catch (e) {
            errorLog('生成失败:' + e.message)
          }
        })
        await generateFile(routeJs, routeTpl(fileTitle, pageInfo))
        setTimeout(()=>{
          successLog(`生成src/routers/${fileTitle}.route.js成功并完成路由注入`)
          console.log(chalk.hex('#07aefc').bold('^^已经为你生成页面 请愉快开发'))
        },0)
        await oPenBrowser.call(null, process.platform, fileTitle)
      })
  })
//
  //删除活动项目
//
program.command('del')
.description('删除废弃的面诊开发页面')
.action(() => {
  inquirer
    .prompt([
      {
        type: 'autocomplete',
        suggestOnly: false,
        message: '请选择要删除的活动:',
        pageSize: 4,
        name: 'activityName',
        source: getActivetyList,
        validate: function(val) {
          return val ? true : 'Type something!'
        }
      }
    ])
    .then(async answers => {
      await deleteFolderRecursive(`./src/views/${answers.activityName}`)
      await deleteFolderRecursive(`./src/routers/${answers.activityName}.route.js`)
      successLog('删除成功')
    })
})
//
  //增加对应的页面活动
//

program.command('add')
.description('插入添加新的面诊页面')
.action(() => {
  inquirer
    .prompt([
      {
        type: 'autocomplete',
        suggestOnly: false,
        message: '请选择要加入的活动页面:',
        pageSize: 4,
        name: 'activityTitle',
        source: getActivetyList,
        validate: function(val) {
          return val ? true : 'Type something!'
        }
      },
      {
        name: 'addPageName',
        message: '请填写要增加的页面名字，多个页面名称逗号隔开',
        default: 'detail'
      },
    ])
    .then(async answers => {
      let {activityTitle,addPageName} = answers
      let routeJs = resolve('./src/routers', `${activityTitle}.route.js`)
      let componentPath = resolve(`./src/views`, activityTitle)
      //获取新增的页面数组
      let addPageList = addPageName.split(',')
      //读取历史页面数组
      let orderList =await fileDisplay(componentPath)
      //处理页面数组 去掉文件后缀
      let originList = orderList.map(item=>item.match(/^[a-zA-Z_\-0-9]+/)[0])
      let result= addPageList.find(item=>originList.includes(item))
      if(result===undefined){
        addPageList.forEach(async item => {
          // 生成页面的入口组件 和对应的路由
          const vueFile = resolve(componentPath, `${item}.vue`)
          try {
            // 获取组件名
            await generateFile(vueFile, vueTemplate(item))
            setTimeout(()=>{
              successLog(`生成src/views/${activityTitle}/${item}.vue成功`)
              console.log(chalk.hex('#07aefc').bold('^^已经为你插入页面 试一下新添加的页面吧'))
            },0)
            
          } catch (e) {
            errorLog('生成失败:' + e.message)
          }
        })
        await generateFile(routeJs, routeTpl(activityTitle, [...originList,...addPageList]),true)
      }else{
        errorLog(`当前文件已经存在${result}`)
      }
    })
})
//
  //需要下线的路由 将不会注入  
//

program.command('offline')
.description('需要下线的面诊路由')
.action(() => {
  inquirer
    .prompt([
      {
        type: 'autocomplete',
        suggestOnly: false,
        message: '请选择要下线的路由:',
        pageSize: 6,
        name: 'removeRouterName',
        source: getRouteList,
        validate: function(val) {
          return val ? true : 'Type something!'
        }
      }
    ])
    .then(async answers => {
      console.log(answers)
      fs.rename('./src/routers/'+answers.removeRouterName+'.route.js','./src/routers/'+answers.removeRouterName+'.js',function(err){
        if(err){
          throw(err)
        }else{
          console.log('done')
        }
      })
      successLog('下线成功')
    })
})
//
  //需要上线的路由  
//
program.command('online')
.description('需要再次上线的活动路由')
.action(() => {
  inquirer
    .prompt([
      {
        type: 'autocomplete',
        suggestOnly: false,
        message: '请选择要上线的路由:',
        pageSize: 6,
        name: 'removeRouterName',
        source: getRouteList,
        validate: function(val) {
          return val ? true : 'Type something!'
        }
      }
    ])
    .then(async answers => {
      console.log(answers)
      fs.rename('./src/routers/'+answers.removeRouterName+'.js','./src/routers/'+answers.removeRouterName+'.route.js',function(err){
        if(err){
          throw(err)
        }else{
          console.log('done')
        }
      })
      successLog('上线成功')
    })
})
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
program.parse(process.argv)
