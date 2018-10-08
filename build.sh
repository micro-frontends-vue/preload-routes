#!/usr/bin/env bash

cd sub-app-one
yarn build

cd ../sub-app-two
yarn build

cd ../entry-app
yarn build
