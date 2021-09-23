const AHRS = require('./');

// Run AHRS with one loop, or 10000 loops.
for (let j=0; j < 2; j++){
  const madgwick = new AHRS({
    sampleInterval: 100,
    algorithm: 'Madgwick',
    beta: 0.1,
    doInitialisation: true
  });

  const args = [0, 0, 0, 0, 0.7, -0.4, -66.306053, 98.563057, 43.526505];

  madgwick.init(...args.slice(3));
  for (let i=0; i < [1, 10000][j]; i++)
  {
    madgwick.update(...args);
  }
  console.log(madgwick.getEulerAnglesDegrees());
}