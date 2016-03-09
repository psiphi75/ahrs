# AHRS

AHRS (Attitude Heading Reference Systems) calculation for JavaScript.  This will calculate the attitude and heading for a device with all of the following sensors: compass, gyroscope and accelerometer.  The Madgwick or Mahony algorithms can be used to filter data in real time from these sensors.

## Usage:

```JavaScript
var AHRS = require('./index');
var madgwick = new AHRS({ sampleInterval: 20, algorithm: 'Madgwick' });

madgwick.update(d.gyro.x, d.gyro.y, d.gyro.z, d.accel.x, d.accel.y, d.accel.z, d.compass.x, d.compass.y, d.compass.z);
console.log(madgwick.toVector());

// Output will be something like
//{ angle: 4.721762925242644,
//  x: 0.1813927666973246,
//  y: 0.08766109912082491,
//  z: -0.9794958886543724 }

```

## TODO:
 - Currently the quaternion is not initialised, this means there may be one to two seconds before the correct attitude is obtained.
 - Add option to initialise against compass or accelerometer.
