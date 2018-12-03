#!/usr/bin/env bash

# contains(string, substring)
#
# Returns 0 if the specified string contains the specified substring,
# otherwise returns 1.
contains() {
    string="$1"
    substring="$2"
    if test "${string#*$substring}" != "$string"
    then
        return 0    # $substring is in $string
    else
        return 1    # $substring is not in $string
    fi
}

cd entry-app
yarn build&&

cd ../sub-app-ts
yarn build&&

cd ../sub-app-js
yarn build&&

cd ../
# contains "$*" '--serve' && yarn serve
