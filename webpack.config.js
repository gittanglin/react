const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const argv = require('yargs').argv;
const NODE_ENV = argv.mode;


const NODE_ENV_CONFIG = {
  DEV: 'development',
  PROD: 'production'
};


let commonConfig = {
  devtool: NODE_ENV == NODE_ENV_CONFIG.DEV ? 'inline-source-map' : 'cheap-module-source-map',
  output: {
    path: path.join(__dirname, './dist'),
    filename: NODE_ENV == NODE_ENV_CONFIG.DEV ? '[name].[hash].js' : '[name].[chunkhash:5].js',
    chunkFilename: '[name].[chunkhash:5].js',
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader?cacheDirectory=true', 'eslint-loader'],
        include: path.join(__dirname, 'src'),
        exclude: path.join(__dirname, 'node_modules'),
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader?modules&localIdentName=[local]-[hash:base64:5]', "postcss-loader"],
        exclude: path.join(__dirname, 'node_modules'),
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', "postcss-loader"],
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader?modules&localIdentName=[local]-[hash:base64:5]", "sass-loader", "postcss-loader"]
      },

      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8192,
            mimetype: 'image/png'
          }
        }]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      }
    ]
  },
  resolve: {
    alias: {
      pages: path.join(__dirname, 'src/pages'),
      components: path.join(__dirname, 'src/components'),
      router: path.join(__dirname, 'src/router'),
      actions: path.join(__dirname, 'src/redux/actions'),
      reducers: path.join(__dirname, 'src/redux/reducers'),
    }
  },
  optimization: {
    splitChunks: {
      chunks: "initial"
    }
  },
};

const prodConfig = {
  entry: {
    app: [
      "babel-polyfill",
      path.join(__dirname, 'src/index.js')
    ],
    vendor: ['react', 'react-router-dom', 'redux', 'react-dom', 'react-redux']
  },
};

const devConfig = {
  entry: {
    app: [
      "babel-polyfill",
      'react-hot-loader/patch',
      path.join(__dirname, 'src/index.js'),
    ],
    vendor: ['react', 'react-router-dom', 'redux', 'react-dom', 'react-redux'],
  },
  devServer: {
    port: 8080,
    contentBase: path.join(__dirname, 'dist'),
    host: '0.0.0.0',
    //404定位到index.html
    historyApiFallback: true,
    //代理
    proxy: {
      '/api/*': "http://localhost:8090/$1"
    }
  }
};


let plugins = [
  new HtmlWebpackPlugin({
    title: '测试',
    filename: 'index.html',
    template: path.join(__dirname, 'src/index.html'),
  }),
  new webpack.DefinePlugin({
    __DEV__: JSON.stringify(NODE_ENV),
  }),
];

if (NODE_ENV == NODE_ENV_CONFIG.PROD) {
  plugins.push(new CleanWebpackPlugin(['dist']))
}


commonConfig.plugins = plugins;

module.exports = Object.assign(NODE_ENV == NODE_ENV_CONFIG.DEV ? devConfig : prodConfig, commonConfig);
