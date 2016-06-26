import HtmlWebpackPlugin from 'html-webpack-plugin';

module.exports = {
  context: `${__dirname}/src`,
  entry: ['babel-polyfill', './index.jsx'],
  output: {
    path: `${__dirname}/dist`,
    filename: 'bundle.js',
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.scss$/, loader: 'style!css!sass' },
      { test: /\.json$/, loader: 'json' },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.css', '.scss', 'json'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'assets/index.html',
      inject: true,
    }),
  ],
};
