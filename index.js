

module.exports = function AHRS(options) {
    options = options || {};
    var sampleInterval = options.sampleInterval || 20;
    var algorithmName = options.algorithm || 'Madgwick';

    switch (algorithmName) {
        case 'Mahony':
        case 'Madgwick':
            break;
        default:
            throw new Error('AHRS(): Algorithm not valid: ', algorithmName);
    }

    var algorithmFn = new (require('./' + algorithmName))(sampleInterval);

    this.initialise = algorithmFn.initialise;
    this.update = algorithmFn.update;
    this.getQuaternion = algorithmFn.getQuaternion;
    this.toVector = algorithmFn.toVector;

};
