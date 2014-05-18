# tumblrd
Tumblr picture downloader

## Getting started

```
npm install tumblrd
```

## Authenticate yourself to use the API
Register a tumblr app and add a file ```config.js``` as seen below in this folder.
Add your consumer and secret key.

```
module.exports = {
  consumer: '--some-key--',
  secret: '--some-key--'
}
```

## Using the script

```
$ ./bin/cli.js (blog url) (optional destination)
$ ./bin/cli.js someblog.tumblr.com output-dir
```