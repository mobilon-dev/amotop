#!/bin/sh

git pull

npm install

npm outdated

npx npm-check-updates --target minor -u

npm install

npm outdated