import path        from "path"
import webpack     from "webpack"
import yargs       from 'yargs'
import HTMLPlugin  from 'html-webpack-plugin'
import nib         from "nib"

let plugins = [];

const production = yargs.argv.production;

const config = {
  entry: path.join(__dirname, "src/index.js"),
  output: {
    path: path.join(__dirname, 'dist/'),
    filename: "app.js"
  },
  devServer: {
    hot: true,
    inline: true
  },
  target: "web",
  cache: true,
  watch: false,
  module: {
    rules: [
      {
        test:   /\.coffee$/,
        use: [
          "react-hot-loader",
          "coffee-loader"
        ]
      },
      {
        test:   /\.jsx?$/,
        loader: "babel-loader",
        query: {
          plugins: ['transform-decorators-legacy']
        },
        include: [
          path.resolve(__dirname, "src"),
          path.resolve(__dirname, "spec"),
          path.resolve(__dirname, "node_modules/flash-notification-react-redux"),
          path.resolve(__dirname, "node_modules/vm-leaflet-icons")
        ],
      },
      {
        test:   /\.css$/,
        use: [
          "style-loader",
          "css-loader"
        ]
      },
      {
        test:   /\.styl$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "stylus-loader",
            options: {
              compress: (production ? true : false),
              use: [nib()]
            }
          }
        ]

      },
      {
        test:   /\.less$/,
        use: [
          "style-loader",
          "css-loader",
          "less-loader"
        ]
      },
      {
        test:   /\.jpe?g$|\.gif$|\.png$/,
        loader: "url-loader?limit=10000"
      },
      {
        test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=application/octet-stream"
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader"
      },
      {
        test: /\.otf$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-otf'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=image/svg+xml"
      },
      {
        test: [/\.scss$/],
        use: [
          "css-loader?localIdentName=[path]",
          "postcss-loader",
          "sass-loader"
        ],
      }
    ],
    noParse: [
      /\.min\.js$/,
    ]
  },
  resolve: {
    extensions: [".jsx", ".js", ".coffee"]
  }
};

let htmlPluginOptions = {
  template : "./src/index.html",
  title    : "Karte von morgen",
  favicon  : "./src/img/favicon.ico",
  inject   : 'body'
};

if (production) {
  plugins.push(new webpack.optimize.UglifyJsPlugin());
  htmlPluginOptions.minify = {
    removeComments        : true,
    collapseWhitespace    : true,
    conservativeCollapse  : false,
    minifyJS              : true,
    minifyCSS             : true,
  };

  // Enable React optimizations.
  plugins.push(new webpack.DefinePlugin({
    'process.env.NODE_ENV'  : JSON.stringify('production'),
    __DEVTOOLS__            : false,
    __DEVELOPMENT__         : false
   }));
} else {
  plugins.push(new webpack.DefinePlugin({
    __DEVTOOLS__            : false,
    __DEVELOPMENT__         : true
  }));
  plugins.push(new webpack.HotModuleReplacementPlugin());
}

plugins.push(new HTMLPlugin(htmlPluginOptions));

config.plugins = plugins;
module.exports = config;
