'use strict';
const fs = require('node:fs');
const pug = require('pug');

function handleRedirect(req, res) {
  res.writeHead(303, { Location: '/posts' });
  res.end();
}

function handleStartMenu(req, res) {
  res.writeHead(200, {
    'Content-type': 'text/html; charset=utf-8'
  });
  res.end(pug.renderFile('./views/startMenu.pug'));
}

function handleLogout(req, res) {
  res.writeHead(401, {
    'Content-Type': 'text/html; charset=utf-8'
  });
  res.end(pug.renderFile('./views/logout.pug'));
}

function handleStyleCssFile(req, res) {
  res.writeHead(200, {
    'Content-type': 'text/css',
  });
  const css = fs.readFileSync('./views/style.css');
  res.end(css);
}

function handleJsFile(req, res) {
  res.writeHead(200, {
    'Content-type': 'text/javascript'
  });
  const jsFile = fs.readFileSync('./views/mask-maker-views.js');
  res.end(jsFile);
}

function handleFavicon(req, res) {
  res.writeHead(200, {
    'Content-type': 'image/vnd.microsoft.icon',
    'Cache-Control': 'public, max-age=604800'
  });
  const favicon = fs.readFileSync('./favicon.ico');
  res.end(favicon);
  
}

function handleBadRequest(req, res) {
  res.writeHead(400, {
    'Content-Type': 'text/plain; charset=utf-8'
  });
  res.end('未対応のリクエストです');
}
module.exports ={
  handleRedirect,
  handleStartMenu,
  handleLogout,
  handleStyleCssFile,
  handleJsFile,
  handleFavicon,
  handleBadRequest,
}