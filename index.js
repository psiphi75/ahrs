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

const rad2deg = 180.0 / Math.PI;

function AHRS(options) {
  options = options || {};
  const sampleInterval = options.sampleInterval || 20;
  const algorithmName = options.algorithm || 'Madgwick';

  let Req;
  if (algorithmName === 'Mahony') {
    Req = require('./Mahony');
  } else if (algorithmName === 'Madgwick') {
    Req = require('./Madgwick');
  } else {
    throw new Error(`AHRS(): Algorithm not valid: ${algorithmName}`);
  }
  const algorithmFn = Req(sampleInterval, options);

  // Copy all properties across
  const self = this;
  Object.keys(algorithmFn).forEach(prop => self[prop] = algorithmFn[prop]);
}

/**
 * Convert the quaternion to a vector with angle.  Reverse of the code
 * in the following link: http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm.
 *
 * @return {object} Normalised vector - {x, y, z, angle}.
 */
AHRS.prototype.toVector = function toVector() {
  const q = this.getQuaternion();
  const angle = 2 * Math.acos(q.w);
  const sinAngle = Math.sin(angle / 2);
  return {
    angle,
    x: q.x / sinAngle,
    y: q.y / sinAngle,
    z: q.z / sinAngle,
  };
};

/**
 * Return an object with the Euler angles {heading, pitch, roll}, in radians.
 *
 * Where:
 *   - heading is from magnetic north, going west (about z-axis).
 *   - pitch is from vertical, going forward (about y-axis).
 *   - roll is from vertical, going right (about x-axis).
 *
 * Thanks to:
 *   https://github.com/PenguPilot/PenguPilot/blob/master/autopilot/service/util/math/quat.c#L103.
 *
 * @return {object} {heading, pitch, roll} In radians.
 */
AHRS.prototype.getEulerAngles = function getEulerAngles() {
  const q = this.getQuaternion();
  const ww = q.w * q.w,
    xx = q.x * q.x,
    yy = q.y * q.y,
    zz = q.z * q.z;
  return {
    heading: Math.atan2(2 * (q.x * q.y + q.z * q.w), xx - yy - zz + ww),
    pitch: -Math.asin(2 * (q.x * q.z - q.y * q.w)),
    roll: Math.atan2(2 * (q.y * q.z + q.x * q.w), -xx - yy + zz + ww),
  };
};

/**
 * Return an object with the Euler angles {heading, pitch, roll}, in radians.
 *
 * Where:
 *   - heading is from magnetic north, going west (about z-axis).
 *   - pitch is from vertical, going forward (about y-axis).
 *   - roll is from vertical, going right (about x-axis).
 *
 * Thanks to:
 *   https://github.com/PenguPilot/PenguPilot/blob/master/autopilot/service/util/math/quat.c#L103.
 *
 * @returns {object} {heading, pitch, roll} In radians.
 */
AHRS.prototype.getEulerAnglesDegrees = function getEulerAnglesDegrees() {
  const getEulerAnglesRad = this.getEulerAngles();
  return {
    heading: getEulerAnglesRad.heading * rad2deg,
    pitch: getEulerAnglesRad.pitch * rad2deg,
    roll: getEulerAnglesRad.roll * rad2deg,
  };
};

module.exports = AHRS;
