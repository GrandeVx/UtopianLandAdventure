export default function AnimationCreator(scene: any) {

    let _animation = {
        key: "adam-idle-back",
        frames: scene.anims.generateFrameNumbers(scene._config.key, {
          frames: [3]
        }),
        frameRate: 10,
        yoyo: false,
        repeat: 0
      }; 

    scene.anims.create(_animation);

    _animation = {
        key: "adam-idle-front",
        frames: scene.anims.generateFrameNumbers(scene._config.key, {
          frames: [1]
        }),
        frameRate: 10,
        yoyo: false,
        repeat: 0
      }; 

    scene.anims.create(_animation);


    _animation = {
        key: "adam-idle-right",
        frames: scene.anims.generateFrameNumbers(scene._config.key, {
          frames: [0]
        }),
        frameRate: 10,
        yoyo: false,
        repeat: 0
      }; 

    scene.anims.create(_animation);


    _animation = {
        key: "adam-idle-left",
        frames: scene.anims.generateFrameNumbers(scene._config.key, {
          frames: [2]
        }),
        frameRate: 10,
        yoyo: false,
        repeat: 0
      }; 

    scene.anims.create(_animation);

    _animation = {
      key: "adam-running-front",
      frames: scene.anims.generateFrameNumbers(scene._config.key+"_run", {
        frames: [18,19,20,21,22,23]
      }),
      frameRate: 10,
      yoyo: false,
      repeat: -1
      };
      //la inizializziamo
      scene.anims.create(_animation);

}
