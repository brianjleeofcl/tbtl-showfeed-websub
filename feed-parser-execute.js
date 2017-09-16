#!/usr/bin/env node
const [node, _, path] = process.argv;

const xml = require('fs').readFileSync(require('path').resolve(__dirname, path), 'utf-8');

const parser = require('./feed-parser');

parser(xml).then(res => console.log(require('util').inspect(res)));