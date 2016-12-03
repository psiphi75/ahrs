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


/**
 * Transformation:
 *  - Rotate around Z axis 180 degrees
 *  - Rotate around X axis -90 degrees
 * @param  {object} s {x,y,z} sensor
 * @return {object}   {x,y,z} transformed
 */
function transformAccelGyro(s) {
    return {
        x: -s.x,
        y: -s.z,
        z: -s.y
    };
}

/**
 * Transformation: to get magnetometer aligned
 * @param  {object} s {x,y,z} sensor
 * @return {object}   {x,y,z} transformed
 */
function transformMag(s) {
    return {
        x: -s.y,
        y: s.z,
        z: -s.x
    };
}

module.exports = function(data) {
    var deg2rad = Math.PI / 180;
    return data.map(function(imu) {
        imu.gyro.x *= deg2rad;
        imu.gyro.y *= deg2rad;
        imu.gyro.z *= deg2rad;
        return {
            accel: transformAccelGyro(imu.accel),
            gyro: transformAccelGyro(imu.gyro),
            compass: transformMag(imu.compass),
            dt: imu.dt / 1000
        };
    });
};
