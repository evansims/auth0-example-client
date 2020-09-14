#!/bin/bash

# Setup yarn to install dependencies.
yarn config set cache-folder /yarn
yarn config set ignore-engines true

# Use yarn to install dependencies.
yarn install

# Deduplicate dependency tree to help keep things tidy.
yarn-deduplicate

# Create our distribution folder, if it doesn't exist.
mkdir -p 'dist'

# Execute our gulpfile
gulp --cwd . --gulpfile ./tmp/gulpfile.js
