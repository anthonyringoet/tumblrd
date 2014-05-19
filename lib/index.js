'use strict';

var config = require('../config');
var request = require('superagent');
var async = require('async');
var fs = require('fs');

module.exports = Downloader;

function Downloader(blog, destination) {
  var self = this;

  this.remote = 'https://api.tumblr.com/v2/blog/';
  this.destination = destination || 'tumblrd_dest';
  this.postsInQ = 0;
  this.posts = async.queue(function(img, done) {
    console.log('Getting: ' + img.id + '-' + img.slug);

    var writeStream = fs.createWriteStream('./' + self.destination + '/' + img.id + '-' + img.slug + '.jpg');
    request.get(img.photos[0].original_size.url).pipe(writeStream);

    writeStream.on('error', function(err){
      console.log(err);
      done();
    });
    writeStream.on('close', done);
  });

  this.posts.drain = function() {
    var percentageDone = Math.ceil(self.postsInQ / self.totalPosts * 100);
    console.log(percentageDone + '% ' + 'done');

    if(self.postsInQ < self.totalPosts){

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

  // start everything
  fs.mkdir('./' + this.destination, function(){
    self.getPosts(blog, null, function(err, result){
      if(err) new Error(err);

      self.totalPosts = result.response.total_posts;

      result.response.posts.forEach(function(item){
        self.posts.push(item);
        self.postsInQ++;
      });
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