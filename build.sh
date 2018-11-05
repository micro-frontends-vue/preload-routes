#!/usr/bin/env bash

cd entry-app
yarn build&&

cd ../sub-app-one
yarn build&&

cd ../sub-app-two
yarn build&&

cd ../
yarn serve
