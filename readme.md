# tumblrd
Tumblr photo downloader

## Authenticate yourself to use the API
Register a tumblr app and add a file ```config.js``` as seen below in this folder.
Add your consumer key, secret key is not needed.

```
module.exports = {
  consumer: '--some-key--'
}
```

## Using the script

```
$ ./bin/cli.js (blog url) (optional destination) (--v verbose flag)
$ ./bin/cli.js someblog.tumblr.com output-dir --v
```
