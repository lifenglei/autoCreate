module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue: 50,
      propList: ['*'],
      replace: true,
      minPixelValue: 2
    }
  }
}
