/* eslint-disable no-console */
const path = require("path");
const express = require("express");
const next = require("next");
const sitemap = require("./sitemap");

const port = parseInt(process.env.PORT, 10) || 3000;
const env = process.env.NODE_ENV;
const dev = env !== "production";
const app = next({
  dir: ".", // base directory where everything is, could move to src later
  dev
});

if (!dev) {
  // 设置cdn
  //   app.setAssetPrefix("http://cdn.com/myapp");
}

const proxy = {
  "/api": {
    target: dev ? "http://test.api.yay.com.cn" : "http://test.api.yay.com.cn",
    pathRewrite: { "^/api": "/" },
    changeOrigin: true
  }
};

const handle = app.getRequestHandler();

let server;
app
  .prepare()
  .then(() => {
    server = express();

    // Set up the proxy.
    if (proxy) {
      const proxyMiddleware = require("http-proxy-middleware");
      Object.keys(proxy).forEach(function(context) {
        server.use(proxyMiddleware(context, proxy[context]));
      });
    }

    server.use(express.static(path.join(__dirname, "../public")));

    sitemap({ server });

    // Default catch-all handler to allow Next.js to handle all other routes
    server.all("*", (req, res) => handle(req, res));

    server.listen(port, err => {
      if (err) {
        throw err;
      }
      console.log(`> Ready on port ${port} [${env}]`);
    });
  })
  .catch(err => {
    console.log("An error occurred, unable to start the server");
    console.log(err);
  });
