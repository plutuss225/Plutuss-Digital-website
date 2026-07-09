self.__BUILD_MANIFEST = {
  "polyfillFiles": [
    "static/chunks/polyfills.js"
  ],
  "devFiles": [
    "static/chunks/react-refresh.js"
  ],
  "ampDevFiles": [],
  "lowPriorityFiles": [],
  "rootMainFiles": [],
  "pages": {
    "/": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/index.js"
    ],
    "/_app": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_app.js"
    ],
    "/_error": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_error.js"
    ],
    "/about": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/about.js"
    ],
    "/blogs": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/blogs.js"
    ],
    "/contact": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/contact.js"
    ],
    "/political": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/political.js"
    ],
    "/services/seo": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/services/seo.js"
    ],
    "/services/social-media": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/services/social-media.js"
    ]
  },
  "ampFirstPages": []
};
self.__BUILD_MANIFEST.lowPriorityFiles = [
"/static/" + process.env.__NEXT_BUILD_ID + "/_buildManifest.js",
,"/static/" + process.env.__NEXT_BUILD_ID + "/_ssgManifest.js",

];