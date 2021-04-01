/**
 * (main.js) The backend
 *  
 * SEE LICENSE
 */

// Require dependencies
const path = require('path');
const express = require('express');
const fs = require('fs');
const nunjucks = require('nunjucks');
const helmet = require('helmet');
const metadataParser = require('markdown-yaml-metadata-parser');
const markedImages = require('marked-images');
let marked = require('marked');

marked.use(markedImages());

// Load configuration variables from a file
require('dotenv').config({ path: path.join(__dirname, 'config.env') });

// Express app object
const app = express();

// Configure nunjucks
let njenv = nunjucks.configure('views', {
  noCache: true,
  watch: true,
  autoescape: true,
  express: app
});
app.set('views', path.join(__dirname, 'views'));

// Express security
app.use(helmet({ contentSecurityPolicy: false }));

// Static assets and files
app.use('/static', express.static(path.join(__dirname, 'static')));

// PARSE ALL POSTS & CACHE IN ARRAY
var posts = [];
const files = fs.readdirSync(path.join(__dirname, 'posts'));
files.forEach(file => {
  const extension = file.split('.').pop();
  if (extension == 'md') {
    let post = { name: file.split('.').shift() };
    const postMD = fs.readFileSync(path.join(__dirname, 'posts', file), 'utf-8');
    post = Object.assign(post, metadataParser(postMD).metadata);
    posts.push(post);
  }
});

// Home Page
app.get('/', (req, res) => {
  res.render('index.njk', {
    BLOG_NAME: process.env.BLOG_NAME,
    posts: posts
  });
});

app.get('/rss.xml', (req, res) => {
  res.render('rss.xml', {
    BLOG_NAME: process.env.BLOG_NAME,
    BLOG_DESC: process.env.BLOG_DESC,
    host: req.protocol + '://' + req.headers.host,
    posts: posts
  });
});

// A particular post
app.get('/post/:postname', (req, res) => {
  const postname = req.params.postname
  const postIndex = posts.findIndex(post => post.name === postname);
  const selectedPost = (postIndex >= 0) ? posts[postIndex] : null;
  if (!selectedPost) return res.status(404).render('404.njk', { BLOG_NAME: process.env.BLOG_NAME });
  const postMD = fs.readFileSync(path.join(__dirname, 'posts', selectedPost.name + '.md'), 'utf-8');
  const post = metadataParser(postMD);
  res.render('post.njk', {
    BLOG_NAME: process.env.BLOG_NAME,
    BLOG_DESC: process.env.BLOG_DESC,
    metadata: post.metadata,
    post: marked(post.content)
  });
});

// Error Handling
app.use(function (req, res, next) {
  res.status(404).render('404.njk', { BLOG_NAME: process.env.BLOG_NAME });
})

// Express app listening on the development or production port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening for HTTP requests on port ${port}`);
});