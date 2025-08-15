const express = require('express');
const postRoute = require('./dang_bai_tcn/postFb.route');
const commentRoute = require('./dang_bai_tcn/commentFb.route');
const imageRoute = require('./image.route');
const websocketRoute = require('./websocket.route');

const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/post',
    route: postRoute,
  },
  {
    path: '/comment',
    route: commentRoute,
  },
  {
    path: '/websocket',
    route: websocketRoute,
  },
  {
    path: '/image',
    route: imageRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
