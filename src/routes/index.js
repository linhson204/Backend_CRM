const express = require('express');
const postRoute = require('./dang_bai_tcn/postFb.route');
const commentRoute = require('./dang_bai_tcn/commentFb.route');
const imageRoute = require('./image.route');
const mediaRoute = require('./media.route');
const messageFbRoute = require('./nhan_tin/messageFb.route');
const userMessageRoute = require('./nhan_tin/userMessage.route');
const websocketRoute = require('./websocket.route');
const apiThanhRoute = require('./apiThanh.route');
const postGroupRoute = require('./dang_bai_group/postGroup.route');

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
  {
    path: '/apiThanh',
    route: apiThanhRoute,
  },
  {
    path: '/postGroup',
    route: postGroupRoute,
  },
  {
    path: '/media',
    route: mediaRoute,
  },
  {
    path: '/userMessage',
    route: userMessageRoute,
  },
  {
    path: '/message',
    route: messageFbRoute,
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
