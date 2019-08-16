/* eslint-disable */
const withCSS = require("@zeit/next-css");
const withLess = require("@zeit/next-less");
const lessToJS = require("less-vars-to-js");
const fs = require("fs");
const path = require("path");

// Where your antd-custom.less file lives
const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, "./assets/antd-custom.less"), "utf8")
);

module.exports = withCSS(
  withLess({
    lessLoaderOptions: {
      javascriptEnabled: true,
      modifyVars: themeVariables // make your antd custom effective
    },
    webpack: (config, { isServer }) => {
      
      if (isServer) {
        const antStyles = /antd\/.*?\/style.*?/;
        const origExternals = [...config.externals];
        config.externals = [
          (context, request, callback) => {
            if (request.match(antStyles)) return callback();
            if (typeof origExternals[0] === "function") {
              origExternals[0](context, request, callback);
            } else {
              callback();
            }
          },
          ...(typeof origExternals[0] === "function" ? [] : origExternals)
        ];
        config.module.rules.unshift({
          test: antStyles,
          use: "null-loader"
        });
      }
      // 添加别名引用
      config.resolve.alias['@'] = path.join(__dirname, '')
      // 添加文件hash
      config.module.rules.push({
        test: /\.(txt|jpg|png|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              context: '',
              outputPath: 'static',
              publicPath: '/_next/static',
              name: '[path][name].[hash].[ext]'
            }
          }
        ]
      })
      return config;
    }
  })
);
