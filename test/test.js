/** *******************************************************************
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
 ******************************************************************** */

'use strict';

const test = require('tape');
const xformTestData = require('./transform-data');
const dataRandomMove = xformTestData(require('./test-data-random-move'));
const dataPitchMove = xformTestData(require('./test-data-pitch-move'));

const DEBUG = false;
const compareWithAndWithoutMagnetometer = false;

const sampleInterval = 10;
const thresholdDegrees = 2.5;
const headingAngleDegrees = -40;

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function isNear(expected, range, actual) {
  if (!isNumeric(actual)) {
    return `is not a number (${actual})`;
  }
  if (actual < expected - range) {
    return `too low (${actual.toFixed(3)})`;
  }
  if (actual > expected + range) {
    return `too high (${actual.toFixed(3)})`;
  } else {
    return 'pass';
  }
}

function runTest(imuData, algorithm, includeMag) {
  let t = 0;
  // @ts-ignore
  const AHRS = require('../index');
  const ahrsOptions = {
    sampleInterval,
    algorithm,
    beta: 1.0, // For Madgwick - ignored by Mahony
    kp: 40, // For Mahony - ignored by Madgwick
    ki: 0.0, // For Mahony - ignored by Madgwick
  };
  const ahrs = new AHRS(ahrsOptions);

  let firstHeading;
  return imuData.map((d, i) => {
    let compass;
    if (includeMag === undefined) {
      compass = {};
    } else if (includeMag === 0.0) {
      compass = { x: 0, y: 0, z: 0 };
    } else {
      compass = d.compass;
    }
    ahrs.update(d.gyro.x, d.gyro.y, d.gyro.z, d.accel.x, d.accel.y, d.accel.z, compass.x, compass.y, compass.z, d.dt);
    const eulerDeg = ahrs.getEulerAnglesDegrees();

    if (DEBUG && i === 0) {
      console.log('num\tTime\tHeading° Pitch\tRoll');
    } else if (DEBUG && i >= 30) {
      // 1st 10 items are choppy
      t += d.dt;
      if (firstHeading === undefined) {
        firstHeading = eulerDeg.heading;
      }
      console.log(
        `${i}\t`,
        `${t.toFixed(3)}\t`,
        `${(eulerDeg.heading - firstHeading).toFixed(1)}\t`,
        `${eulerDeg.pitch.toFixed(1)}\t`,
        eulerDeg.roll.toFixed(1)
      );
    }
    return eulerDeg;
  });
}

function testIt(name, algorithm, data, includeMag) {
  const withMag = includeMag ? 'turned ON' : `set to ${includeMag}`;
  name = `\n${name} using "${algorithm}" and magnetometer ${withMag}`;

  test(name, t => {
    const result = runTest(dataRandomMove, algorithm, includeMag);

    const resultNearStart = result[30];
    const resultNearEnd = result[result.length - 30];

    // If we don't include the magnetometer (compass), then the default heading
    // will be 0 degrees.
    const expectedHeadingAngle = includeMag ? headingAngleDegrees : 0;

    t.equal(isNear(expectedHeadingAngle, thresholdDegrees, resultNearStart.heading), 'pass', 'heading starts ok');

    if (algorithm === 'Mahony') {
      console.log('Mahony has trouble with heading when magnetometer (compass) is disabled - test disabled');
    } else {
      t.equal(isNear(expectedHeadingAngle, thresholdDegrees, resultNearEnd.heading), 'pass', 'heading ends ok');
    }

    t.equal(isNear(0, thresholdDegrees, resultNearStart.pitch), 'pass', 'pitch starts ok');
    t.equal(isNear(0, thresholdDegrees, resultNearEnd.pitch), 'pass', 'pitch ends ok');

    t.equal(isNear(0, thresholdDegrees, resultNearStart.roll), 'pass', 'roll starts ok');
    t.equal(isNear(0, thresholdDegrees, resultNearEnd.roll), 'pass', 'roll ends ok');

    t.end();
  });
}

testIt('Random move and return', 'Madgwick', dataRandomMove, true);
testIt('Random move and return', 'Madgwick', dataRandomMove, 0.0);
if (!compareWithAndWithoutMagnetometer) {
  testIt('Random move and return', 'Madgwick', dataRandomMove, undefined);

  testIt('Random move and return', 'Mahony', dataRandomMove, true);
  testIt('Random move and return', 'Mahony', dataRandomMove, 0.0);
  testIt('Random move and return', 'Mahony', dataRandomMove, undefined);

  testIt('Random move and return', 'Madgwick', dataPitchMove, true);
  testIt('Random move and return', 'Madgwick', dataPitchMove, 0.0);
  testIt('Random move and return', 'Madgwick', dataPitchMove, undefined);

  testIt('Random move and return', 'Mahony', dataPitchMove, true);
  testIt('Random move and return', 'Mahony', dataPitchMove, 0.0);
  testIt('Random move and return', 'Mahony', dataPitchMove, undefined);
}
