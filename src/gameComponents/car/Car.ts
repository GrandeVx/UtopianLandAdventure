import ICar from "./ICar"; // Questa sezione varia ogni volta
import GamePlay from "../../scenes/GamePlay";
import javascript_state_machine from "javascript-state-machine";


// #TODO Testare la classe Player

export default class Hero extends Phaser.GameObjects.Sprite implements ICar {

    // ---- Variabili ----
    protected _config: genericConfig;
    protected _scene: GamePlay;
    private _body: Phaser.Physics.Arcade.Body;
    private _cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private _spacebar: Phaser.Input.Keyboard.Key;


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

        // this._body.setSize(16, 16); // Impostiamo la dimensione (width, height)

        this._body
            .setDragX(100)
            .setCollideWorldBounds(true, 0.5) // lo spirte collide con i bordi dello schermo
            .setImmovable(true); // lo sprite non verrà spostato da enti esterni

        this.setScale(2);
            

        this.setupanimations(); // Chiamiamo il metodo che imposta le animazioni
      }


    // ---- Metodi ----
    setupanimations(): void {


        let _animation = {
            key: "car-running",
            frames: this.anims.generateFrameNumbers(this._config.key, {
              frames: [0]
            }),
            frameRate: 10,
            yoyo: false,
            repeat: 0
          }; 

        this.anims.create(_animation);

        _animation = {
            key: "car-lateral",
            frames: this.anims.generateFrameNumbers(this._config.key, {
              frames: [1,2,3]
            }),
            frameRate: 10,
            yoyo: false,
            repeat: 0
          }; 

        this.anims.create(_animation);



        /* Generiamo il sistema di automatizazzione per le Animazioni */

        this._animState = new javascript_state_machine({
            init: 'idle',
            transitions: [
                { name: 'idle', from: ['running'], to: 'idle' },
                { name: 'run', from: ['idle'], to: 'running' },
            ],
            methods: {
                onEnterState: (lifecycle : any ) => {
                    console.log(this._config.key+'-'+ lifecycle.to);
                    this.anims.play(this._config.key+'-'+ lifecycle.to);
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

        this._body.setVelocity(0);

        this._body.setVelocityX(40);

        
        


        /* se si tiene premuto il tasto per saltare il personaggio raggiunge il picco massimo
        se invece si rilascia subito il click allora si evita di farlo arrivare al picco massimo */
        /*
        if (this._moveState.is('jumping')) {
        
            if (!this._cursors.up.isDown && this.body.velocity.y < -150) {
                this._body.setVelocityY(-150);
            }

        }
        */

        // per ogni azione che possiamo eseguire in base al nostro stato attual


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
