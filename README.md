# AHRS

AHRS (Attitude Heading Reference Systems) calculation for JavaScript.  This will calculate the attitude and heading for a device with all of the following sensors: compass, gyroscope and accelerometer.  The Madgwick or Mahony algorithms can be used to filter data in real time from these sensors.

## Usage:

```javascript
var AHRS = require('ahrs');
var madgwick = new AHRS({ sampleInterval: 20, algorithm: 'Madgwick' });

madgwick.update(gyro.x, gyro.y, gyro.z, accel.x, accel.y, accel.z, compass.x, compass.y, compass.z);
console.log(madgwick.toVector());

// Output will be something like
//{ angle: 4.721762925242644,
//  x: 0.1813927666973246,
//  y: 0.08766109912082491,
//  z: -0.9794958886543724 }
```

## TODO:

-   Currently the quaternion is not initialised, this means there may be one to two seconds before the correct attitude is obtained.
-   Add option to initialise against compass or accelerometer.
