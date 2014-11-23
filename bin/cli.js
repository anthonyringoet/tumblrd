#!/usr/bin/env node
'use strict';

var Downloader = require('../lib');
var argv = require('minimist')(process.argv.slice(2));

new Downloader(argv._[0], argv._[1], argv.v);
