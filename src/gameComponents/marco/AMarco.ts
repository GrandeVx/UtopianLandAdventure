export default function AnimationCreator(scene: any) {

    let _animation = {
        key: "marco-idle-back",
        frames: scene.anims.generateFrameNumbers(scene._config.key, {
          frames: [3]
        }),
        frameRate: 10,
        yoyo: false,
        repeat: 0
      }; 

    scene.anims.create(_animation);

    _animation = {
        key: "marco-idle-front",
        frames: scene.anims.generateFrameNumbers(scene._config.key, {
          frames: [1]
        }),
        frameRate: 10,
        yoyo: false,
        repeat: 0
      }; 

    scene.anims.create(_animation);


    _animation = {
        key: "marco-idle-right",
        frames: scene.anims.generateFrameNumbers(scene._config.key, {
          frames: [0]
        }),
        frameRate: 10,
        yoyo: false,
        repeat: 0
      }; 

    scene.anims.create(_animation);


    _animation = {
        key: "marco-idle-left",
        frames: scene.anims.generateFrameNumbers(scene._config.key, {
          frames: [2]
        }),
        frameRate: 10,
        yoyo: false,
        repeat: 0
      }; 

    scene.anims.create(_animation);

    _animation = {
      key: "marco-running-front",
      frames: scene.anims.generateFrameNumbers(scene._config.key+"_run", {
        frames: [6,7,8,9,10,11]
      }),
      frameRate: 10,
      yoyo: false,
      repeat: -1
      };
      //la inizializziamo
      scene.anims.create(_animation);



    _animation = {
      key: "marco-running-back",
      frames: scene.anims.generateFrameNumbers(scene._config.key+"_run", {
          frames: [18,19,20,21,22,23]
      }),
      frameRate: 10,
      yoyo: false,
      repeat: -1
      };
      //la inizializziamo
      scene.anims.create(_animation);


      _animation = {
        key: "marco-running-right",
        frames: scene.anims.generateFrameNumbers(scene._config.key+"_run", {
          frames: [0,1,2,3,4,5]
        }),
        frameRate: 10,
        yoyo: false,
        repeat: -1
      };
      //la inizializziamo
      scene.anims.create(_animation);

}
