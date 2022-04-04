import IEnemy from "./IEnemy"; // Questa sezione varia ogni volta
import LivelloMarino from "../../../scenes/livelli/LivelloMarino";
import javascript_state_machine from "javascript-state-machine";


// #TODO Testare la classe Player

export default class Enemy extends Phaser.GameObjects.Sprite implements IEnemy {

  
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
      this._scene.addEnemy(this);
      this._scene.add.existing(this);
      this._body.setImmovable(true).setVelocityX(200);
      this._body.collideWorldBounds=true;
      this._body.onWorldBounds=true;
      this._scene.physics.world.on('worldbounds', ()=>{
          this.x=22;
          this._body.setImmovable(true).setVelocityX(200);
      }
  );
}
    
    update(time: number, delta: number): void {

    }

}
