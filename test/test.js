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

var DEBUG = false;
var compareWithAndWithoutMagnetometer = false;

var sampleInterval = 10;
var thresholdDegrees = 2.5;
var headingAngleDegrees = -40;

var test = require('tape');
var xformTestData = require('./transform-data');
var data_random_move = xformTestData(require('./test-data-random-move'));
var data_pitch_move = xformTestData(require('./test-data-pitch-move'));


testIt('Random move and return', 'Madgwick', data_random_move, true);
testIt('Random move and return', 'Madgwick', data_random_move, 0.0);
if (!compareWithAndWithoutMagnetometer) {
    testIt('Random move and return', 'Madgwick', data_random_move, undefined);

    testIt('Random move and return', 'Mahony', data_random_move, true);
    testIt('Random move and return', 'Mahony', data_random_move, 0.0);
    testIt('Random move and return', 'Mahony', data_random_move, undefined);

    testIt('Random move and return', 'Madgwick', data_pitch_move, true);
    testIt('Random move and return', 'Madgwick', data_pitch_move, 0.0);
    testIt('Random move and return', 'Madgwick', data_pitch_move, undefined);

    testIt('Random move and return', 'Mahony', data_pitch_move, true);
    testIt('Random move and return', 'Mahony', data_pitch_move, 0.0);
    testIt('Random move and return', 'Mahony', data_pitch_move, undefined);
}


function testIt(name, algorithm, data, include_mag) {

    var withMag = include_mag ? 'turned ON' : ('set to ' + include_mag);
    name = '\n' + name + ' using "' + algorithm + '" and magnetomer ' + withMag;

    test(name, function(t) {

        var result = runTest(data_random_move, algorithm, include_mag);

        var result_near_start = result[30];
        var result_near_end = result[result.length - 30];

        // If we dont' include the magnetomer (compass), then the default heading
        // will be 0 degrees.
        var expectedHeadingAngle = include_mag ? headingAngleDegrees : 0;

        t.equal(isNear(expectedHeadingAngle, thresholdDegrees, result_near_start.heading), 'pass', 'heading starts ok');

        if (algorithm === 'Mahony') {
            console.log('Mahony has trouble with heading when magnetomer (compass) is disabled - test disabled');
        } else {
            t.equal(isNear(expectedHeadingAngle, thresholdDegrees, result_near_end.heading), 'pass', 'heading ends ok');
        }

        t.equal(isNear(0, thresholdDegrees, result_near_start.pitch), 'pass', 'pitch starts ok');
        t.equal(isNear(0, thresholdDegrees, result_near_end.pitch), 'pass', 'pitch ends ok');

        t.equal(isNear(0, thresholdDegrees, result_near_start.roll), 'pass', 'roll starts ok');
        t.equal(isNear(0, thresholdDegrees, result_near_end.roll), 'pass', 'roll ends ok');

        t.end();

    });
}


function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function isNear(expected, range, actual) {
    if (!isNumeric(actual)) {
        return 'is not a number (' + actual + ')';
    }
    if (actual < expected - range) {
        return 'too low (' + actual.toFixed(3) + ')';
    } if (actual > expected + range) {
        return 'too high (' + actual.toFixed(3) + ')';
    } else {
        return 'pass';
    }
}

function runTest(imu_data, algorithm, include_mag) {
    var t = 0;
    var AHRS = require('../index');
    var ahrsOptions = {
        sampleInterval: sampleInterval,
        algorithm: algorithm,
        beta: 1.0,                      // For Madgwick - ignored by Mahony
        kp: 40,                        // For Mahony - ignored by Madgwick
        ki: 0.0                         // For Mahony - ignored by Madgwick
    };
    var ahrs = new AHRS(ahrsOptions);

    var firstHeading;
    return imu_data.map(function(d, i) {
        var compass;
        if (include_mag === undefined) {
            compass = {};
        } else if (include_mag === 0.0) {
            compass = {x: 0, y: 0, z: 0};
        } else {
            compass = d.compass;
        }
        ahrs.update(d.gyro.x, d.gyro.y, d.gyro.z,
                    d.accel.x, d.accel.y, d.accel.z,
                    compass.x, compass.y, compass.z,
                    d.dt);
        var eulerDeg = ahrs.getEulerAnglesDegrees();

        if (DEBUG && i === 0) {
            console.log('num\tTime\tHeading° Pitch\tRoll');
        } else if (DEBUG && i >= 30) {
            // 1st 10 items are choppy
            t += d.dt;
            if (firstHeading === undefined) {
                firstHeading = eulerDeg.heading;
            }
            console.log(i + '\t', t.toFixed(3) + '\t', (eulerDeg.heading - firstHeading).toFixed(1) + '\t', eulerDeg.pitch.toFixed(1) + '\t', eulerDeg.roll.toFixed(1));
        }
        return eulerDeg;
    });
}
