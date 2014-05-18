'use strict';

var config = require('../config');
var request = require('superagent');
var async = require('async');
var fs = require('fs');

module.exports = Downloader;

function Downloader(blog, destination) {
  var self = this;
  this.remote = 'https://api.tumblr.com/v2/blog/';
  this.posts = [];
  this.destination = destination || 'tumblrd_dest';

  this.getPosts(blog, function(err, result){
    if(err) new Error(err);

    self.posts = result.response.posts;
    self.totalPosts = result.response.total_posts;

    self.downloadPosts(self.posts, function(){
      console.log('All items are downloaded!');
    });
  });
}

Downloader.prototype.getPosts = function(blog, fn){
  request
  .get(this.remote + blog + '/posts/photo')
  .query({api_key: config.consumer})
  .end(function(err, res){
    if (err) return fn(err);
    if (res.error) return fn(new Error(res.body.error));

    fn(null, JSON.parse(res.text));
  });
}

Downloader.prototype.downloadPosts = function(items, fn){
  var self = this;
  var q = async.queue(fetch);

  fs.mkdir('./' + self.destination, function(){
    items.forEach(function(item){
      q.push(item);
    });
  });

  q.drain = function() {
    fn();
  }

  function fetch(img, done) {
    console.log('Getting item id: ' + img.id);

    var writeStream = fs.createWriteStream('./' + self.destination + '/' + img.id + '.jpg');
    request.get(img.photos[0].original_size.url).pipe(writeStream);

    writeStream.on('error', function(err){
      console.log(err);
      done();
    });
    writeStream.on('close', done);
  }
}