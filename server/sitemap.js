const sm = require("sitemap");

const sitemap = sm.createSitemap({
  hostname: "https://ad.snto.com",
  cacheTime: 600000 // 600 sec - cache purge period
});

const xmlArr = [
  {
    url: "/",
    changefreq: "daily",
    priority: 1
  },
  {
    url: "/ad/wechat",
    changefreq: "daily",
    priority: 1
  },
  {
    url: "/ad/app",
    changefreq: "daily",
    priority: 1
  },
  {
    url: "/ad/pc",
    changefreq: "daily",
    priority: 1
  },
  {
    url: "/flow",
    changefreq: "daily",
    priority: 1
  },
  {
    url: "/game",
    changefreq: "daily",
    priority: 1
  },
  {
    url: "/contact",
    changefreq: "daily",
    priority: 1
  },
  {
    url: "/about",
    changefreq: "daily",
    priority: 1
  }
];
xmlArr.forEach(itm => {
  sitemap.add(itm)
})

const setup = ({ server }) => {
  server.get("/sitemap.xml", (req, res) => {
    sitemap.toXML((err, xml) => {
      if (err) {
        res.status(500).end();
        return;
      }

      res.header("Content-Type", "application/xml");
      res.send(xml);
    });
  });
};

module.exports = setup;
