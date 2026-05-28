'use strict';
const maskMaker = require('./mask-maker');
const util = require('./mask-maker-util');

function route(req, res) {
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] === 'http') {
    //
  }
  switch (req.url) {
    //各処理へ分岐
    case '/':
      util.handleStartMenu(req, res);
      break;
    case '/posts':
      maskMaker.handle(req, res);
      break;
    case '/posts/delete':
      maskMaker.handleDelete(req, res);
      break;
    case '/logout':
      util.handleLogout(req, res);
      break;
    case '/style.css':
      util.handleStyleCssFile(req, res);
      break;
    case '/mask-maker-views.js':
      util.handleJsFile(req, res);
      break;
    case '/favicon.ico':
      util.handleFavicon(req, res);
      break;
    default:
      util.handleBadRequest(req, res);
      break;
  }
}

module.exports = {
  route,
}