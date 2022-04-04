import LivelloAereo from "../../../scenes/livelli/LivelloAereo";
import IBird from "./IBird";
import javascript_state_machine from "javascript-state-machine";

export default class Bird extends Phaser.GameObjects.Sprite implements IBird {
  // ---- Variabili ----
  protected _config: genericConfig;
  protected _scene: LivelloAereo;
  private _body: Phaser.Physics.Arcade.Body;

  private _wasHit: boolean = false;

  // ---- State Machine ----
  private _animState : any;
  private _animPredicates : any;
  //private _moveState : any;
  //private _movePredicates : any;
  //private _didPressJump: boolean = false;
  // ---- State Machine ----

  // ---- Costruttore ----
  constructor(params: genericConfig) {
    super(params.scene, params.x, params.y, params.key);
    this._config = params;
    this._scene = <LivelloAereo>params.scene;
    this._config.scene.physics.world.enable(this);
    this._body = <Phaser.Physics.Arcade.Body>this.body;

    this._scene.addBird(this);
    this._scene.add.existing(this);

    this._body
      .setImmovable(true)
      .setVelocityY(150);
    
    this.setDepth(11).setScale(0.5);
    this._scene.addBird(this);
    this._scene.add.existing(this);

    this.setupanimations();
  }

  setupanimations(): void {
    //animazione mentre l'uccello vola
    let _animation = {
      key: "bird-living",
      frames: this.anims.generateFrameNumbers(this._config.key, {
        frames: [0, 1, 2]
      }),
      frameRate: 2,
      yoyo: false,
      repeat: -1
    };
    this.anims.create(_animation);

    
    //animazione mentre l'uccello vola
    _animation = {
      key: "bird-goaway",
      frames: this.anims.generateFrameNumbers(this._config.key, {
        frames: [0]
      }),
      frameRate: 2,
      yoyo: false,
      repeat: -1
    };
    this.anims.create(_animation);

    this.anims.play("bird-living");
  }
  
  //getBody(): Phaser.Physics.Arcade.Body { return this._body }
  setAccelerationX(value: number): void {
    const _rnd: number = Phaser.Math.RND.integerInRange(0, 1);
    if( _rnd === 0){
      this._body.setAccelerationX(value * -1);
      this._scene.tweens.add({
        targets: this, angle: 135, duration: 2500,
        onComplete: () => {
          this.setAngle(135);
        }
      })
    }
    else {
      this._body.setAccelerationX(value);
      this._scene.tweens.add({
        targets: this, angle: -45, duration: 2500,
        onComplete: () => {
          this.setAngle(-45);
        }
      })
    }    
  }
  
  update(time: number, delta: number) {  }
}