/*********************************************************************
 *                                                                   *
 *   Copyright 2016 Simon M. Werner                                  *
 *                                                                   *
 *   Licensed to the Apache Software Foundation (ASF) under one      *
 *   or more contributor license agreements.  See the NOTICE file    *
 *   distributed with this work for additional information           *
 *   regarding copyright ownership.  The ASF licenses this file      *
 *   to you under the Apache License, Version 2.0 (the               *
 *   "License"); you may not use this file except in compliance      *
 *   with the License.  You may obtain a copy of the License at      *
 *                                                                   *
 *      http://www.apache.org/licenses/LICENSE-2.0                   *
 *                                                                   *
 *   Unless required by applicable law or agreed to in writing,      *
 *   software distributed under the License is distributed on an     *
 *   "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY          *
 *   KIND, either express or implied.  See the License for the       *
 *   specific language governing permissions and limitations         *
 *   under the License.                                              *
 *                                                                   *
 *********************************************************************/

'use strict';

var sampleInterval = 20;
var AHRS = require('./index');
var madgwick = new AHRS({
    sampleInterval: sampleInterval,
    algorithm: 'Mahony'
});

setInterval(function() {
    var d = nextDataPoint();
    // madgwick.update(d.gyro.x, d.gyro.y, d.gyro.z, d.accel.x, d.accel.y, d.accel.z);
    madgwick.update(d.gyro.x, d.gyro.y, d.gyro.z, d.accel.x, d.accel.y, d.accel.z, d.compass.x, d.compass.y, d.compass.z);
    console.log(madgwick.getEulerAngles());
}, sampleInterval);

var i = 0;
function nextDataPoint() {
    if (i >= sampleData.length) {
        i = 0;
    }
    return sampleData[i++];
}

var sampleData = [
    { gyro: { x: -0.1, y: -0.1, z: 0 },
      accel: { x: -0.047, y: -0.234, z: 0.984 },
      compass: { x: -126, y: -428, z: 259 }
    },
    { gyro: { x: -0.4, y: 0, z: 0 },
      accel: { x: 0, y: -0.281, z: 0.938 },
      compass: { x: -124, y: -428, z: 261 }
    },
    { gyro: { x: -0.2, y: 0, z: 0 },
      accel: { x: -0.047, y: -0.234, z: 0.984 },
      compass: { x: -124, y: -428, z: 261 }
    },
    { gyro: { x: -0.2, y: 0, z: 0 },
      accel: { x: 0, y: -0.234, z: 0.938 },
      compass: { x: -124, y: -428, z: 261 }
    },
    { gyro: { x: -0.2, y: 0.1, z: -0.3 },
      accel: { x: 0, y: -0.281, z: 0.984 },
      compass: { x: -124, y: -428, z: 261 }
    },
    { gyro: { x: 0.1, y: -0.1, z: 0 },
      accel: { x: 0.047, y: -0.188, z: 1.031 },
      compass: { x: -125, y: -426, z: 261 }
    },
    { gyro: { x: 0.1, y: -0.1, z: 0 },
      accel: { x: 0, y: -0.234, z: 0.984 },
      compass: { x: -125, y: -426, z: 261 }
    },
    { gyro: { x: 0.1, y: 0, z: -0.1 },
      accel: { x: -0.047, y: -0.234, z: 1.031 },
      compass: { x: -125, y: -426, z: 261 }
    },
    { gyro: { x: -0.1, y: 0, z: 0.1 },
      accel: { x: 0, y: -0.188, z: 0.984 },
      compass: { x: -126, y: -430, z: 261 }
    },
    { gyro: { x: -0.1, y: 0, z: 0.1 },
      accel: { x: 0, y: -0.281, z: 0.938 },
      compass: { x: -126, y: -430, z: 261 }
    },
    { gyro: { x: -0.4, y: 0.2, z: 0.1 },
      accel: { x: 0, y: -0.234, z: 0.984 },
      compass: { x: -121, y: -428, z: 258 }
    },
    { gyro: { x: -0.2, y: -0.3, z: 0.1 },
      accel: { x: 0, y: -0.234, z: 0.938 },
      compass: { x: -121, y: -428, z: 258 }
    },
    { gyro: { x: 0.2, y: -0.3, z: -0.1 },
      accel: { x: -0.047, y: -0.234, z: 1.031 },
      compass: { x: -121, y: -428, z: 258 }
    },
    { gyro: { x: 0.2, y: -0.3, z: -0.1 },
      accel: { x: 0, y: -0.234, z: 0.984 },
      compass: { x: -125, y: -428, z: 264 }
    },
    { gyro: { x: 0.2, y: 0.2, z: -0.1 },
      accel: { x: -0.047, y: -0.234, z: 1.031 },
      compass: { x: -125, y: -428, z: 264 }
    },
    { gyro: { x: 0.2, y: 0.2, z: -0.1 },
      accel: { x: -0.047, y: -0.234, z: 0.984 },
      compass: { x: -125, y: -428, z: 264 }
    },
    { gyro: { x: 0.1, y: 0.1, z: -0.2 },
      accel: { x: -0.047, y: -0.234, z: 0.938 },
      compass: { x: -125, y: -427, z: 270 }
    },
    { gyro: { x: -0.1, y: 0.1, z: 0 },
      accel: { x: -0.047, y: -0.281, z: 0.984 },
      compass: { x: -125, y: -427, z: 270 }
    },
    { gyro: { x: -0.1, y: 0.2, z: 0.1 },
      accel: { x: -0.047, y: -0.234, z: 0.984 },
      compass: { x: -127, y: -429, z: 261 }
    },
    { gyro: { x: 0.1, y: -0.2, z: 0 },
      accel: { x: 0, y: -0.281, z: 0.984 },
      compass: { x: -127, y: -429, z: 261 }
    },
    { gyro: { x: 0.1, y: -0.2, z: 0 },
      accel: { x: -0.094, y: -0.234, z: 1.031 },
      compass: { x: -127, y: -429, z: 261 }
    },
    { gyro: { x: -0.1, y: -0.1, z: -0.1 },
      accel: { x: -0.047, y: -0.188, z: 1.031 },
      compass: { x: -127, y: -429, z: 260 }
    },
    { gyro: { x: -0.1, y: -0.2, z: -0.1 },
      accel: { x: -0.047, y: -0.234, z: 0.938 },
      compass: { x: -127, y: -429, z: 260 }
    },
    { gyro: { x: -0.1, y: -0.2, z: -0.1 },
      accel: { x: -0.047, y: -0.281, z: 1.031 },
      compass: { x: -127, y: -429, z: 260 }
    },
    { gyro: { x: -0.1, y: 0, z: -0.1 },
      accel: { x: -0.047, y: -0.234, z: 0.938 },
      compass: { x: -127, y: -429, z: 260 }
    },
    { gyro: { x: -0.3, y: 0, z: 0 },
      accel: { x: 0, y: -0.188, z: 0.984 },
      compass: { x: -122, y: -429, z: 263 }
    },
    { gyro: { x: -0.3, y: 0, z: 0 },
      accel: { x: 0, y: -0.188, z: 0.938 },
      compass: { x: -122, y: -429, z: 263 }
    },
    { gyro: { x: -0.3, y: -0.1, z: -0.1 },
      accel: { x: 0, y: -0.234, z: 0.984 },
      compass: { x: -126, y: -429, z: 257 }
    },
    { gyro: { x: -0.1, y: 0.1, z: 0.1 },
      accel: { x: -0.047, y: -0.234, z: 1.031 },
      compass: { x: -126, y: -429, z: 257 }
    },
    { gyro: { x: -0.3, y: 0.3, z: -0.1 },
      accel: { x: -0.047, y: -0.234, z: 0.984 },
      compass: { x: -123, y: -429, z: 262 }
    },
    { gyro: { x: -0.3, y: 0.3, z: -0.1 },
      accel: { x: -0.047, y: -0.234, z: 0.984 },
      compass: { x: -123, y: -429, z: 262 }
    },
    { gyro: { x: -0.1, y: 0.1, z: -0.1 },
      accel: { x: 0, y: -0.234, z: 0.984 },
      compass: { x: -123, y: -429, z: 262 }
    },
    { gyro: { x: -0.1, y: 0.1, z: -0.1 },
      accel: { x: 0.047, y: -0.234, z: 1.031 },
      compass: { x: -126, y: -426, z: 261 }
    },
    { gyro: { x: -0.1, y: -0.1, z: 0.1 },
      accel: { x: -0.047, y: -0.234, z: 0.938 },
      compass: { x: -126, y: -426, z: 261 }
    },
    { gyro: { x: -0.1, y: 0, z: -0.1 },
      accel: { x: 0, y: -0.234, z: 0.984 },
      compass: { x: -126, y: -426, z: 261 }
    },
    { gyro: { x: -0.1, y: 0, z: -0.1 },
      accel: { x: -0.047, y: -0.234, z: 0.984 },
      compass: { x: -124, y: -427, z: 259 }
    },
    { gyro: { x: -0.3, y: -0.2, z: -0.1 },
      accel: { x: 0, y: -0.234, z: 0.938 },
      compass: { x: -124, y: -427, z: 259 }
    },
    { gyro: { x: -0.1, y: -0.1, z: -0.1 },
      accel: { x: 0, y: -0.281, z: 0.984 },
      compass: { x: -124, y: -427, z: 259 }
    },
    { gyro: { x: -0.1, y: -0.1, z: -0.1 },
      accel: { x: 0.047, y: -0.234, z: 0.984 },
      compass: { x: -123, y: -426, z: 257 }
    },
    { gyro: { x: -0.3, y: -0.1, z: -0.1 },
      accel: { x: -0.047, y: -0.234, z: 0.984 },
      compass: { x: -123, y: -426, z: 257 }
    },
    { gyro: { x: -0.2, y: 0.1, z: 0.2 },
      accel: { x: -0.047, y: -0.188, z: 0.984 },
      compass: { x: -123, y: -426, z: 257 }
    },
    { gyro: { x: -0.2, y: 0.1, z: 0.2 },
      accel: { x: 0, y: -0.234, z: 0.938 },
      compass: { x: -123, y: -426, z: 257 }
    },
    { gyro: { x: -0.1, y: 0, z: 0 },
      accel: { x: 0, y: -0.281, z: 0.938 },
      compass: { x: -126, y: -430, z: 259 }
    },
    { gyro: { x: -0.1, y: 0, z: 0 },
      accel: { x: 0.047, y: -0.234, z: 0.938 },
      compass: { x: -126, y: -430, z: 259 }
    },
    { gyro: { x: 0.3, y: -0.1, z: 0.2 },
      accel: { x: -0.094, y: -0.234, z: 0.984 },
      compass: { x: -126, y: -430, z: 259 }
    },
    { gyro: { x: -0.2, y: -0.3, z: -0.2 },
      accel: { x: 0, y: -0.188, z: 0.938 },
      compass: { x: -124, y: -429, z: 259 }
    },
    { gyro: { x: -0.2, y: -0.3, z: -0.2 },
      accel: { x: -0.047, y: -0.281, z: 0.984 },
      compass: { x: -124, y: -429, z: 259 }
    },
    { gyro: { x: -0.3, y: 0, z: 0 },
      accel: { x: 0, y: -0.234, z: 0.984 },
      compass: { x: -124, y: -429, z: 259 }
    },
    { gyro: { x: -0.3, y: 0.2, z: -0.1 },
      accel: { x: 0, y: -0.234, z: 1.031 },
      compass: { x: -125, y: -429, z: 263 }
    },
    { gyro: { x: -0.3, y: 0.2, z: -0.1 },
      accel: { x: -0.094, y: -0.281, z: 0.938 },
      compass: { x: -125, y: -429, z: 263 }
    },
    { gyro: { x: -0.4, y: -0.1, z: -0.1 },
      accel: { x: -0.047, y: -0.188, z: 0.984 },
      compass: { x: -125, y: -429, z: 263 }
    },
    { gyro: { x: -0.1, y: 0.2, z: 0 },
      accel: { x: 0, y: -0.234, z: 0.984 },
      compass: { x: -123, y: -429, z: 260 }
    },
    { gyro: { x: -0.1, y: 0.2, z: 0 },
      accel: { x: -0.094, y: -0.234, z: 0.984 },
      compass: { x: -123, y: -429, z: 260 }
    },
    { gyro: { x: -0.3, y: 0.1, z: -0.1 },
      accel: { x: 0, y: -0.234, z: 0.984 },
      compass: { x: -123, y: -429, z: 260 }
    },
    { gyro: { x: -0.1, y: 0, z: 0.1 },
      accel: { x: 0, y: -0.234, z: 0.938 },
      compass: { x: -126, y: -427, z: 259 }
    },
    { gyro: { x: 0.1, y: 0.1, z: 0 },
      accel: { x: -0.047, y: -0.281, z: 1.031 },
      compass: { x: -126, y: -427, z: 259 }
    },
    { gyro: { x: 0.1, y: 0.1, z: 0 },
      accel: { x: 0, y: -0.281, z: 0.938 },
      compass: { x: -126, y: -427, z: 259 }
    },
    { gyro: { x: -0.1, y: -0.1, z: 0 },
      accel: { x: 0, y: -0.234, z: 0.938 },
      compass: { x: -125, y: -429, z: 259 }
    },
    { gyro: { x: -0.1, y: -0.1, z: 0 },
      accel: { x: 0, y: -0.281, z: 0.984 },
      compass: { x: -125, y: -429, z: 259 }
    },
    { gyro: { x: -0.1, y: 0, z: 0 },
      accel: { x: 0.047, y: -0.234, z: 0.984 },
      compass: { x: -125, y: -429, z: 259 }
    },
    { gyro: { x: -0.1, y: -0.3, z: -0.2 },
      accel: { x: 0, y: -0.281, z: 0.984 },
      compass: { x: -127, y: -427, z: 261 }
    },
    { gyro: { x: -0.1, y: -0.3, z: -0.2 },
      accel: { x: -0.094, y: -0.281, z: 0.984 },
      compass: { x: -127, y: -427, z: 261 }
    },
    { gyro: { x: 0.1, y: 0.1, z: 0 },
      accel: { x: -0.047, y: -0.281, z: 0.984 },
      compass: { x: -127, y: -427, z: 261 }
    },
    { gyro: { x: -0.1, y: -0.1, z: 0 },
      accel: { x: 0, y: -0.281, z: 0.984 },
      compass: { x: -128, y: -425, z: 259 }
    },
    { gyro: { x: -0.1, y: -0.1, z: 0 },
      accel: { x: 0.094, y: -0.234, z: 0.984 },
      compass: { x: -128, y: -425, z: 259 }
    },
    { gyro: { x: -0.1, y: 0, z: 0.1 },
      accel: { x: 0, y: -0.234, z: 0.938 },
      compass: { x: -128, y: -425, z: 259 }
    },
    { gyro: { x: -0.1, y: 0.1, z: -0.1 },
      accel: { x: -0.047, y: -0.234, z: 1.031 },
      compass: { x: -124, y: -429, z: 265 }
    },
    { gyro: { x: -0.1, y: 0, z: -0.1 },
      accel: { x: -0.047, y: -0.234, z: 1.031 },
      compass: { x: -124, y: -429, z: 265 }
    },
    { gyro: { x: -0.1, y: 0, z: -0.1 },
      accel: { x: 0.047, y: -0.234, z: 0.938 },
      compass: { x: -124, y: -429, z: 265 }
    },
    { gyro: { x: -0.2, y: 0.1, z: -0.1 },
      accel: { x: -0.047, y: -0.234, z: 0.984 },
      compass: { x: -126, y: -425, z: 259 }
    },
    { gyro: { x: -0.1, y: -0.3, z: -0.3 },
      accel: { x: 0, y: -0.188, z: 0.984 },
      compass: { x: -126, y: -425, z: 259 }
    },
    { gyro: { x: -0.1, y: -0.3, z: -0.3 },
      accel: { x: -0.047, y: -0.281, z: 0.938 },
      compass: { x: -126, y: -425, z: 259 }
    },
    { gyro: { x: -0.2, y: -0.1, z: -0.1 },
      accel: { x: 0, y: -0.234, z: 0.938 },
      compass: { x: -123, y: -428, z: 259 }
    },
    { gyro: { x: -0.2, y: 0.1, z: 0.2 },
      accel: { x: 0, y: -0.234, z: 1.031 },
      compass: { x: -123, y: -428, z: 259 }
    },
    { gyro: { x: -0.2, y: 0.1, z: 0.2 },
      accel: { x: -0.047, y: -0.234, z: 0.984 },
      compass: { x: -123, y: -428, z: 259 }
    },
    { gyro: { x: -0.2, y: 0.4, z: 0.5 },
      accel: { x: 0, y: -0.281, z: 0.938 },
      compass: { x: -124, y: -427, z: 261 }
    },
    { gyro: { x: -0.2, y: -0.3, z: 0.2 },
      accel: { x: 0.047, y: -0.234, z: 0.984 },
      compass: { x: -124, y: -427, z: 261 }
    },
    { gyro: { x: -0.2, y: -0.3, z: 0.2 },
      accel: { x: -0.047, y: -0.234, z: 0.984 },
      compass: { x: -124, y: -427, z: 261 }
    },
    { gyro: { x: -0.6, y: -0.5, z: -0.3 },
      accel: { x: 0, y: -0.281, z: 0.938 },
      compass: { x: -125, y: -427, z: 260 }
    },
    { gyro: { x: 0.4, y: 1.1, z: 0.2 },
      accel: { x: -0.047, y: -0.188, z: 0.984 },
      compass: { x: -125, y: -427, z: 260 }
    },
    { gyro: { x: 0.4, y: 1.1, z: 0.2 },
      accel: { x: -0.047, y: -0.234, z: 0.938 },
      compass: { x: -125, y: -427, z: 260 }
    },
    { gyro: { x: -0.1, y: -0.2, z: -0.4 },
      accel: { x: -0.047, y: -0.234, z: 1.031 },
      compass: { x: -125, y: -427, z: 260 }
    },
    { gyro: { x: -0.2, y: -0.4, z: -0.3 },
      accel: { x: 0, y: -0.234, z: 0.984 },
      compass: { x: -125, y: -427, z: 260 }
    },
    { gyro: { x: -0.2, y: -0.4, z: -0.3 },
      accel: { x: -0.047, y: -0.188, z: 0.984 },
      compass: { x: -125, y: -427, z: 260 }
    },
    { gyro: { x: 0.3, y: 0.5, z: 0.4 },
      accel: { x: 0, y: -0.281, z: 0.984 },
      compass: { x: -123, y: -429, z: 257 }
    },
    { gyro: { x: -0.9, y: -1.9, z: 0.8 },
      accel: { x: 0, y: -0.188, z: 1.031 },
      compass: { x: -123, y: -429, z: 257 }
    },
    { gyro: { x: -0.9, y: -1.9, z: 0.8 },
      accel: { x: 0, y: -0.281, z: 0.891 },
      compass: { x: -123, y: -429, z: 257 }
    },
    { gyro: { x: 2.1, y: 0.8, z: 0.2 },
      accel: { x: -0.094, y: -0.281, z: 0.984 },
      compass: { x: -126, y: -428, z: 256 }
    },
    { gyro: { x: 0.5, y: 1.5, z: -0.3 },
      accel: { x: 0, y: -0.281, z: 0.984 },
      compass: { x: -126, y: -428, z: 256 }
    },
    { gyro: { x: 0.5, y: 1.5, z: -0.3 },
      accel: { x: -0.047, y: -0.234, z: 0.938 },
      compass: { x: -126, y: -428, z: 256 }
    },
    { gyro: { x: -3.8, y: 0, z: -0.4 },
      accel: { x: 0.047, y: -0.281, z: 0.984 },
      compass: { x: -124, y: -426, z: 259 }
    },
    { gyro: { x: -1.1, y: 1.5, z: 0.8 },
      accel: { x: -0.047, y: -0.234, z: 0.938 },
      compass: { x: -124, y: -426, z: 259 }
    },
    { gyro: { x: -1.1, y: 1.5, z: 0.8 },
      accel: { x: -0.047, y: -0.281, z: 1.031 },
      compass: { x: -124, y: -426, z: 259 }
    },
    { gyro: { x: -2.5, y: 0.8, z: 2.3 },
      accel: { x: -0.047, y: -0.281, z: 1.031 },
      compass: { x: -127, y: -427, z: 262 }
    },
    { gyro: { x: -2.5, y: 0.8, z: 2.3 },
      accel: { x: -0.047, y: -0.234, z: 1.125 },
      compass: { x: -127, y: -427, z: 262 }
    },
    { gyro: { x: -3.5, y: -5.9, z: -1 },
      accel: { x: -0.047, y: -0.234, z: 0.891 },
      compass: { x: -127, y: -427, z: 262 }
    },
    { gyro: { x: -5, y: -0.8, z: 1.7 },
      accel: { x: 0, y: -0.234, z: 0.984 },
      compass: { x: -125, y: -427, z: 260 }
    },
    { gyro: { x: -5, y: -0.8, z: 1.7 },
      accel: { x: 0, y: -0.234, z: 1.078 },
      compass: { x: -125, y: -427, z: 260 }
    },
    { gyro: { x: -21.1, y: -7.7, z: 5.7 },
      accel: { x: -0.047, y: -0.234, z: 1.031 },
      compass: { x: -125, y: -427, z: 260 }
    },
    { gyro: { x: -22.2, y: -9, z: -3.2 },
      accel: { x: 0, y: -0.516, z: 0.938 },
      compass: { x: -123, y: -433, z: 251 }
    },
    { gyro: { x: -22.2, y: -9, z: -3.2 },
      accel: { x: 0, y: -0.375, z: 1.219 },
      compass: { x: -123, y: -433, z: 251 }
    },
    { gyro: { x: -41.5, y: -40.9, z: 6.6 },
      accel: { x: 0.047, y: -0.281, z: 1.313 },
      compass: { x: -123, y: -433, z: 251 }
    },
    { gyro: { x: -34.4, y: -80.2, z: 26.7 },
      accel: { x: 0, y: -0.234, z: 1.313 },
      compass: { x: -123, y: -433, z: 251 }
    },
    { gyro: { x: -34.4, y: -80.2, z: 26.7 },
      accel: { x: -0.141, y: -0.141, z: 1.172 },
      compass: { x: -123, y: -433, z: 251 }
    },
    { gyro: { x: -31.3, y: -119.1, z: 22.6 },
      accel: { x: 0.047, y: -0.422, z: 0.984 },
      compass: { x: -123, y: -433, z: 251 }
    },
    { gyro: { x: 14.9, y: 2.7, z: -23.3 },
      accel: { x: 0.094, y: -0.516, z: 0.844 },
      compass: { x: -102, y: -458, z: 234 }
    },
    { gyro: { x: -19.7, y: 4.2, z: -48.5 },
      accel: { x: 0.094, y: -0.422, z: 0.984 },
      compass: { x: -102, y: -458, z: 234 }
    },
    { gyro: { x: -19.7, y: 4.2, z: -48.5 },
      accel: { x: -0.047, y: -0.188, z: 1.031 },
      compass: { x: -102, y: -458, z: 234 }
    },
    { gyro: { x: -39.2, y: 3.6, z: -36.9 },
      accel: { x: 0.047, y: -0.188, z: 0.938 },
      compass: { x: -83, y: -471, z: 220 }
    },
    { gyro: { x: -30.7, y: -15.2, z: -26.1 },
      accel: { x: -0.047, y: -0.422, z: 1.125 },
      compass: { x: -83, y: -471, z: 220 }
    },
    { gyro: { x: -30.7, y: -15.2, z: -26.1 },
      accel: { x: 0.141, y: -0.375, z: 1.406 },
      compass: { x: -83, y: -471, z: 220 }
    },
    { gyro: { x: -44.7, y: -105, z: -13.7 },
      accel: { x: 0.047, y: -0.375, z: 1.078 },
      compass: { x: -62, y: -483, z: 213 }
    },
    { gyro: { x: -44.4, y: -84.4, z: -4.6 },
      accel: { x: 0.141, y: -0.469, z: 0.609 },
      compass: { x: -62, y: -483, z: 213 }
    },
    { gyro: { x: -44.4, y: -84.4, z: -4.6 },
      accel: { x: 0.141, y: -0.422, z: 0.516 },
      compass: { x: -62, y: -483, z: 213 }
    },
    { gyro: { x: -21.4, y: -28.7, z: -13.5 },
      accel: { x: 0.141, y: -0.516, z: 0.609 },
      compass: { x: -40, y: -495, z: 201 }
    },
    { gyro: { x: -21.4, y: -28.7, z: -13.5 },
      accel: { x: 0.188, y: -0.516, z: 0.938 },
      compass: { x: -40, y: -495, z: 201 }
    },
    { gyro: { x: -18.6, y: -39.8, z: -18.8 },
      accel: { x: 0.328, y: -0.469, z: 1.031 },
      compass: { x: -40, y: -495, z: 201 }
    },
    { gyro: { x: -15.3, y: -57.6, z: -22.7 },
      accel: { x: 0.375, y: -0.422, z: 0.984 },
      compass: { x: -40, y: -495, z: 201 }
    },
    { gyro: { x: -15.3, y: -57.6, z: -22.7 },
      accel: { x: 0.375, y: -0.375, z: 0.938 },
      compass: { x: -40, y: -495, z: 201 }
    },
    { gyro: { x: -1.3, y: -47.6, z: -20.9 },
      accel: { x: 0.422, y: -0.422, z: 0.984 },
      compass: { x: -40, y: -495, z: 201 }
    },
    { gyro: { x: 12.1, y: -57.8, z: -16.1 },
      accel: { x: 0.375, y: -0.375, z: 0.984 },
      compass: { x: -40, y: -495, z: 201 }
    },
    { gyro: { x: 12.1, y: -57.8, z: -16.1 },
      accel: { x: 0.422, y: -0.375, z: 0.984 },
      compass: { x: 3, y: -504, z: 199 }
    },
    { gyro: { x: 11.1, y: -63.7, z: -9.3 },
      accel: { x: 0.375, y: -0.328, z: 0.891 },
      compass: { x: 3, y: -504, z: 199 }
    },
    { gyro: { x: 17.3, y: -71.1, z: -11.5 },
      accel: { x: 0.422, y: -0.422, z: 0.938 },
      compass: { x: 3, y: -504, z: 199 }
    },
    { gyro: { x: 17.3, y: -71.1, z: -11.5 },
      accel: { x: 0.469, y: -0.469, z: 0.984 },
      compass: { x: 28, y: -504, z: 205 }
    },
    { gyro: { x: 16.3, y: -87.6, z: -24.9 },
      accel: { x: 0.469, y: -0.516, z: 0.891 },
      compass: { x: 28, y: -504, z: 205 }
    },
    { gyro: { x: 4.5, y: -89.3, z: -28 },
      accel: { x: 0.516, y: -0.469, z: 0.844 },
      compass: { x: 28, y: -504, z: 205 }
    },
    { gyro: { x: 4.5, y: -89.3, z: -28 },
      accel: { x: 0.563, y: -0.516, z: 0.797 },
      compass: { x: 64, y: -499, z: 205 }
    },
    { gyro: { x: 6, y: -95.9, z: -37.6 },
      accel: { x: 0.563, y: -0.422, z: 0.844 },
      compass: { x: 64, y: -499, z: 205 }
    },
    { gyro: { x: 4.5, y: -106.6, z: -35.5 },
      accel: { x: 0.563, y: -0.281, z: 0.797 },
      compass: { x: 64, y: -499, z: 205 }
    },
    { gyro: { x: 18.4, y: -96.2, z: -10.9 },
      accel: { x: 0.609, y: -0.328, z: 0.609 },
      compass: { x: 109, y: -497, z: 195 }
    },
    { gyro: { x: 22.2, y: -84.7, z: -22.2 },
      accel: { x: 0.609, y: -0.609, z: 0.703 },
      compass: { x: 109, y: -497, z: 195 }
    },
    { gyro: { x: 16.9, y: -77.5, z: -36 },
      accel: { x: 0.656, y: -0.422, z: 0.563 },
      compass: { x: 145, y: -493, z: 193 }
    },
    { gyro: { x: 16.9, y: -77.5, z: -36 },
      accel: { x: 0.609, y: -0.469, z: 0.609 },
      compass: { x: 145, y: -493, z: 193 }
    },
    { gyro: { x: 25, y: -73.5, z: -39.7 },
      accel: { x: 0.703, y: -0.469, z: 0.609 },
      compass: { x: 182, y: -481, z: 188 }
    },
    { gyro: { x: 40.1, y: -77.7, z: -66.9 },
      accel: { x: 0.609, y: -0.516, z: 0.609 },
      compass: { x: 182, y: -481, z: 188 }
    },
    { gyro: { x: 40.1, y: -77.7, z: -66.9 },
      accel: { x: 0.75, y: -0.234, z: 0.516 },
      compass: { x: 182, y: -481, z: 188 }
    },
    { gyro: { x: 36.8, y: -65.6, z: -61.3 },
      accel: { x: 0.75, y: -0.188, z: 0.469 },
      compass: { x: 232, y: -460, z: 189 }
    },
    { gyro: { x: 48.9, y: -51.1, z: -45 },
      accel: { x: 0.891, y: -0.234, z: 0.609 },
      compass: { x: 232, y: -460, z: 189 }
    },
    { gyro: { x: 65.4, y: -58.6, z: -64.5 },
      accel: { x: 0.797, y: -0.422, z: 0.563 },
      compass: { x: 232, y: -460, z: 189 }
    },
    { gyro: { x: 65.4, y: -58.6, z: -64.5 },
      accel: { x: 0.797, y: -0.375, z: 0.422 },
      compass: { x: 272, y: -426, z: 197 }
    },
    { gyro: { x: 57.7, y: -43.9, z: -85.1 },
      accel: { x: 0.891, y: -0.375, z: 0.469 },
      compass: { x: 272, y: -426, z: 197 }
    },
    { gyro: { x: 57.7, y: -43.9, z: -85.1 },
      accel: { x: 0.844, y: -0.141, z: 0.469 },
      compass: { x: 272, y: -426, z: 197 }
    },
    { gyro: { x: 63.4, y: -37.1, z: -85.7 },
      accel: { x: 0.891, y: -0.094, z: 0.516 },
      compass: { x: 314, y: -381, z: 204 }
    },
    { gyro: { x: 74.1, y: -40, z: -89.1 },
      accel: { x: 0.891, y: -0.094, z: 0.422 },
      compass: { x: 314, y: -381, z: 204 }
    },
    { gyro: { x: 74.1, y: -40, z: -89.1 },
      accel: { x: 0.938, y: -0.141, z: 0.422 },
      compass: { x: 314, y: -381, z: 204 }
    },
    { gyro: { x: 75.3, y: -30.3, z: -120.1 },
      accel: { x: 0.891, y: -0.281, z: 0.469 },
      compass: { x: 358, y: -318, z: 208 }
    },
    { gyro: { x: 75.4, y: -33.3, z: -151.8 },
      accel: { x: 0.984, y: -0.047, z: 0.422 },
      compass: { x: 358, y: -318, z: 208 }
    },
    { gyro: { x: 75.4, y: -33.3, z: -151.8 },
      accel: { x: 0.938, y: 0.234, z: 0.422 },
      compass: { x: 358, y: -318, z: 208 }
    },
    { gyro: { x: 45.9, y: -37.2, z: -139.7 },
      accel: { x: 0.797, y: 0.469, z: 0.234 },
      compass: { x: 402, y: -231, z: 208 }
    },
    { gyro: { x: 31.3, y: -19.1, z: -102.7 },
      accel: { x: 0.797, y: 0.563, z: 0.234 },
      compass: { x: 402, y: -231, z: 208 }
    },
    { gyro: { x: 31.3, y: -19.1, z: -102.7 },
      accel: { x: 0.891, y: 0.563, z: 0.281 },
      compass: { x: 402, y: -231, z: 208 }
    },
    { gyro: { x: 36.3, y: -18.1, z: -82.3 },
      accel: { x: 0.797, y: 0.422, z: 0.375 },
      compass: { x: 402, y: -231, z: 208 }
    },
    { gyro: { x: 30.5, y: -8.5, z: -94.8 },
      accel: { x: 0.703, y: 0.375, z: 0.188 },
      compass: { x: 402, y: -231, z: 208 }
    },
    { gyro: { x: 30.5, y: -8.5, z: -94.8 },
      accel: { x: 0.75, y: 0.422, z: 0.094 },
      compass: { x: 402, y: -231, z: 208 }
    },
    { gyro: { x: 24.1, y: 15.4, z: -100.3 },
      accel: { x: 0.75, y: 0.422, z: 0.188 },
      compass: { x: 402, y: -231, z: 208 }
    },
    { gyro: { x: 24.1, y: 15.4, z: -100.3 },
      accel: { x: 0.75, y: 0.656, z: 0.141 },
      compass: { x: 432, y: -112, z: 206 }
    },
    { gyro: { x: 15.5, y: 36.1, z: -90.1 },
      accel: { x: 0.703, y: 0.609, z: 0.141 },
      compass: { x: 432, y: -112, z: 206 }
    },
    { gyro: { x: 14.3, y: 57.9, z: -82 },
      accel: { x: 0.609, y: 0.563, z: 0.281 },
      compass: { x: 414, y: -65, z: 226 }
    },
    { gyro: { x: 7.5, y: 63.3, z: -82.6 },
      accel: { x: 0.703, y: 0.609, z: 0.375 },
      compass: { x: 414, y: -65, z: 226 }
    },
    { gyro: { x: -6.3, y: 63, z: -88.4 },
      accel: { x: 0.609, y: 0.656, z: 0.281 },
      compass: { x: 414, y: -65, z: 226 }
    },
    { gyro: { x: -6.3, y: 63, z: -88.4 },
      accel: { x: 0.609, y: 0.797, z: 0.375 },
      compass: { x: 396, y: -25, z: 249 }
    },
    { gyro: { x: -20, y: 72.1, z: -76 },
      accel: { x: 0.609, y: 0.844, z: 0.422 },
      compass: { x: 396, y: -25, z: 249 }
    },
    { gyro: { x: -33.2, y: 66.8, z: -61.1 },
      accel: { x: 0.563, y: 0.75, z: 0.516 },
      compass: { x: 396, y: -25, z: 249 }
    },
    { gyro: { x: -33.2, y: 66.8, z: -61.1 },
      accel: { x: 0.469, y: 0.609, z: 0.516 },
      compass: { x: 359, y: -3, z: 275 }
    },
    { gyro: { x: -38, y: 67.5, z: -62.6 },
      accel: { x: 0.516, y: 0.75, z: 0.469 },
      compass: { x: 359, y: -3, z: 275 }
    },
    { gyro: { x: -29.6, y: 86.3, z: -69.7 },
      accel: { x: 0.469, y: 0.656, z: 0.422 },
      compass: { x: 359, y: -3, z: 275 }
    },
    { gyro: { x: -29.6, y: 86.3, z: -69.7 },
      accel: { x: 0.328, y: 0.563, z: 0.563 },
      compass: { x: 324, y: 18, z: 306 }
    },
    { gyro: { x: -19.8, y: 93.5, z: -87.6 },
      accel: { x: 0.375, y: 0.656, z: 0.563 },
      compass: { x: 324, y: 18, z: 306 }
    },
    { gyro: { x: -19.6, y: 95.2, z: -86.6 },
      accel: { x: 0.328, y: 0.703, z: 0.703 },
      compass: { x: 324, y: 18, z: 306 }
    },
    { gyro: { x: -19.6, y: 95.2, z: -86.6 },
      accel: { x: 0.328, y: 0.75, z: 0.75 },
      compass: { x: 270, y: 42, z: 337 }
    },
    { gyro: { x: -33.7, y: 81.4, z: -74.9 },
      accel: { x: 0.188, y: 0.703, z: 0.75 },
      compass: { x: 270, y: 42, z: 337 }
    },
    { gyro: { x: -41.2, y: 78.8, z: -62.6 },
      accel: { x: 0.141, y: 0.797, z: 0.703 },
      compass: { x: 223, y: 43, z: 357 }
    },
    { gyro: { x: -42.6, y: 71.2, z: -53.8 },
      accel: { x: 0.094, y: 0.75, z: 0.75 },
      compass: { x: 223, y: 43, z: 357 }
    },
    { gyro: { x: -47.4, y: 56.1, z: -44.2 },
      accel: { x: 0.141, y: 0.75, z: 0.75 },
      compass: { x: 223, y: 43, z: 357 }
    },
    { gyro: { x: -47.4, y: 56.1, z: -44.2 },
      accel: { x: 0, y: 0.656, z: 0.656 },
      compass: { x: 223, y: 43, z: 357 }
    },
    { gyro: { x: -56.1, y: 64.6, z: -40.3 },
      accel: { x: -0.047, y: 0.75, z: 0.563 },
      compass: { x: 223, y: 43, z: 357 }
    },
    { gyro: { x: -56.1, y: 64.6, z: -40.3 },
      accel: { x: -0.047, y: 0.891, z: 0.609 },
      compass: { x: 223, y: 43, z: 357 }
    },
    { gyro: { x: -37.6, y: 81.9, z: -25.9 },
      accel: { x: 0.047, y: 0.656, z: 0.797 },
      compass: { x: 223, y: 43, z: 357 }
    },
    { gyro: { x: -49.7, y: 86.2, z: -33.9 },
      accel: { x: -0.047, y: 0.422, z: 0.844 },
      compass: { x: 223, y: 43, z: 357 }
    },
    { gyro: { x: -49.7, y: 86.2, z: -33.9 },
      accel: { x: -0.141, y: 0.469, z: 0.891 },
      compass: { x: 223, y: 43, z: 357 }
    },
    { gyro: { x: -50.6, y: 70.4, z: -32.3 },
      accel: { x: -0.047, y: 0.75, z: 0.984 },
      compass: { x: 223, y: 43, z: 357 }
    },
    { gyro: { x: -75.9, y: 48.1, z: -13.1 },
      accel: { x: -0.141, y: 0.656, z: 0.938 },
      compass: { x: 95, y: -2, z: 404 }
    },
    { gyro: { x: -75.9, y: 48.1, z: -13.1 },
      accel: { x: -0.234, y: 0.609, z: 0.703 },
      compass: { x: 95, y: -2, z: 404 }
    },
    { gyro: { x: -89.3, y: 51.4, z: -3.5 },
      accel: { x: -0.188, y: 0.656, z: 0.656 },
      compass: { x: 67, y: -50, z: 412 }
    },
    { gyro: { x: -77.1, y: 59, z: 9.6 },
      accel: { x: -0.141, y: 0.75, z: 0.797 },
      compass: { x: 67, y: -50, z: 412 }
    },
    { gyro: { x: -57.3, y: 57.2, z: 16.8 },
      accel: { x: -0.188, y: 0.656, z: 0.844 },
      compass: { x: 67, y: -50, z: 412 }
    },
    { gyro: { x: -57.3, y: 57.2, z: 16.8 },
      accel: { x: -0.281, y: 0.516, z: 0.891 },
      compass: { x: 34, y: -87, z: 411 }
    },
    { gyro: { x: -57.6, y: 56.3, z: 11.7 },
      accel: { x: -0.281, y: 0.469, z: 0.891 },
      compass: { x: 34, y: -87, z: 411 }
    },
    { gyro: { x: -57.6, y: 56.3, z: 11.7 },
      accel: { x: -0.281, y: 0.422, z: 0.844 },
      compass: { x: 34, y: -87, z: 411 }
    },
    { gyro: { x: -59.3, y: 58.4, z: 8.7 },
      accel: { x: -0.234, y: 0.375, z: 0.844 },
      compass: { x: 5, y: -117, z: 412 }
    },
    { gyro: { x: -37.8, y: 57.8, z: 15.4 },
      accel: { x: -0.188, y: 0.422, z: 0.984 },
      compass: { x: 5, y: -117, z: 412 }
    },
    { gyro: { x: -37.8, y: 57.8, z: 15.4 },
      accel: { x: -0.141, y: 0.469, z: 1.219 },
      compass: { x: 5, y: -117, z: 412 }
    },
    { gyro: { x: -44.7, y: 28.1, z: 18.3 },
      accel: { x: -0.094, y: 0.375, z: 1.266 },
      compass: { x: 5, y: -117, z: 412 }
    },
    { gyro: { x: -59.1, y: -1.8, z: 19.1 },
      accel: { x: -0.141, y: 0.281, z: 1.125 },
      compass: { x: -14, y: -144, z: 404 }
    },
    { gyro: { x: -59.1, y: -1.8, z: 19.1 },
      accel: { x: -0.188, y: 0.469, z: 0.938 },
      compass: { x: -14, y: -144, z: 404 }
    },
    { gyro: { x: -59, y: -5, z: 37.6 },
      accel: { x: -0.141, y: 0.328, z: 0.891 },
      compass: { x: -14, y: -144, z: 404 }
    },
    { gyro: { x: -55.9, y: 4.7, z: 44.1 },
      accel: { x: -0.234, y: 0.328, z: 0.984 },
      compass: { x: -15, y: -175, z: 398 }
    },
    { gyro: { x: -55.9, y: 4.7, z: 44.1 },
      accel: { x: -0.234, y: 0.281, z: 0.984 },
      compass: { x: -15, y: -175, z: 398 }
    },
    { gyro: { x: -72.3, y: -13, z: 52.7 },
      accel: { x: -0.234, y: 0.234, z: 1.031 },
      compass: { x: -15, y: -175, z: 398 }
    },
    { gyro: { x: -83.8, y: -5.6, z: 65.1 },
      accel: { x: -0.234, y: 0.375, z: 0.844 },
      compass: { x: -18, y: -212, z: 393 }
    },
    { gyro: { x: -83.8, y: -5.6, z: 65.1 },
      accel: { x: -0.188, y: 0.234, z: 0.984 },
      compass: { x: -18, y: -212, z: 393 }
    },
    { gyro: { x: -79.9, y: -7, z: 71.4 },
      accel: { x: -0.141, y: 0.141, z: 1.078 },
      compass: { x: -18, y: -212, z: 393 }
    },
    { gyro: { x: -81, y: -36.5, z: 64.6 },
      accel: { x: -0.094, y: 0.234, z: 1.125 },
      compass: { x: -25, y: -256, z: 381 }
    },
    { gyro: { x: -81, y: -36.5, z: 64.6 },
      accel: { x: -0.141, y: 0.375, z: 1.078 },
      compass: { x: -25, y: -256, z: 381 }
    },
    { gyro: { x: -74.4, y: -39.4, z: 84.2 },
      accel: { x: -0.188, y: 0.281, z: 0.984 },
      compass: { x: -25, y: -256, z: 381 }
    },
    { gyro: { x: -74.4, y: -39.4, z: 84.2 },
      accel: { x: -0.188, y: 0.188, z: 1.031 },
      compass: { x: -22, y: -290, z: 361 }
    },
    { gyro: { x: -43.3, y: -31, z: 86.4 },
      accel: { x: -0.094, y: 0.141, z: 0.984 },
      compass: { x: -22, y: -290, z: 361 }
    },
    { gyro: { x: -20.2, y: -24.1, z: 82.1 },
      accel: { x: 0, y: 0.047, z: 1.219 },
      compass: { x: -22, y: -290, z: 361 }
    },
    { gyro: { x: -20.2, y: -24.1, z: 82.1 },
      accel: { x: -0.047, y: 0.047, z: 1.313 },
      compass: { x: -27, y: -305, z: 354 }
    },
    { gyro: { x: -35.2, y: -65.7, z: 85.3 },
      accel: { x: 0, y: 0, z: 1.219 },
      compass: { x: -27, y: -305, z: 354 }
    },
    { gyro: { x: -35.2, y: -65.7, z: 85.3 },
      accel: { x: 0, y: 0.094, z: 1.219 },
      compass: { x: -20, y: -321, z: 348 }
    },
    { gyro: { x: -38.8, y: -73.5, z: 82.9 },
      accel: { x: -0.047, y: 0, z: 0.984 },
      compass: { x: -20, y: -321, z: 348 }
    },
    { gyro: { x: -24.8, y: -45.1, z: 74.2 },
      accel: { x: 0.047, y: -0.047, z: 0.844 },
      compass: { x: -20, y: -321, z: 348 }
    },
    { gyro: { x: -24.8, y: -45.1, z: 74.2 },
      accel: { x: -0.047, y: -0.094, z: 0.938 },
      compass: { x: -20, y: -321, z: 348 }
    },
    { gyro: { x: -8.6, y: -23.7, z: 60.2 },
      accel: { x: 0, y: -0.047, z: 0.938 },
      compass: { x: -20, y: -321, z: 348 }
    },
    { gyro: { x: 3.9, y: -16.2, z: 50.2 },
      accel: { x: 0.094, y: -0.094, z: 0.938 },
      compass: { x: -20, y: -321, z: 348 }
    },
    { gyro: { x: 3.9, y: -16.2, z: 50.2 },
      accel: { x: 0.141, y: 0.047, z: 0.984 },
      compass: { x: -20, y: -321, z: 348 }
    },
    { gyro: { x: 12.9, y: 0.1, z: 51.5 },
      accel: { x: 0.141, y: 0, z: 0.797 },
      compass: { x: -31, y: -340, z: 341 }
    },
    { gyro: { x: 6.2, y: 11.9, z: 47.6 },
      accel: { x: 0.141, y: 0, z: 0.938 },
      compass: { x: -44, y: -331, z: 342 }
    },
    { gyro: { x: 6.2, y: 11.9, z: 47.6 },
      accel: { x: 0.094, y: -0.141, z: 0.938 },
      compass: { x: -44, y: -331, z: 342 }
    },
    { gyro: { x: -10.7, y: 11.8, z: 38.5 },
      accel: { x: 0.188, y: -0.094, z: 0.891 },
      compass: { x: -44, y: -331, z: 342 }
    },
    { gyro: { x: -10.7, y: 11.8, z: 38.5 },
      accel: { x: 0.094, y: -0.141, z: 0.938 },
      compass: { x: -44, y: -331, z: 342 }
    },
    { gyro: { x: -21.6, y: 17, z: 42.9 },
      accel: { x: 0.094, y: -0.047, z: 0.938 },
      compass: { x: -44, y: -331, z: 342 }
    },
    { gyro: { x: -13.6, y: 21.4, z: 36.5 },
      accel: { x: 0.094, y: -0.141, z: 0.938 },
      compass: { x: -44, y: -331, z: 342 }
    },
    { gyro: { x: -13.6, y: 21.4, z: 36.5 },
      accel: { x: 0.188, y: -0.047, z: 1.031 },
      compass: { x: -44, y: -331, z: 342 }
    },
    { gyro: { x: -12, y: 22.2, z: 24.7 },
      accel: { x: 0.141, y: -0.094, z: 1.172 },
      compass: { x: -44, y: -331, z: 342 }
    },
    { gyro: { x: -37.8, y: 13.5, z: 6.2 },
      accel: { x: 0.047, y: -0.234, z: 1.125 },
      compass: { x: -44, y: -331, z: 342 }
    },
    { gyro: { x: -37.8, y: 13.5, z: 6.2 },
      accel: { x: 0.141, y: -0.141, z: 1.172 },
      compass: { x: -44, y: -331, z: 342 }
    },
    { gyro: { x: -46.5, y: 12.9, z: 11.2 },
      accel: { x: -0.047, y: 0.047, z: 1.125 },
      compass: { x: -96, y: -349, z: 327 }
    },
    { gyro: { x: -27.3, y: 6.9, z: 12.8 },
      accel: { x: 0.047, y: -0.094, z: 1.078 },
      compass: { x: -96, y: -349, z: 327 }
    },
    { gyro: { x: -27.3, y: 6.9, z: 12.8 },
      accel: { x: 0, y: 0, z: 1.125 },
      compass: { x: -96, y: -349, z: 327 }
    },
    { gyro: { x: -19.5, y: 2.7, z: 11.2 },
      accel: { x: 0.047, y: -0.141, z: 0.984 },
      compass: { x: -103, y: -360, z: 317 }
    },
    { gyro: { x: -19.5, y: 2.7, z: 11.2 },
      accel: { x: 0.047, y: -0.094, z: 0.938 },
      compass: { x: -103, y: -360, z: 317 }
    },
    { gyro: { x: -31, y: 12.4, z: 5.3 },
      accel: { x: -0.047, y: -0.094, z: 0.938 },
      compass: { x: -103, y: -360, z: 317 }
    },
    { gyro: { x: -47.6, y: 25.9, z: 15.5 },
      accel: { x: 0, y: 0, z: 0.891 },
      compass: { x: -112, y: -372, z: 305 }
    },
    { gyro: { x: -47.6, y: 25.9, z: 15.5 },
      accel: { x: 0.047, y: -0.047, z: 0.984 },
      compass: { x: -112, y: -372, z: 305 }
    },
    { gyro: { x: -63, y: 38.3, z: 15.6 },
      accel: { x: 0.141, y: -0.188, z: 1.125 },
      compass: { x: -128, y: -391, z: 294 }
    },
    { gyro: { x: -50.4, y: 29, z: 6.4 },
      accel: { x: 0.141, y: -0.141, z: 1.219 },
      compass: { x: -128, y: -391, z: 294 }
    },
    { gyro: { x: -50.5, y: 4.4, z: -0.9 },
      accel: { x: -0.047, y: -0.234, z: 1.078 },
      compass: { x: -128, y: -391, z: 294 }
    },
    { gyro: { x: -50.5, y: 4.4, z: -0.9 },
      accel: { x: -0.047, y: -0.188, z: 0.938 },
      compass: { x: -128, y: -391, z: 294 }
    },
    { gyro: { x: -19.5, y: 11.4, z: 2.9 },
      accel: { x: -0.047, y: -0.188, z: 0.844 },
      compass: { x: -135, y: -410, z: 268 }
    },
    { gyro: { x: -9, y: 9.3, z: 3.2 },
      accel: { x: -0.094, y: -0.234, z: 1.078 },
      compass: { x: -135, y: -410, z: 268 }
    },
    { gyro: { x: -9, y: 9.3, z: 3.2 },
      accel: { x: 0, y: -0.234, z: 1.031 },
      compass: { x: -135, y: -410, z: 268 }
    },
    { gyro: { x: -4.7, y: 0.3, z: 6.8 },
      accel: { x: 0, y: -0.188, z: 0.984 },
      compass: { x: -142, y: -410, z: 268 }
    },
    { gyro: { x: -16.3, y: 68.7, z: -14.9 },
      accel: { x: -0.281, y: -0.375, z: 0.656 },
      compass: { x: -142, y: -410, z: 268 }
    },
    { gyro: { x: -16.3, y: 68.7, z: -14.9 },
      accel: { x: 0, y: -0.047, z: 0.281 },
      compass: { x: -142, y: -410, z: 268 }
    },
    { gyro: { x: -13.5, y: -16.3, z: 1.7 },
      accel: { x: 0.047, y: -0.141, z: 0.938 },
      compass: { x: -135, y: -423, z: 259 }
    },
    { gyro: { x: -13.5, y: -16.3, z: 1.7 },
      accel: { x: -0.047, y: -0.328, z: 0.938 },
      compass: { x: -135, y: -423, z: 259 }
    },
    { gyro: { x: -6.1, y: -6.8, z: -5.1 },
      accel: { x: 0, y: -0.234, z: 0.984 },
      compass: { x: -135, y: -423, z: 259 }
    },
    { gyro: { x: -9.4, y: -10.4, z: -3.5 },
      accel: { x: 0.094, y: -0.188, z: 1.031 },
      compass: { x: -129, y: -425, z: 252 }
    },
    { gyro: { x: -9.4, y: -10.4, z: -3.5 },
      accel: { x: 0, y: -0.188, z: 0.984 },
      compass: { x: -129, y: -425, z: 252 }
    },
    { gyro: { x: -5.7, y: -8.3, z: -2.2 },
      accel: { x: 0.047, y: -0.281, z: 0.75 },
      compass: { x: -129, y: -425, z: 252 }
    },
    { gyro: { x: 14.6, y: 10.3, z: 6.3 },
      accel: { x: 0.047, y: -0.234, z: 0.984 },
      compass: { x: -128, y: -425, z: 253 }
    },
    { gyro: { x: 14.6, y: 10.3, z: 6.3 },
      accel: { x: 0, y: -0.281, z: 0.891 },
      compass: { x: -128, y: -425, z: 253 }
    },
    { gyro: { x: 4.2, y: 6.7, z: 1.3 },
      accel: { x: -0.047, y: -0.234, z: 1.078 },
      compass: { x: -128, y: -425, z: 253 }
    },
    { gyro: { x: -1.3, y: -0.8, z: -1.3 },
      accel: { x: -0.047, y: -0.281, z: 0.938 },
      compass: { x: -132, y: -425, z: 261 }
    },
    { gyro: { x: -1.3, y: -0.8, z: -1.3 },
      accel: { x: 0.047, y: -0.234, z: 0.938 },
      compass: { x: -132, y: -425, z: 261 }
    },
    { gyro: { x: 0.2, y: 0.2, z: 0.8 },
      accel: { x: -0.047, y: -0.281, z: 0.938 },
      compass: { x: -132, y: -425, z: 261 }
    },
    { gyro: { x: -0.1, y: -0.1, z: 0.2 },
      accel: { x: 0, y: -0.234, z: 0.984 },
      compass: { x: -134, y: -426, z: 261 }
    },
    { gyro: { x: -0.1, y: -0.1, z: 0.2 },
      accel: { x: 0, y: -0.188, z: 1.031 },
      compass: { x: -134, y: -426, z: 261 }
    },
    { gyro: { x: -0.1, y: 0.3, z: 0.2 },
      accel: { x: 0, y: -0.188, z: 0.984 },
      compass: { x: -134, y: -426, z: 261 }
    },
    { gyro: { x: -0.1, y: 0.1, z: -0.1 },
      accel: { x: 0.047, y: -0.188, z: 0.984 },
      compass: { x: -134, y: -426, z: 261 }
    },
    { gyro: { x: -0.1, y: 0.1, z: -0.1 },
      accel: { x: 0.047, y: -0.234, z: 1.031 },
      compass: { x: -133, y: -422, z: 258 }
    },
    { gyro: { x: -0.5, y: -0.3, z: -0.4 },
      accel: { x: 0, y: -0.234, z: 0.984 },
      compass: { x: -133, y: -422, z: 258 }
    },
    { gyro: { x: -0.5, y: -0.3, z: -0.4 },
      accel: { x: 0, y: -0.234, z: 0.984 },
      compass: { x: -133, y: -422, z: 258 }
    },
    { gyro: { x: -0.2, y: 0.3, z: -0.1 },
      accel: { x: -0.047, y: -0.234, z: 0.938 },
      compass: { x: -130, y: -421, z: 256 }
    },
    { gyro: { x: -0.1, y: 0.3, z: 0.1 },
      accel: { x: -0.047, y: -0.328, z: 0.984 },
      compass: { x: -130, y: -421, z: 256 }
    },
    { gyro: { x: -0.1, y: 0.3, z: 0.1 },
      accel: { x: 0, y: -0.188, z: 0.984 },
      compass: { x: -130, y: -421, z: 256 }
    },
    { gyro: { x: -0.1, y: 0.1, z: 0 },
      accel: { x: -0.047, y: -0.188, z: 0.984 },
      compass: { x: -132, y: -421, z: 255 }
    },
    { gyro: { x: 0.1, y: -0.1, z: 0 },
      accel: { x: -0.047, y: -0.281, z: 0.984 },
      compass: { x: -132, y: -421, z: 255 }
    },
    { gyro: { x: 0.1, y: 0, z: 0.4 },
      accel: { x: -0.094, y: -0.281, z: 0.984 },
      compass: { x: -136, y: -428, z: 259 }
    },
    { gyro: { x: 0.1, y: 0, z: 0.4 },
      accel: { x: 0, y: -0.234, z: 1.031 },
      compass: { x: -136, y: -428, z: 259 }
    },
    { gyro: { x: -0.1, y: 0.1, z: -0.2 },
      accel: { x: 0.047, y: -0.188, z: 0.984 },
      compass: { x: -136, y: -428, z: 259 }
    },
    { gyro: { x: -0.1, y: 0.2, z: 0 },
      accel: { x: 0, y: -0.188, z: 0.938 },
      compass: { x: -136, y: -428, z: 259 }
    },
    { gyro: { x: -0.1, y: 0.2, z: 0 },
      accel: { x: 0, y: -0.281, z: 0.938 },
      compass: { x: -133, y: -427, z: 258 }
    },
    { gyro: { x: -0.1, y: -0.1, z: -0.1 },
      accel: { x: 0, y: -0.188, z: 0.984 },
      compass: { x: -133, y: -427, z: 258 }
    },
    { gyro: { x: -0.2, y: -0.1, z: 0.2 },
      accel: { x: 0, y: -0.234, z: 0.984 },
      compass: { x: -133, y: -427, z: 258 }
    },
    { gyro: { x: -0.2, y: -0.1, z: 0.2 },
      accel: { x: 0, y: -0.234, z: 0.984 },
      compass: { x: -134, y: -424, z: 261 }
    },
    { gyro: { x: 0, y: -0.1, z: -0.1 },
      accel: { x: 0.047, y: -0.234, z: 0.938 },
      compass: { x: -134, y: -424, z: 261 }
    },
    { gyro: { x: 0, y: 0.1, z: 0 },
      accel: { x: -0.047, y: -0.234, z: 0.984 },
      compass: { x: -134, y: -424, z: 261 }
    },
    { gyro: { x: 0.1, y: 0.1, z: 0 },
      accel: { x: 0, y: -0.281, z: 0.938 },
      compass: { x: -129, y: -422, z: 257 }
    },
    { gyro: { x: -0.1, y: -0.1, z: 0.3 },
      accel: { x: -0.047, y: -0.188, z: 0.938 },
      compass: { x: -129, y: -422, z: 257 }
    },
    { gyro: { x: -0.1, y: -0.1, z: 0.3 },
      accel: { x: 0.047, y: -0.234, z: 0.984 },
      compass: { x: -129, y: -422, z: 257 }
    },
    { gyro: { x: -0.2, y: -0.1, z: 0.2 },
      accel: { x: -0.047, y: -0.234, z: 0.938 },
      compass: { x: -130, y: -423, z: 258 }
    },
    { gyro: { x: -0.1, y: 0, z: 0.1 },
      accel: { x: 0, y: -0.281, z: 0.984 },
      compass: { x: -130, y: -423, z: 258 }
    },
    { gyro: { x: -0.1, y: 0, z: 0.1 },
      accel: { x: -0.047, y: -0.234, z: 0.984 },
      compass: { x: -130, y: -423, z: 258 }
    },
    { gyro: { x: -0.1, y: 0, z: -0.2 },
      accel: { x: 0.047, y: -0.281, z: 0.984 },
      compass: { x: -133, y: -424, z: 257 }
    },
    { gyro: { x: -0.2, y: 0.1, z: 0.1 },
      accel: { x: 0, y: -0.281, z: 0.938 },
      compass: { x: -133, y: -424, z: 257 }
    },
    { gyro: { x: -0.2, y: 0.1, z: 0.1 },
      accel: { x: 0, y: -0.281, z: 1.031 },
      compass: { x: -133, y: -424, z: 257 }
    },
    { gyro: { x: 0, y: -0.1, z: -0.2 },
      accel: { x: 0.047, y: -0.234, z: 1.031 },
      compass: { x: -133, y: -423, z: 260 }
    },
    { gyro: { x: -0.1, y: 0, z: 0 },
      accel: { x: 0, y: -0.188, z: 1.031 },
      compass: { x: -133, y: -423, z: 260 }
    },
    { gyro: { x: -0.1, y: 0, z: 0 },
      accel: { x: -0.047, y: -0.328, z: 1.031 },
      compass: { x: -133, y: -423, z: 260 }
    },
    { gyro: { x: 0.1, y: -0.1, z: -0.3 },
      accel: { x: 0, y: -0.234, z: 0.938 },
      compass: { x: -136, y: -424, z: 261 }
    },
    { gyro: { x: -0.2, y: 0, z: -0.1 },
      accel: { x: 0, y: -0.328, z: 0.938 },
      compass: { x: -136, y: -424, z: 261 }
    },
    { gyro: { x: -0.2, y: 0, z: -0.1 },
      accel: { x: 0, y: -0.281, z: 0.938 },
      compass: { x: -136, y: -424, z: 261 }
    },
    { gyro: { x: -0.2, y: -0.1, z: 0.1 },
      accel: { x: 0, y: -0.234, z: 0.938 },
      compass: { x: -132, y: -421, z: 257 }
    },
    { gyro: { x: -0.2, y: -0.1, z: 0.1 },
      accel: { x: -0.047, y: -0.234, z: 0.938 },
      compass: { x: -132, y: -421, z: 257 }
    },
    { gyro: { x: 0.1, y: -0.1, z: 0.2 },
      accel: { x: 0, y: -0.281, z: 1.031 },
      compass: { x: -132, y: -421, z: 257 }
    },
    { gyro: { x: -0.1, y: 0.1, z: -0.2 },
      accel: { x: 0, y: -0.188, z: 0.984 },
      compass: { x: -133, y: -422, z: 256 }
    },
    { gyro: { x: -0.2, y: -0.1, z: 0.2 },
      accel: { x: 0.047, y: -0.234, z: 1.031 },
      compass: { x: -133, y: -422, z: 256 }
    },
    { gyro: { x: -0.2, y: -0.1, z: 0.2 },
      accel: { x: -0.047, y: -0.234, z: 0.984 },
      compass: { x: -133, y: -422, z: 256 }
    },
    { gyro: { x: -0.1, y: 0, z: 0 },
      accel: { x: 0.047, y: -0.234, z: 0.984 },
      compass: { x: -130, y: -425, z: 257 }
    },
    { gyro: { x: -0.1, y: 0.1, z: 0.2 },
      accel: { x: 0, y: -0.234, z: 0.984 },
      compass: { x: -130, y: -425, z: 257 }
    },
    { gyro: { x: -0.3, y: 0.1, z: -0.1 },
      accel: { x: 0, y: -0.234, z: 0.984 },
      compass: { x: -130, y: -425, z: 257 }
    },
    { gyro: { x: -0.3, y: 0.1, z: -0.1 },
      accel: { x: 0, y: -0.234, z: 0.984 },
      compass: { x: -134, y: -424, z: 258 }
    },
    { gyro: { x: -0.1, y: 0, z: 0.2 },
      accel: { x: 0, y: -0.234, z: 0.938 },
      compass: { x: -134, y: -424, z: 258 }
    },
    { gyro: { x: -0.2, y: -0.1, z: 0.1 },
      accel: { x: -0.047, y: -0.281, z: 0.938 },
      compass: { x: -134, y: -424, z: 258 }
    },
    { gyro: { x: -0.2, y: -0.1, z: 0.1 },
      accel: { x: 0, y: -0.234, z: 0.938 },
      compass: { x: -131, y: -423, z: 261 }
    },
    { gyro: { x: -0.1, y: 0, z: -0.1 },
      accel: { x: -0.047, y: -0.281, z: 1.031 },
      compass: { x: -131, y: -423, z: 261 }
    },
    { gyro: { x: 0, y: -0.1, z: -0.1 },
      accel: { x: -0.047, y: -0.281, z: 0.938 },
      compass: { x: -131, y: -423, z: 261 }
    }];
