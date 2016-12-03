//=====================================================================================================
// MahonyAHRS.c
//=====================================================================================================
//
// Madgwick's implementation of Mayhony's AHRS algorithm.
// See: http://www.x-io.co.uk/node/8#open_source_ahrs_and_imu_algorithms
//
// Date         Author          Notes
// 29/09/2011   SOH Madgwick    Initial release
// 02/10/2011   SOH Madgwick    Optimised for reduced CPU load
//
//=====================================================================================================

'use strict';

/**
 * The Mahony algorithm.  See: http://www.x-io.co.uk/open-source-imu-and-ahrs-algorithms/
 * @param {number} sampleInterval The sample interval in milliseconds.
 */
module.exports = function Mahony(sampleInterval, options) {

    //---------------------------------------------------------------------------------------------------
    // Definitions

    options = options || {};
    var kp = options.kp || 1.0;
    var ki = options.ki || 0.0;

    var sampleFreq = 1000 / sampleInterval;  // sample frequency in Hz
    var twoKpDef = 2.0 * kp;                 // 2 * proportional gain
    var twoKiDef = 2.0 * ki;                 // 2 * integral gain
    var recipSampleFreq = 1 / sampleFreq;

    //---------------------------------------------------------------------------------------------------
    // Variable definitions

    var twoKp = twoKpDef;                                                       // 2 * proportional gain (Kp)
    var twoKi = twoKiDef;                                                       // 2 * integral gain (Ki)
    var q0 = 1.0, q1 = 0.0, q2 = 0.0, q3 = 0.0;                                 // quaternion of sensor frame relative to auxiliary frame
    var integralFBx = 0.0, integralFBy = 0.0, integralFBz = 0.0;                // integral error terms scaled by Ki


    return {
        update: mahonyAHRSupdate,
        getQuaternion: function() {
            return {
                w: q0,
                x: q1,
                y: q2,
                z: q3
            };
        }
    };

    //====================================================================================================
    // Functions

    //---------------------------------------------------------------------------------------------------
    // IMU algorithm update
    //

    function mahonyAHRSupdateIMU(gx, gy, gz, ax, ay, az) {
        var recipNorm;
        var halfvx, halfvy, halfvz;
        var halfex, halfey, halfez;
        var qa, qb, qc;

        // Compute feedback only if accelerometer measurement valid (afunctions NaN in accelerometer normalisation)
        if (ax !== 0 && ay !== 0 && az !== 0) {
            // Normalise accelerometer measurement
            recipNorm = Math.pow(ax * ax + ay * ay + az * az, -0.5);
            ax *= recipNorm;
            ay *= recipNorm;
            az *= recipNorm;

            // Estimated direction of gravity and vector perpendicular to magnetic flux
            halfvx = q1 * q3 - q0 * q2;
            halfvy = q0 * q1 + q2 * q3;
            halfvz = q0 * q0 - 0.5 + q3 * q3;

            // Error is sum of cross product between estimated and measured direction of gravity
            halfex = (ay * halfvz - az * halfvy);
            halfey = (az * halfvx - ax * halfvz);
            halfez = (ax * halfvy - ay * halfvx);

            // Compute and apply integral feedback if enabled
            if (twoKi > 0.0) {
                integralFBx += twoKi * halfex * recipSampleFreq; // integral error scaled by Ki
                integralFBy += twoKi * halfey * recipSampleFreq;
                integralFBz += twoKi * halfez * recipSampleFreq;
                gx += integralFBx; // apply integral feedback
                gy += integralFBy;
                gz += integralFBz;
            } else {
                integralFBx = 0.0; // prevent integral windup
                integralFBy = 0.0;
                integralFBz = 0.0;
            }
            // Apply proportional feedback
            gx += twoKp * halfex;
            gy += twoKp * halfey;
            gz += twoKp * halfez;
        }

        // Integrate rate of change of quaternion
        gx *= (0.5 * recipSampleFreq);         // pre-multiply common factors
        gy *= (0.5 * recipSampleFreq);
        gz *= (0.5 * recipSampleFreq);
        qa = q0;
        qb = q1;
        qc = q2;
        q0 += (-qb * gx - qc * gy - q3 * gz);
        q1 += (qa * gx + qc * gz - q3 * gy);
        q2 += (qa * gy - qb * gz + q3 * gx);
        q3 += (qa * gz + qb * gy - qc * gx);

        // Normalise quaternion
        recipNorm = Math.pow(q0 * q0 + q1 * q1 + q2 * q2 + q3 * q3, -0.5);
        q0 *= recipNorm;
        q1 *= recipNorm;
        q2 *= recipNorm;
        q3 *= recipNorm;
    }

    //
    //---------------------------------------------------------------------------------------------------
    // AHRS algorithm update
    //

    function mahonyAHRSupdate(gx, gy, gz, ax, ay, az, mx, my, mz, deltaTimeSec) {
        recipSampleFreq = deltaTimeSec || recipSampleFreq;
        var recipNorm;
        var q0q0, q0q1, q0q2, q0q3, q1q1, q1q2, q1q3, q2q2, q2q3, q3q3;
        var hx, hy, bx, bz;
        var halfvx, halfvy, halfvz, halfwx, halfwy, halfwz;
        var halfex, halfey, halfez;
        var qa, qb, qc;

        // Use IMU algorithm if magnetometer measurement invalid (avoids NaN in magnetometer normalisation)
        if (mx === undefined || my === undefined || mz === undefined || (mx === 0 && my === 0 && mz === 0)) {
            mahonyAHRSupdateIMU(gx, gy, gz, ax, ay, az);
            return;
        }

        // Compute feedback only if accelerometer measurement valid (afunctions NaN in accelerometer normalisation)
        if (ax !== 0 && ay !== 0 && az !== 0) {

            // Normalise accelerometer measurement
            recipNorm = Math.pow(ax * ax + ay * ay + az * az, -0.5);
            ax *= recipNorm;
            ay *= recipNorm;
            az *= recipNorm;

            // Normalise magnetometer measurement
            recipNorm = Math.pow(mx * mx + my * my + mz * mz, -0.5);
            mx *= recipNorm;
            my *= recipNorm;
            mz *= recipNorm;

            // Auxiliary variables to afunction repeated arithmetic
            q0q0 = q0 * q0;
            q0q1 = q0 * q1;
            q0q2 = q0 * q2;
            q0q3 = q0 * q3;
            q1q1 = q1 * q1;
            q1q2 = q1 * q2;
            q1q3 = q1 * q3;
            q2q2 = q2 * q2;
            q2q3 = q2 * q3;
            q3q3 = q3 * q3;

            // Reference direction of Earth's magnetic field
            hx = 2.0 * (mx * (0.5 - q2q2 - q3q3) + my * (q1q2 - q0q3) + mz * (q1q3 + q0q2));
            hy = 2.0 * (mx * (q1q2 + q0q3) + my * (0.5 - q1q1 - q3q3) + mz * (q2q3 - q0q1));
            bx = Math.sqrt(hx * hx + hy * hy);
            bz = 2.0 * (mx * (q1q3 - q0q2) + my * (q2q3 + q0q1) + mz * (0.5 - q1q1 - q2q2));

            // Estimated direction of gravity and magnetic field
            halfvx = q1q3 - q0q2;
            halfvy = q0q1 + q2q3;
            halfvz = q0q0 - 0.5 + q3q3;
            halfwx = bx * (0.5 - q2q2 - q3q3) + bz * (q1q3 - q0q2);
            halfwy = bx * (q1q2 - q0q3) + bz * (q0q1 + q2q3);
            halfwz = bx * (q0q2 + q1q3) + bz * (0.5 - q1q1 - q2q2);

            // Error is sum of cross product between estimated direction and measured direction of field vectors
            halfex = (ay * halfvz - az * halfvy) + (my * halfwz - mz * halfwy);
            halfey = (az * halfvx - ax * halfvz) + (mz * halfwx - mx * halfwz);
            halfez = (ax * halfvy - ay * halfvx) + (mx * halfwy - my * halfwx);

            // Compute and apply integral feedback if enabled
            if (twoKi > 0.0) {
                integralFBx += twoKi * halfex * recipSampleFreq;  // integral error scaled by Ki
                integralFBy += twoKi * halfey * recipSampleFreq;
                integralFBz += twoKi * halfez * recipSampleFreq;
                gx += integralFBx;  // apply integral feedback
                gy += integralFBy;
                gz += integralFBz;
            } else {
                integralFBx = 0.0;  // prevent integral windup
                integralFBy = 0.0;
                integralFBz = 0.0;
            }

            // Apply proportional feedback
            gx += twoKp * halfex;
            gy += twoKp * halfey;
            gz += twoKp * halfez;
        }

        // Integrate rate of change of quaternion
        gx *= (0.5 * recipSampleFreq);    // pre-multiply common factors
        gy *= (0.5 * recipSampleFreq);
        gz *= (0.5 * recipSampleFreq);
        qa = q0;
        qb = q1;
        qc = q2;
        q0 += (-qb * gx - qc * gy - q3 * gz);
        q1 += (qa * gx + qc * gz - q3 * gy);
        q2 += (qa * gy - qb * gz + q3 * gx);
        q3 += (qa * gz + qb * gy - qc * gx);

        // Normalise quaternion
        recipNorm = Math.pow(q0 * q0 + q1 * q1 + q2 * q2 + q3 * q3, -0.5);
        q0 *= recipNorm;
        q1 *= recipNorm;
        q2 *= recipNorm;
        q3 *= recipNorm;
    }

    //====================================================================================================
    // END OF CODE
    //====================================================================================================

};
