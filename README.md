# AHRS

AHRS (Attitude Heading Reference Systems) calculation for JavaScript, or sensor fusion as some people call it. This will calculate the attitude and heading for a device with all of the following sensors: compass, gyroscope and accelerometer. The Madgwick or Mahony algorithms can be used to filter data in real time from these sensors.

## Usage

```javascript
const AHRS = require('ahrs');
const madgwick = new AHRS({
  /*
   * The sample interval, in Hz.
   *
   * Default: 20
   */
  sampleInterval: 20,

  /*
   * Choose from the `Madgwick` or `Mahony` filter.
   *
   * Default: 'Madgwick'
   */
  algorithm: 'Madgwick',

  /*
   * The filter noise value, smaller values have
   * smoother estimates, but have higher latency.
   * This only works for the `Madgwick` filter.
   *
   * Default: 0.4
   */
  beta: 0.4,

  /*
   * The filter noise values for the `Mahony` filter.
   */
  kp: 0.5, // Default: 0.5
  ki: 0, // Default: 0.0

  /*
   * When the AHRS algorithm runs for the first time and this value is
   * set to true, then initialisation is done.
   *
   * Default: false
   */
  doInitialisation: false,
});

madgwick.update(gyro.x, gyro.y, gyro.z, accel.x, accel.y, accel.z, compass.x, compass.y, compass.z);
console.log(madgwick.getEulerAngles());
```

The log output of the above will look like the following:

```Text
{
  heading: -2.9645456
  pitch: -0.211641998
  roll: 0.4012321242
}
```

## Usage in browser

Use the `/build/www-ahrs.js` file in the browser. The rest will work just like in Node.js.

## Orientation

The image below shows the orientation of the axis. The x-axis points north and the z-axis up. The input values
should be rotated to match the orientation show. The output will be of the shown orientation.

![Orientation of x, y, and z axes, showing pitch, roll and heading](doc/orientation.png 'Orientation')

## Functions

`update(gx, gy, gz, ax, ay, az, [mx, my, mz, deltaTimeSec])`

Update the AHRS filter with up-to-date, unfiltered values from the gyroscope (gx, gy, gz), the accelerometer (ax, ay, az), optionally the magnetometer (mx, my, mz) and
optionally the elapsed time (in seconds) since the last reading. The magnetometer
values do not have to be sent through for every update, since the magnetometer typically has lower update rates than the gyro and accelerometer.

_Units_:

- gyroscope: radians / s
- accelerometer: g, where 1 g is 9.81 m/s²
- magnetometer: unitless, but a relative proportion of the Earth's magnetic field

_returns:_ nothing.

`getQuaternion()`

This returns the quaternion for the current estimated attitude.

_returns:_ Object with quaternion components x, y, z, w.

`toVector()`

Convert the quaternion to a vector with angle.

_returns:_ Object with normalised vector with components x, y, z, and angle.

`getEulerAngles()`

Return an object with the Euler angles (heading/yaw, pitch, roll), in radians.

_returns:_ Object where:

- heading is from north, going west (about z-axis).
- pitch is from vertical, going forward (about y-axis).
- roll is from vertical, going right (about x-axis).

`init(ax, ay, az, mx, my, mz)`

Initalise the internal quaternion values.  This function only needs to be
called once at the beginning.  The attitude will be set by the accelometer
and the heading by the magnetometer.  If the `doInitialisation` property is
is set to `true` then this function is not requried.

_returns:_ Object with quaternion components x, y, z, w.

## Debugging

Getting the AHRS working well you need to make sure the values you provide the algorithm are sensible. Simple mistakes can
easily lead to incorrect results.

### 1. Get your axes correct

The most important thing is to get your axis correct. Read the documentation of your device. Some devices (like the MPU9250)
have the accelerometer and compass with a different orientation than the magnetometer. You will need to rotate the axis
before you use the values for the AHRS algorithm.

### 2. Units

Ensure the input units are correct.

For the gyroscope measures [rotational speed](https://en.wikipedia.org/wiki/Rotational_speed)
and the units should be in radians per second. To test you have the correct units, smoothly rotate the device around any axis,
rotate it around 90 degrees for 1 second, or 180 degrees over 2 seconds and you should typically see a rotation value around +/- 1.57 (+/- Pi/2).

The accelerometer units are in g, see [G-Force](https://en.wikipedia.org/wiki/G-force). If you hold the device still and one
axis vertical, then the value along that axis should be around +/- 1.0, the other axes' values should hover around 0.0, since they
are perpendicular to the force of gravity.

### 3. Sample rate

Make sure you have selected the correct `sampleInterval`. The sample interval is the inverse of the sample rate. For example a
`sampleInterval` of `20` is equivalent of a sample rate of 0.05 (seconds between each sample), or 50 milliseconds. Ensure that
the documented sample rate is the same as the actual sample rate.

### 4. Magnetometer

The magnetometer (or compass) is very sensitive, if you have nearby magnetic or ferrous objects, this can distort the magnetic
field significantly. For instance the following can distort the magnetometer: a wooden bench with steel framing, being inside a building with steel framing, nearby magnets, nearby high current devices, etc.

### 5. Calibration

Calibration should be the final step. It is unlikely this step will fix issues with your device. Calibration removes bias
from the signal.

Some devices, like mobile phones, will provide a raw value or a calibrated value. Either raw or calibrated values are fine to use.
However, don't use values that have already been passed through a more complex filter, like the AHRS filters this package
uses. Adding more filters does not help.
