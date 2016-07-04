#!/bin/bash
#
# This calls Browserify to generate code for the browser.
#

TARGET="www-ahrs.js"

SRC_DIR="."
WWW_DIR="./build"

BRSFY=`which browserify`

if [ "${BRSFY}" = "" ]; then
    echo "Please install browserify globally (npm install -g browserify)."
fi

# Build www-ahrs
$BRSFY  -r $SRC_DIR/Madgwick.js:./Madgwick                 \
        -r $SRC_DIR/Mahony.js:./Mahony                     \
        -r $SRC_DIR/index.js:ahrs                          \
        --outfile $WWW_DIR/$TARGET

echo "Built $TARGET"
