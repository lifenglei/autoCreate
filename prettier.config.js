// perttierrc 配置选项(改文件会覆盖setting.json中的perttier配置)
module.exports = {
  // 开启对于elint支持,按照eslint的配置格式代码
  eslintIntegration: true,
  stylelintIntegration: true,
  // 换行的最大值
  printWidth: 120,
  // 一个tab几个空格
  tabWidth: 2,
  // 是否使用单引号
  singleQuote: true,
  // 行末是否有；号
  semi: false,
  // 对象大括号是否有空格 eg：{ foo: bar }
  bracketSpacing: false,
  // 'prettier.cssEnable': ['css', 'less', 'sass']
  // 可以配置一个.prettierignore对于不需要perttier的文件进行忽略
  ignorePath: '.prettierignore'
}
