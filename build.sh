#!/bin/bash
#
# This calls Browserify to generate code for the browser.
#

TARGET="www-ahrs.js"

SRC_DIR="."
WWW_DIR="./build"

BRSFY="./node_modules/.bin/browserify"

if [ ! -f "${BRSFY}" ]; then
    echo "Please install browserify."
    exit -1
fi

# Build www-ahrs
$BRSFY  -r $SRC_DIR/Madgwick.js:./Madgwick                 \
        -r $SRC_DIR/Mahony.js:./Mahony                     \
        -r $SRC_DIR/index.js:ahrs                          \
        --outfile $WWW_DIR/$TARGET

echo "Built $TARGET"
