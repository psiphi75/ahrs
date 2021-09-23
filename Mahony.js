//= ====================================================================================================
// Based on MahonyAHRS.c
//= ====================================================================================================
//
// Madgwick's implementation of Mayhony's AHRS algorithm.
// See: http://www.x-io.co.uk/node/8#open_source_ahrs_and_imu_algorithms
//
//= ====================================================================================================

/* eslint-disable one-var-declaration-per-line */

'use strict';

/**
 * The Mahony algorithm.  See: http://www.x-io.co.uk/open-source-imu-and-ahrs-algorithms/.
 *
 * @param {number} sampleInterval - The sample interval in milliseconds.
 * @param {Object} options - The options.
 */
module.exports = function Mahony(sampleInterval, options) {
  //---------------------------------------------------------------------------------------------------
  // Definitions

  options = options || {};
  const kp = options.kp || 1.0;
  const ki = options.ki || 0.0;

  const sampleFreq = 1000 / sampleInterval; // sample frequency in Hz
  let recipSampleFreq = 1 / sampleFreq;
  let initalised = options.doInitialisation === true ? false : true;

  //---------------------------------------------------------------------------------------------------
  // Variable definitions

  let twoKp = 2.0 * kp; // 2 * proportional gain (Kp)
  const twoKi = 2.0 * ki; // 2 * integral gain (Ki)
  let q0 = 1.0,
    q1 = 0.0,
    q2 = 0.0,
    q3 = 0.0; // quaternion of sensor frame relative to auxiliary frame
  let integralFBx = 0.0,
    integralFBy = 0.0,
    integralFBz = 0.0; // integral error terms scaled by Ki

  //= ===================================================================================================
  // Functions

  //---------------------------------------------------------------------------------------------------
  // IMU algorithm update
  //

  function mahonyAHRSUpdateIMU(gx, gy, gz, ax, ay, az) {
    let recipNorm;
    let halfvx, halfvy, halfvz;
    let halfex, halfey, halfez;

    // Compute feedback only if accelerometer measurement valid (NaN in accelerometer normalisation)
    if (ax !== 0 && ay !== 0 && az !== 0) {
      // Normalise accelerometer measurement
      recipNorm = (ax * ax + ay * ay + az * az) ** -0.5;
      ax *= recipNorm;
      ay *= recipNorm;
      az *= recipNorm;

      // Estimated direction of gravity and vector perpendicular to magnetic flux
      halfvx = q1 * q3 - q0 * q2;
      halfvy = q0 * q1 + q2 * q3;
      halfvz = q0 * q0 - 0.5 + q3 * q3;

      // Error is sum of cross product between estimated and measured direction of gravity
      halfex = ay * halfvz - az * halfvy;
      halfey = az * halfvx - ax * halfvz;
      halfez = ax * halfvy - ay * halfvx;

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
    gx *= 0.5 * recipSampleFreq; // pre-multiply common factors
    gy *= 0.5 * recipSampleFreq;
    gz *= 0.5 * recipSampleFreq;
    const qa = q0;
    const qb = q1;
    const qc = q2;
    q0 += -qb * gx - qc * gy - q3 * gz;
    q1 += qa * gx + qc * gz - q3 * gy;
    q2 += qa * gy - qb * gz + q3 * gx;
    q3 += qa * gz + qb * gy - qc * gx;

    // Normalise quaternion
    recipNorm = (q0 * q0 + q1 * q1 + q2 * q2 + q3 * q3) ** -0.5;
    q0 *= recipNorm;
    q1 *= recipNorm;
    q2 *= recipNorm;
    q3 *= recipNorm;
  }

  function cross_product(ax, ay, az, bx, by, bz) {
    return {
      x: ay * bz - az * by,
      y: az * bx - ax * bz,
      z: ax * by - ay * bx,
    };
  }

  /**
   * @param {number} ax - accel x
   * @param {number} ay - accel y
   * @param {number} az - accel z
   * @param {number} mx - mag x
   * @param {number} my - mag y
   * @param {number} mz - mag z
   * @returns {EulerAngles} - The Euler angles, in radians.
   */
  function eulerAnglesFromImuRad(ax, ay, az, mx, my, mz) {
    const pitch = -Math.atan2(ax, Math.sqrt(ay * ay + az * az));

    const tmp1 = cross_product(ax, ay, az, 1.0, 0.0, 0.0);
    const tmp2 = cross_product(1.0, 0.0, 0.0, tmp1.x, tmp1.y, tmp1.z);
    const roll = Math.atan2(tmp2.y, tmp2.z);

    const cr = Math.cos(roll);
    const sp = Math.sin(pitch);
    const sr = Math.sin(roll);
    const yh = my * cr - mz * sr;
    const xh = mx * Math.cos(pitch) + my * sr * sp + mz * cr * sp;

    const heading = -Math.atan2(yh, xh);

    return {
      heading,
      pitch,
      roll,
    };
  }

  // Pinched from here: https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles

  function toQuaternion(eulerAngles) {
    const cy = Math.cos(eulerAngles.heading * 0.5);
    const sy = Math.sin(eulerAngles.heading * 0.5);
    const cp = Math.cos(eulerAngles.pitch * 0.5);
    const sp = Math.sin(eulerAngles.pitch * 0.5);
    const cr = Math.cos(eulerAngles.roll * 0.5);
    const sr = Math.sin(eulerAngles.roll * 0.5);

    return {
      w: cr * cp * cy + sr * sp * sy,
      x: sr * cp * cy - cr * sp * sy,
      y: cr * sp * cy + sr * cp * sy,
      z: cr * cp * sy - sr * sp * cy,
    };
  }

  /**
   * Initalise the internal quaternion values.  This function only needs to be
   * called once at the beginning.  The attitude will be set by the accelometer
   * and the heading by the magnetometer.
   *
   * @param {number} ax - accel x
   * @param {number} ay - accel y
   * @param {number} az - accel z
   * @param {number} mx - mag x
   * @param {number} my - mag y
   * @param {number} mz - mag z
   */
  function init(ax, ay, az, mx, my, mz) {
    const ea = eulerAnglesFromImuRad(ax, ay, az, mx, my, mz);
    const iq = toQuaternion(ea);

    // Normalise quaternion
    const recipNorm = (iq.w * iq.w + iq.x * iq.x + iq.y * iq.y + iq.z * iq.z) ** -0.5;
    q0 = iq.w * recipNorm;
    q1 = iq.x * recipNorm;
    q2 = iq.y * recipNorm;
    q3 = iq.z * recipNorm;

    initalised = true;
  }

  //
  //---------------------------------------------------------------------------------------------------
  // AHRS algorithm update
  //

  function mahonyAHRSUpdate(gx, gy, gz, ax, ay, az, mx, my, mz, deltaTimeSec) {
    recipSampleFreq = deltaTimeSec || recipSampleFreq;

    if (!initalised) {
      init(ax, ay, az, mx, my, mz);
    }

    let recipNorm;
    let q0q0, q0q1, q0q2, q0q3, q1q1, q1q2, q1q3, q2q2, q2q3, q3q3;
    let hx, hy, bx, bz;
    let halfvx, halfvy, halfvz, halfwx, halfwy, halfwz;
    let halfex, halfey, halfez;

    // Use IMU algorithm if magnetometer measurement invalid (avoids NaN in magnetometer normalisation)
    if (mx === undefined || my === undefined || mz === undefined || (mx === 0 && my === 0 && mz === 0)) {
      mahonyAHRSUpdateIMU(gx, gy, gz, ax, ay, az);
      return;
    }

    // Compute feedback only if accelerometer measurement valid (NaN in accelerometer normalisation)
    if (ax !== 0 && ay !== 0 && az !== 0) {
      // Normalise accelerometer measurement
      recipNorm = (ax * ax + ay * ay + az * az) ** -0.5;
      ax *= recipNorm;
      ay *= recipNorm;
      az *= recipNorm;

      // Normalise magnetometer measurement
      recipNorm = (mx * mx + my * my + mz * mz) ** -0.5;
      mx *= recipNorm;
      my *= recipNorm;
      mz *= recipNorm;

      // Auxiliary variables to repeated arithmetic
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
      halfex = ay * halfvz - az * halfvy + (my * halfwz - mz * halfwy);
      halfey = az * halfvx - ax * halfvz + (mz * halfwx - mx * halfwz);
      halfez = ax * halfvy - ay * halfvx + (mx * halfwy - my * halfwx);

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
    gx *= 0.5 * recipSampleFreq; // pre-multiply common factors
    gy *= 0.5 * recipSampleFreq;
    gz *= 0.5 * recipSampleFreq;
    const qa = q0;
    const qb = q1;
    const qc = q2;
    q0 += -qb * gx - qc * gy - q3 * gz;
    q1 += qa * gx + qc * gz - q3 * gy;
    q2 += qa * gy - qb * gz + q3 * gx;
    q3 += qa * gz + qb * gy - qc * gx;

    // Normalise quaternion
    recipNorm = (q0 * q0 + q1 * q1 + q2 * q2 + q3 * q3) ** -0.5;
    q0 *= recipNorm;
    q1 *= recipNorm;
    q2 *= recipNorm;
    q3 *= recipNorm;
  }

  return {
    update: mahonyAHRSUpdate,
    init,
    getQuaternion() {
      return {
        w: q0,
        x: q1,
        y: q2,
        z: q3,
      };
    },
  };

  //= ===================================================================================================
  // END OF CODE
  //= ===================================================================================================
};
