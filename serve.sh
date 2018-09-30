#!/usr/bin/env bash

cd module-one
yarn build&&

cd ../module-two
yarn build&&

cd ..
yarn serve&

cd entry-app
yarn serve
