'use strict';

var config = require('../config');
var request = require('superagent');
var async = require('async');
var fs = require('fs');

module.exports = Downloader;

function Downloader(blog, destination) {
  var self = this;
  this.remote = 'https://api.tumblr.com/v2/blog/';
  this.posts = async.queue(self.fetch);
  this.destination = destination || 'tumblrd_dest';
  this.postsInQ = 0;

  this.posts.drain = function() {
    console.log(self.postsInQ + '/' + self.totalPosts);

    if(self.postsInQ < self.totalPosts){
      console.log('in drain: true');

      self.getPosts(blog, self.postsInQ, function(err, result){
        result.response.posts.forEach(function(item){
          self.posts.push(item);
          self.postsInQ++;
        });
      });
    }
    else{
      console.log('All done. See you next time!');
    }
  }

  this.getPosts(blog, null, function(err, result){
    if(err) new Error(err);

    self.totalPosts = result.response.total_posts;

    result.response.posts.forEach(function(item){
      self.posts.push(item);
      self.postsInQ++;
    });
  });
}

Downloader.prototype.getPosts = function(blog, offset, fn){
  request
  .get(this.remote + blog + '/posts/photo')
  .query({
    api_key: config.consumer,
    offset: offset
  })
  .end(function(err, res){
    if (err) return fn(err);
    if (res.error) return fn(new Error(res.body.error));

    fn(null, JSON.parse(res.text));
  });
}

Downloader.prototype.downloadPosts = function(items, fn){
  var self = this;

  fs.mkdir('./' + self.destination, function(){
    items.forEach(function(item){
      q.push(item);
      self.fetchedPosts++;
    });
  });
}

Downloader.prototype.fetch = function(img, done) {
  var self = this;
  // console.log(self); // Y U NO WORK

  console.log('Getting: ' + img.id + '-' + img.slug);
  done();  // development


  // var writeStream = fs.createWriteStream('./' + self.destination + '/' + img.id + '.jpg');
  // request.get(img.photos[0].original_size.url).pipe(writeStream);

  // writeStream.on('error', function(err){
  //   console.log(err);
  //   done();
  // });
  // writeStream.on('close', done);
}