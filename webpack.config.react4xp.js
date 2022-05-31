/** Use this file to adjust the webpack config.
 *  Uncomment the overrideComponentWebpack property in react4xp.properties, and add this file there.
 */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const postcss = require('postcss');
const PostCssPipelineWebpackPlugin = require('postcss-pipeline-webpack-plugin');
const criticalSplit = require('postcss-critical-split');
const csso = require('postcss-csso');
const path = require('path');

const resourceFolder = './build/resources/main/assets';

module.exports = function (env, react4xpConfigInput) {
  const react4xpConfig = react4xpConfigInput;

  // Makes symlinks under node_modules work, e.g. 'npm link' and possibly PNPM etc:
  react4xpConfig.resolve.symlinks = true;

  // Compile .scss and friends:
  react4xpConfig.module.rules = [
    ...(react4xpConfig.module.rules || []),
    {
      test: /\.((sa|sc|c))ss$/i,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            modules: { auto: true }
          }
        },
        {
          loader: 'sass-loader',
          options: {
            sassOptions: {
              outputStyle: 'compressed'
            }
          }
        }
      ]
    }
  ];

  // Set up how the compiled assets are exported:
  react4xpConfig.plugins = [
    ...(react4xpConfig.plugins || []),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].[contenthash:9].css'
    })
  ];

  react4xpConfig.name = 'configReact4xp';

  const extraConfig = {
    mode: react4xpConfig.mode,
    name: 'configExtra',
    entry: {
      main: [
        path.resolve(__dirname, './src/frontend-general/main.scss')
      ]
    },
    output: {
      filename: 'js/[name].js',
      path: path.resolve(__dirname, resourceFolder),
      chunkFormat: false
    },
    module: {
      rules: [
        {
          test: /\.((sa|sc|c))ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: { auto: true }
              }
            },
            {
              loader: 'sass-loader'
            }
          ]
        },
        {
          test: /\.(eot|ttf|woff|woff2)$/,
          use: [{
            loader: 'file-loader?name=fonts/[name].[ext]&publicPath=../'
          }]
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'css/[name].css'
      }),
      new StylelintPlugin({
        context: './styles/'
      }),
      // Stage #1: extract critical part of the styles
      new PostCssPipelineWebpackPlugin({
        predicate: (name) => /main.css$/.test(name),
        processor: postcss([
          criticalSplit({
            output: criticalSplit.output_types.CRITICAL_CSS
          })
        ]),
        suffix: 'critical',
        map: {
          inline: false
        }
      }),
      // Stage #2: extract the rest of the styles
      new PostCssPipelineWebpackPlugin({
        predicate: (name) => /main.css$/.test(name),
        processor: postcss([
          criticalSplit({
            output: criticalSplit.output_types.REST_CSS
          })
        ]),
        suffix: 'rest',
        map: {
          inline: false
        }
      }),
      // Stage #3: optimize generated files (styles.critical.css, styles.rest.css)
      new PostCssPipelineWebpackPlugin({
        predicate: (name) => /main.css$/.test(name),
        processor: postcss([
          csso({
            restructure: false
          })
        ]),
        suffix: 'min',
        map: {
          inline: false
        }
      })
    ]
  };

  return [extraConfig, react4xpConfig];
};
