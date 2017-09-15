#!/usr/bin/env node
console.log('a')
const [node, _, file] = process.argv;

const xml = require('fs').readFileSync(file, 'utf-8');

console.log(require('./feed-parser')(xml));