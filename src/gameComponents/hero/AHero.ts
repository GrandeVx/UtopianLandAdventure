export default function AnimationCreator(scene: any) {

    let _animation = {
        key: "amelia-idle-back",
        frames: scene.anims.generateFrameNumbers(scene._config.key, {
          frames: [3]
        }),
        frameRate: 10,
        yoyo: false,
        repeat: 0
      }; 

    scene.anims.create(_animation);

    _animation = {
        key: "amelia-idle-front",
        frames: scene.anims.generateFrameNumbers(scene._config.key, {
          frames: [1]
        }),
        frameRate: 10,
        yoyo: false,
        repeat: 0
      }; 

    scene.anims.create(_animation);


    _animation = {
        key: "amelia-idle-right",
        frames: scene.anims.generateFrameNumbers(scene._config.key, {
          frames: [0]
        }),
        frameRate: 10,
        yoyo: false,
        repeat: 0
      }; 

    scene.anims.create(_animation);


    _animation = {
        key: "amelia-idle-left",
        frames: scene.anims.generateFrameNumbers(scene._config.key, {
          frames: [2]
        }),
        frameRate: 10,
        yoyo: false,
        repeat: 0
      }; 

    scene.anims.create(_animation);



    _animation = {
        key: "amelia-running-right",
        frames: scene.anims.generateFrameNumbers(scene._config.key+"_run", {
          frames: [0,1,2,3,4,5]
        }),
        frameRate: 10,
        yoyo: false,
        repeat: -1
      };
      //la inizializziamo
      scene.anims.create(_animation);


    _animation = {
    key: "amelia-running-left",
    frames: scene.anims.generateFrameNumbers(scene._config.key+"_run", {
        frames: [12,13,14,15,16,17]
    }),
    frameRate: 10,
    yoyo: false,
    repeat: -1
    };
    //la inizializziamo
    scene.anims.create(_animation);

    _animation = {
        key: "amelia-running-front",
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
        key: "amelia-running-back",
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