import GamePlay from "../../../scenes/GamePlay";
import IPlane from "./IPlane";
import javascript_state_machine from "javascript-state-machine";
import Water from "../water/Water";

export default class Plane extends Phaser.GameObjects.Sprite implements IPlane {
  // ---- Variabili ----
  protected _config: genericConfig;
  protected _scene: GamePlay;
  private _body: Phaser.Physics.Arcade.Body;
  private _cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private _spacebar: Phaser.Input.Keyboard.Key;
  private _isActive: boolean = true;
  // ---- Tween ----
  private tween: any;
  
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
    this._scene = <GamePlay>params.scene;
    this._config.scene.physics.world.enable(this);
    this._body = <Phaser.Physics.Arcade.Body>this.body;
    this._scene.add.existing(this);

    this._body
      .setDragX(1000)
      .setBounce(0, 0)
      .setCollideWorldBounds(true, 0.5)
      .setImmovable(true)
      .setMaxVelocity(200, 550)
    
    this.setDepth(11);
    
    //inizializzo i tasti direzionali
    this._cursors = this._scene.input.keyboard.createCursorKeys();
    //inizializzo la barra spaziatrice
    this._spacebar = this._scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    this.setupanimations();
  }

  setupanimations(): void {
    //animazione mentre è in volo
    let _animation = {
      key: "plane-fly",
      frames: this.anims.generateFrameNumbers( this._config.key, {
        frames: [0, 1, 2, 3]
      }),
      frameRate: 8,
      yoyo: false,
      repeat: -1
    };
    this.anims.create(_animation);

    //quando si alza o si abbassa
    _animation = {
      key: "plane-move",
      frames: this.anims.generateFrameNumbers( this._config.key, {
        frames: [4, 5, 6, 7]//array da mettere
      }),
      frameRate: 10,
      yoyo: false,
      repeat: -1
    };
    this.anims.create(_animation);

    // Generiamo il sistema di automatizazzione per le Animazioni 

    this._animState = new javascript_state_machine({
      init: 'fly',
      transitions: [
          { name: 'fly', from: ['move'], to: 'fly' },
          { name: 'move', from: ['fly'], to: 'move' },
      ],
      methods: {
          onEnterState: (lifecycle : any ) => {
              console.log(this._config.key+'-'+ lifecycle.to);
              this.anims.play(this._config.key+'-'+ lifecycle.to);
          },
      },
    });

    this._animPredicates = {
      fly: () => {
        return this.body.velocity.x === 0;
      },
      move: () => {
        return this._cursors.left.isDown || this._cursors.right.isDown;
      },
    };
    /*tween di quando viene hittato
    var tween = this.scene.tweens.add({
      targets: Phaser.GameObjects.Sprite,
      alpha: { from: 1, to: 0 },
      ease: 'Linear',
      duration: 1000,
      repeat: 1,
      yoyo: true
    });*/
  }

  getActivity(): boolean { return this._isActive }

  setActivity(): void { this._isActive = !this._isActive }

  update(time: number, delta: number) {

    this._body.setVelocity(0);
    this.setFlipX(false);

    if (this._cursors.left.isDown && !this._cursors.right.isDown)
    {
      this._body.setVelocityX(-200);
      this.setFlipX(true);
    }
    else if (this._cursors.right.isDown && !this._cursors.left.isDown)
    {
        this._body.setVelocityX(200);
    }
/*
    if (this._cursors.up.isDown && !this._cursors.down.isDown)
    {
        this._body.setVelocityY(-200);
    }
    else if (this._cursors.down.isDown && !this._cursors.up.isDown)
    {
        this._body.setVelocityY(200);
    }
*/
    if(Phaser.Input.Keyboard.JustDown(this._spacebar)){
      new Water ({scene: this._scene, x: this.x, y: this.y, key: "water" });
    }

    //-- Animazioni --
    for (const t of this._animState.transitions()) {
      // se la transizione è valida e il metodo associato è valido
      if (t in this._animPredicates && this._animPredicates[t]()) {
        // eseguiamo l'azione e cambiamo stato
        this._animState[t]();
        break;
        }
    }
    // -- Animazioni --
  }
}