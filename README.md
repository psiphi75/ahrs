# AHRS

AHRS (Attitude Heading Reference Systems) calculation for JavaScript.  This will calculate the attitude and heading for a device with all of the following sensors: compass, gyroscope and accelerometer.  The Madgwick or Mahony algorithms can be used to filter data in real time from these sensors.

## Usage:

```javascript
var AHRS = require('ahrs');
var madgwick = new AHRS({

    /*
     * The sample interval, in Hz.
     */
    sampleInterval: 20,

    /*
     * Choose from the `Madgwick` or `Mahony` filter.
     */
    algorithm: 'Madgwick',

    /*
     * The filter noise value, smaller values have
     * smoother estimates, but have higher latency.
     * This only works for the `Madgwick` filter.
     */
    beta: 0.4,

    /*
     * The filter noise values for the `Mahony` filter.
     */
    kp: 0.5,
    ki: 0
});

madgwick.update(gyro.x, gyro.y, gyro.z, accel.x, accel.y, accel.z, compass.x, compass.y, compass.z);
console.log(madgwick.toVector());

// Output will be something like
//{ angle: 4.721762925242644,
//  x: 0.1813927666973246,
//  y: 0.08766109912082491,
//  z: -0.9794958886543724 }
```

## Usage in browser

Use the `/build/www-ahrs.js` file in the browser.  The rest will work just like in Node.js.

## Functions

##### update(gx, gy, gz, ax, ay, az, [mx, my, mz, deltaTimeSec])

Update the AHRS filter with up-to-date, unfiltered values from the gyroscope (gx, gy, gz), the accelerometer (ax, ay, az), optionally the magnetometer (mx, my, mz) and
optionally the elapsed time (in seconds) since the last reading.  The magnetometer
values do not have to be sent through for every update, since the magnetometer typically has lower update rates than the gyro and accelerometer.

*Units*

- gyroscope: radians / s
- accelerometer: g, where 1 g is 9.81 m/s²
- magnetometer: unitless, but a relative proportion of the Earth's magnetic field

*returns:* nothing.

##### getQuaternion()

This returns the quaternion for the current estimated attitude.

*returns:* Object with quaternion components x, y, z, w.

##### toVector()

Convert the quaternion to a vector with angle.

*returns:* Object with normalised vector with components x, y, z, and angle.

##### getEulerAngles()

Return an object with the Euler angles (heading/yaw, pitch, roll), in radians.

*returns:* Object where:
   - heading is from north, going west (about z-axis).
   - pitch is from vertical, going forward (about y-axis).
   - roll is from vertical, going right (about x-axis).

## TODO:

-   Currently the quaternion is not initialised, this means there may be one to two seconds before the correct attitude is obtained.
