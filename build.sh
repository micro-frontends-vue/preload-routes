#!/usr/bin/env bash

cd module-one
yarn build

cd ../module-two
yarn build

cd ../entry-app
yarn build
