const path = require('path');

module.exports = {
  entry: {
    main: './src/index.js',
    auth: './src/auth.js',
    options: './src/options',
    background: './src/background.js',
    oauthcallback: './src/oauthcallback.js',
    myscript: './src/myscript.js'
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              ["@babel/plugin-transform-react-jsx", { "pragma":"h" }]
            ]
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  output: {
    path: path.resolve(__dirname, 'extension/dist')
  }
};
