import IBonus from "./IBonus"; // Questa sezione varia ogni volta
import LivelloMarino from "../../../scenes/livelli/LivelloMarino";

// #TODO Testare la classe Player

export default class Bonus extends Phaser.GameObjects.Sprite implements IBonus {

  protected _config: genericConfig;
  protected _scene: LivelloMarino;
  protected _body: Phaser.Physics.Arcade.Body;
  protected _isActive: boolean = false;
  constructor(params: genericConfig) {
    super(params.scene, params.x, params.y, params.key);
    this._config = params;
    this._scene = <LivelloMarino>params.scene;
    this._config.scene.physics.world.enable(this);
    this._body = <Phaser.Physics.Arcade.Body>this.body;
    this._scene.addBonus(this);
    this._scene.add.existing(this);
    this._body.setGravity(0, 0)  .setCollideWorldBounds(true, 0.5).setImmovable(true); // lo spirte collide con i bordi dello schermo

  }


    update(time: number, delta: number): void {

    }

}
