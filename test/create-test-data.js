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

var mpu9250 = require('mpu9250');

// default value
var mpu = new mpu9250({
    device: '/dev/i2c-2',

    // Enable/Disable magnetometer data (default false)
    UpMagneto: true,

    // If true, all values returned will be scaled to actual units (default false).
    // If false, the raw values from the device will be returned.
    scaleValues: true,

    // Enable/Disable debug mode (default false)
    DEBUG: true,

    // Set the Gyroscope sensitivity (default 0), where:
    //      0 => 250 degrees / second
    //      1 => 500 degrees / second
    //      2 => 1000 degrees / second
    //      3 => 2000 degrees / second
    GYRO_FS: 0,

    // Set the Accelerometer sensitivity (default 2), where:
    //      0 => +/- 2 g
    //      1 => +/- 4 g
    //      2 => +/- 8 g
    //      3 => +/- 16 g
    ACCEL_FS: 0,

    // These values were generated using calibrate_mag.js - you will want to create your own.
    magCalibration: {
        min: {
            x: -71.953125,
            y: -25.4296875,
            z: -156.62109375
        },
        max: {
            x: 106.73046875,
            y: 161.0546875,
            z: 30.1640625
        },
        offset: {
            x: 17.388671875,
            y: 67.8125,
            z: -63.228515625
        },
        scale: {
            x: 1.5444986118094572,
            y: 1.4798910766652702,
            z: 1.4775079992471296
        }
    },

    // These values were generated using calibrate_gyro.js - you will want to create your own.
    // NOTE: These are temperature dependent.
    gyroBiasOffset: {
        x: 0.3217709923664121,
        y: -1.1915877862595428,
        z: -0.08352671755725186
    },

    // These values were generated using calibrate_accel.js - you will want to create your own.
    accelCalibration: {
        offset: {
            x: 0.013922932942708334,
            y: 0.0071199544270833335,
            z: -0.009103597005208333
        },
        scale: {
            x: [-0.9887548828125, 1.01349365234375],
            y: [-0.9904020182291666, 1.0107552083333333],
            z: [-1.0237027994791668, 1.0072054036458333]
        }
    }

});

function rnd(v) {
    return Math.round(v * 100000) / 100000;
}
if (mpu.initialize()) {
    var t = new Date().getTime();
    setInterval(function() {
        var m9 = mpu.getMotion9();
        var now = new Date().getTime();
        var dt = now - t;
        t = now;

        var m9Obj = {
            gyro: {
                x: rnd(m9[3]),
                y: rnd(m9[4]),
                z: rnd(m9[5])
            },
            accel: {
                x: rnd(m9[0]),
                y: rnd(m9[1]),
                z: rnd(m9[2])
            },
            compass: {
                x: rnd(m9[6]),
                y: rnd(m9[7]),
                z: rnd(m9[8])
            },
            dt: dt
        };
        console.log(m9Obj, ',');
    }, 5);
}
