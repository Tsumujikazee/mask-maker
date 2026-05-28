'use strict';
const pug = require('pug');
const util = require('./mask-maker-util');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ log: ['query'] });
const crypto = require('node:crypto');
const oneTimeTokenMap = new Map();

async function handle(req, res) {
  switch (req.method) {
    case 'GET':
      res.writeHead(200, {
        'Content-type': 'text/html; charset=utf-8'
      });
      const oneTimeToken = crypto.randomBytes(8).toString('hex');
      oneTimeTokenMap.set(req.user, oneTimeToken);
      if (req.user === 'admin') {//管理者の場合は投稿を全表示、それ以外は自分の投稿したもののみ表示
        const posts = await prisma.post.findMany({
          orderBy: { id: 'asc' }
        });
        res.end(pug.renderFile('./views/contents.pug', {
          posts,
          user: req.user,
          maskMaker,
          oneTimeToken,
        }));
      } else {
        const posts = await prisma.post.findMany({
          where: { postedBy: req.user },
          orderBy: { id: 'asc' }
        });
        res.end(pug.renderFile('./views/contents.pug', {
          posts,
          user: req.user,
          maskMaker,
          oneTimeToken,
        }));
      }
      console.info('閲覧されました');
      break;
    case 'POST':
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      }).on('end', async () => {
        const params = new URLSearchParams(body);
        const content = params.get('content');
        const requestedOneTimeToken = params.get('oneTimeToken');
        if (!content) {
          hendleRedirectPosts(req, res);
          return;
        }
        if (!requestedOneTimeToken) {
          util.handleBadRequest(req, res);
          return;
        }
        if (oneTimeTokenMap.get(req.user) !== requestedOneTimeToken) {
          util.handleBadRequest();
          return;
        }
        console.info(`受け取った文章はこれです: ${content}`);
        const escapedContent = textEscape(content);
        console.log(`変換後の文章はこれです: ${escapedContent}`);
        await prisma.post.create({
          data: {
            content: escapedContent,
            postedBy: req.user
          }
        });
        oneTimeTokenMap.delete(req.user);
        util.handleRedirect(req, res);
      });
      break;
    default:
      util.handleBadRequest(req, res);
      break;
  }
}

//投稿された文章の**で囲われた部分を赤シートのようにマスキングする処理
function maskMaker(contents) {
  let texts = contents.replace(/\*(.*?)\*/g, '<span class="mask">$1</span>');
  return texts;
}

//XSS対策
function textEscape (str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function handleDelete(req, res) {
  switch (req.method) {
    case 'POST':
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      }).on('end', async () => {
        const params = new URLSearchParams(body);
        const id = parseInt(params.get('id'));
        const post = await prisma.post.findUnique({
          where: { id }
        });
        if (req.user === post.postedBy || req.user === 'admin') {
          await prisma.post.delete({
            where: { id }
          });
          util.handleRedirect(req, res);
        }
      });
      break;
      default:
        util.handleBadRequest(req, res);
        break;
  }
}


module.exports = {
  handle,
  handleDelete,
}