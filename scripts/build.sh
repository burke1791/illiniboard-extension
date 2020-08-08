#!/usr/bin/env bash

# remove static files from previous build
rm -rf ./build/css
rm -rf ./build/images
rm -rf ./build/js

# copy static files for new build
cp -r public/css build/css
cp -r public/illiniboard.html build/
cp -r public/images build/images

# run webpack build for js files
npm run build