#!/usr/bin/env bash

cd sub-app-one
yarn build&&

cd ../sub-app-two
yarn build&&

cd ..
yarn serve&

cd entry-app
yarn serve
