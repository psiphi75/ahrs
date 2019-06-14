declare module 'ahrs' {
  export default class AHRS {
    constructor({
      sampleInterval,
      algorithm,
      beta,
      kp,
      ki,
      doInitialisation,
    }: {
      sampleInterval?: number;
      algorithm?: 'Madgwick' | 'Mahony';
      beta?: number;
      kp?: number;
      ki?: number;
      doInitialisation?: boolean;
    });

    public toVector: () => {
      x: number;
      y: number;
      z: number;
      angle: number;
    };

    public getEulerAngles: () => {
      heading: number;
      pitch: number;
      roll: number;
    };

    public getEulerAnglesDegrees: () => {
      heading: number;
      pitch: number;
      roll: number;
    };

    public update: (
      gx: number,
      gy: number,
      gz: number,
      ax: number,
      ay: number,
      az: number,
      mx?: number,
      my?: number,
      mz?: number,
      deltaTimeSec?: number
    ) => void;

    public getQuaternion: () => {
      w: number;
      x: number;
      y: number;
      z: number;
    };
  }
}
