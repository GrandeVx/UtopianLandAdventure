import LivelloAereo from "../../../scenes/livelli/LivelloAereo";
import IEnergy from "./IEnergy";
import javascript_state_machine from "javascript-state-machine";

export default class Energy extends Phaser.GameObjects.Sprite implements IEnergy {
  // ---- Variabili ----
  protected _config: genericConfig;
  protected _scene: LivelloAereo;
  private _body: Phaser.Physics.Arcade.Body;

  // ---- Costruttore ----
  constructor(params: genericConfig) {
    super(params.scene, params.x, params.y, params.key);
    this._config = params;
    this._scene = <LivelloAereo>params.scene;
    this._config.scene.physics.world.enable(this);
    this._body = <Phaser.Physics.Arcade.Body>this.body;

    this._body
      //.setSize(0.2)
      .setImmovable(true)
      .setVelocityY(100);
    
    this._scene.addEnergy(this);
    this._scene.add.existing(this);

    this.setDepth(11).setScale(0.3);
    this.setupanimations();
  }

  setupanimations(): void {
    //animazione mentre l'uccello vola
    let _animation = {
      key: "energy-idle",
      frames: this.anims.generateFrameNumbers("energy", {
        frames: [0, 1]
      }),
      frameRate: 2,
      yoyo: false,
      repeat: -1
    };
    this.anims.create(_animation);

    this.anims.play("energy-idle");

  }
  

  
  //getBody(): Phaser.Physics.Arcade.Body { return this._body }
  
  update(time: number, delta: number) {

  }
}