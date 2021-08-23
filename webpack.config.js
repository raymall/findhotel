const path = require('path');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlBeautifyPlugin = require('html-beautify-webpack-plugin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

const pages = [
  {
    title: 'FindHotel',
    filename: 'index.html',
    template: './app/src/views/index.html',
  }
]

function generateHtmlPlugins () {
  return pages.map(page => {
    return new HtmlWebpackPlugin({
      title: page.title,
      filename: page.filename,
      template: page.template
    })
  })
}

module.exports = {
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  entry: {
    application: [
      './app/src/styles/application.scss',
      './app/src/scripts/application.js'
    ],
  },
  output: {
    filename: 'application.js',
    path: path.resolve(__dirname, 'app/dist')
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              sassOptions: {
                outputStyle: 'compressed',
              },
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [{
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/'
            }
        }]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['./app/dist/']),
    new MiniCssExtractPlugin({
      filename: "application.css"
    }),
    new CopyWebpackPlugin([{
      from:'./app/src/assets/',
      to: 'assets/[name].[ext]'
    }]),
    new ImageminPlugin({
      pngquant: ({quality: '50'}),
      plugins: [imageminMozjpeg({quality: '50'})]
    }),
    new CopyWebpackPlugin([
      { from: './app/src/assets/favicon', to: './', force: true }
    ]),
  ]
  .concat(generateHtmlPlugins())
  .concat(new HtmlBeautifyPlugin({
    config: {
      html: {
        end_with_newline: true,
        indent_size: 2,
        indent_with_tabs: false,
        indent_inner_html: true,
        preserve_newlines: false
      }
    }
  }))
};