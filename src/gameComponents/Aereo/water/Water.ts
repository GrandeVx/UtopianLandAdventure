import LivelloAereo from "../../../scenes/livelli/LivelloAereo";
import IWater from "./IWater";

export default class Water extends Phaser.GameObjects.Sprite implements IWater {
  protected _config: genericConfig;
  protected _scene: LivelloAereo;
  private _body: Phaser.Physics.Arcade.Body;

  private _isActive: boolean = true;


  // ---- State Machine ----
  private _animState : any;
  private _animPredicates : any;
  //private _moveState : any;
  //private _movePredicates : any;
  //private _didPressJump: boolean = false;
  // ---- State Machine ----

  constructor(params: genericConfig) {
    super(params.scene, params.x, params.y, params.key);
    this._config = params;
    this._scene = <LivelloAereo>params.scene;
    this._config.scene.physics.world.enable(this);
    this._body = <Phaser.Physics.Arcade.Body>this.body;

    this.setDepth(11);
    this._body.setSize(0.8).setImmovable(true).setVelocityY(-70);

    this._scene.addWater(this);
    this._scene.add.existing(this);
    this.setupanimation();

    this._scene.tweens.add({
      targets: this, alpha: .5, scale: 0.5, duration: 2500,
      onComplete: () => {
        this._scene.removeWater(this);
      }
    })
  }

  setupanimation(): void {

    let _animation = {
      key: "water-drop",
      frames: this.anims.generateFrameNumbers("water", {
      frames: [0, 1, 2, 3, 5] //relativo array
      }),
      frameRate: 10,
      yoyo: false,
      repeat: -1
    };
    this.anims.create(_animation);
   
    this.play("water-drop");
  }


  update(time: number, delta: number) {
    //if (this.y < 0 || this.x < 0 ) { this._scene.removeWater(this); }

  }

}
