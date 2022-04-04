import IHero from "./IHero"; // Questa sezione varia ogni volta
import GamePlay from "../../scenes/GamePlay";
import javascript_state_machine from "javascript-state-machine";
import AnimationCreator from "./AHero";


// #TODO Testare la classe Player

export default class Hero extends Phaser.GameObjects.Sprite implements IHero {

    // ---- Variabili ----
    protected _config: genericConfig;
    protected _scene: GamePlay;
    public _body: Phaser.Physics.Arcade.Body;
    private _cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private _spacebar: Phaser.Input.Keyboard.Key;

    public _bodyBlock : boolean = false;

        // ---- State Machine ----
        private _animState : any;
        private _moveState : any;
        private _animPredicates : any;
        private _movePredicates : any;
        private _lastdirection : string = "back";
        // ---- State Machine ----
        
    // ---- Variabili ----


    // ---- Costruttore ----
    constructor(params: genericConfig) {
        super(params.scene, params.x, params.y, params.key);
        this._config = params;
        this._scene = <GamePlay>params.scene;
        this._config.scene.physics.world.enable(this); // Abilitiamo la fisica sullo sprite
        this._body = <Phaser.Physics.Arcade.Body>this.body; // salviamo il "puntatore" al corpo fisico
        this._scene.add.existing(this); // Aggiungiamo lo sprite alla scena
    
        this._body.setGravity(0,0) // Impostiamo la gravità (x,y)
        // this.setDepth(11); // Impostiamo la profondità (sarabbe il valore z in una scena 3D)
        this.setScale(1.2); // Impostiamo la scala

        this._body.setSize(16, 16); // Impostiamo la dimensione (width, height)

        this._body
            .setDragX(100)
            .setCollideWorldBounds(true, 0.5) // lo spirte collide con i bordi dello schermo
            .setImmovable(true); // lo sprite non verrà spostato da enti esterni
            
        this._cursors = this._scene.input.keyboard.createCursorKeys(); // Generiamo una variabile con cui Controllare i "tasti"
        this._spacebar = this._scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); 

        this.setupanimations(); // Chiamiamo il metodo che imposta le animazioni
      }


    // ---- Metodi ----
    setupanimations(): void {

        AnimationCreator(this) // Chiamiamo il metodo che crea le animazioni [Più pulito]


        /* Generiamo il sistema di automatizazzione per le Animazioni */

        this._animState = new javascript_state_machine({
            init: 'idle',
            transitions: [
                { name: 'idle', from: ['running'], to: 'idle' },
                { name: 'run', from: ['idle','running'], to: 'running' },
            ],
            methods: {
                onEnterState: (lifecycle : any ) => {
                
                    this.anims.play(this._config.key+'-'+ lifecycle.to+'-'+this._lastdirection);
                },
            },
        });

        this._animPredicates = {
            idle: () => {
              return this.body.velocity.x === 0 && this.body.velocity.y === 0;
            },
            run: () => {
              return this.body.velocity.x !== 0 || this.body.velocity.y !== 0;
            },
          };

        this._body.offset.y = 10; // serve per patchare il bug della dimensione (Rendere l'area di contatto minore)
    }


    update(time: number, delta: number): void {

        /* Questo Metodo viene chiamato ogni volta che viene richiamato il metodo "update" della scena.
        Qui si può scrivere tutto il codice che si vuole eseguire ogni volta che viene chiamato il metodo "update" */

        if (!this._bodyBlock) 
            {

                this._body.setVelocity(0);

                if (this._cursors.left.isDown && !this._cursors.right.isDown) 
                {
                    this._lastdirection = 'left';
                    this._body.setVelocityX(-100);
        
                }
                else if (this._cursors.right.isDown && !this._cursors.left.isDown)
                {
                    this._lastdirection = 'right';
                    this._body.setVelocityX(100);
        
                }
            
                if (this._cursors.up.isDown && !this._cursors.down.isDown )
                {
                    this._lastdirection = 'front';
                    this._body.setVelocityY(-100);
        
                }
                else if (this._cursors.down.isDown && !this._cursors.up.isDown)
                {
                    this._lastdirection = 'back';
                    this._body.setVelocityY(100);
                }
        
                
                if (Phaser.Input.Keyboard.JustDown(this._spacebar)) {
        
                /* let Arrays = [
                        {nome:"Amelia:",dice:"Ciao"},
                        {nome:"Giovanni:",dice:"Ciao Amica"},
                        {nome:"Luca:",dice:"Ragazzi Come Sta Andando"},
                    ]
                    //let Arrays : Array<> = ['idle','run','CIAO','AMICO'];
                    this._scene.events.emit("visible",Arrays)
                */
        
                    console.log(this._body.x, this._body.y);
                }
        
            }
                
        
                // -- Animazioni --
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
