import LivelloAereo from "../../../scenes/livelli/LivelloAereo";
import ITree from "./ITree";
import javascript_state_machine from "javascript-state-machine";

export default class Tree extends Phaser.GameObjects.Sprite implements ITree {
  protected _config: genericConfig;
  protected _scene: LivelloAereo;
  private _body: Phaser.Physics.Arcade.Body;

  // ---- State Machine ----
  private _animState : any;
  private _animPredicates : any;
  // ---- State Machine ----

  constructor(params: genericConfig) {
    super(params.scene, params.x, params.y, params.key);
    this._config = params;
    this._scene = <LivelloAereo>params.scene;
    this._config.scene.physics.world.enable(this);
    this._body = <Phaser.Physics.Arcade.Body>this.body;

    this.setAlpha(1)
      .setScale(1.5)
      .setDepth(11);
    
    this._body
      .setImmovable(true)
      .setVelocityY(100);

    this._scene.addTree(this);
    this._scene.add.existing(this);

    this.setupanimation();
  }

  setupanimation(): void {
    let _animation = {
      key: "tree-burning",
      frames: this.anims.generateFrameNumbers(this._config.key, {
        frames: [0, 1, 2, 3]//array
      }),
      frameRate: 8,
      yoyo: false,
      repeat: -1
    };
    this.anims.create(_animation);

    _animation = {
      key: "tree-burnt",
      frames: this.anims.generateFrameNumbers(this._config.key, {
        frames: [4, 5, 6, 7]//array
      }),
      frameRate: 8,
      yoyo: false,
      repeat: -1
    };
    this.anims.create(_animation);

    this.anims.play("tree-burning");

  }

  update(time: number, delta: number) {  }
}
