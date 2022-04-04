import IPlayer from "./IPlayer"; // Questa sezione varia ogni volta
import GamePlay from "../../scenes/GamePlay";
import javascript_state_machine from "javascript-state-machine";


// #TODO Testare la classe Player

export default class Player extends Phaser.GameObjects.Sprite implements IPlayer {

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
        private _didPressJump: boolean = false;
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
    
        this._body.setGravity(0,1200) // Impostiamo la gravità (x,y)
        this.setDepth(11); // Impostiamo la profondità (sarabbe il valore z in una scena 3D)

        this._body
            .setDragX(100)
            .setCollideWorldBounds(true, 0.5) // lo spirte collide con i bordi dello schermo
            .setImmovable(true); // lo sprite non verrà spostato da enti esterni
    
        this._cursors = this._scene.input.keyboard.createCursorKeys(); // Generiamo una variabile con cui Controllare i "tasti"
        this._spacebar = this._scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); // Generiamo una variabile dedita al controllo del tasto "Space"


        this.setupanimations(); // Chiamiamo il metodo che imposta le animazioni
        this.setupMovement(this); // Chiamiamo il metodo che imposta le azioni
      }


    // ---- Metodi ----
    setupanimations(): void {

        /* Generiamo il sistema di automatizazzione per le Animazioni */

        this._animState = new javascript_state_machine({
            init: 'idle',
            transitions: [
                { name: 'idle', from: ['running'], to: 'idle' },
                { name: 'run', from: ['idle'], to: 'running' },
                { name: 'jump', from: ['idle', 'running'], to: 'jumping' },
            ],
            methods: {
                onEnterState: (lifecycle : any ) => {
                    this.anims.play(this._config.key+'-'+ lifecycle.to);
                },
            },
        });

        this._animPredicates = {
            idle: () => {
              return this._body.onFloor() && this.body.velocity.x === 0;
            },
            run: () => {
              return this._body.onFloor() && this.body.velocity.x !== 0;
            },
            jump: () => {
              return this._body.velocity.y < 0;
            },
          };
    }

    setupMovement(element : any): void {

        this._moveState = new javascript_state_machine({
            init: 'standing',
            transitions: [
                { name: 'jump', from: 'standing', to: 'jumping' }, // quando il personaggio salta
                { name: 'fall', from : 'standing', to: 'falling' }, // quando il personaggio cade
                { name: 'touchdown', from: '*', to: 'standing' }, // quando tocca il piano
            ],
            methods: {
                onEnterState: (lifecycle : any) => {
                    console.log(lifecycle.from + ' -> ' + lifecycle.to);
            },

                onJump: function() { // quando il personaggio salta
                    element._body.setVelocityY(-400)
                },

            }
        });

        // incubatore di metodi per la gestione delle trasizioni
        // se chiamando il metodo dell'azione che vogliamo eseguire il return sarà true allora possiamo eseguire l'azione
        this._movePredicates = {
            jump: () => {
                return this._didPressJump;
            },
            fall: () => {
                return !this._body.onFloor();
            },
            touchdown: () => {
                return this._body.onFloor();
            },
        }


    }

    update(time: number, delta: number): void {

        /* Questo Metodo viene chiamato ogni volta che viene richiamato il metodo "update" della scena.
        Qui si può scrivere tutto il codice che si vuole eseguire ogni volta che viene chiamato il metodo "update" */

        this._body.setVelocity(0);

        if (this._cursors.left.isDown && !this._cursors.right.isDown)
        {
            this._body.setVelocityX(-200);
        }
        else if (this._cursors.right.isDown && !this._cursors.left.isDown)
        {
            this._body.setVelocityX(200);
        }
    
        if (this._cursors.up.isDown && !this._cursors.down.isDown)
        {
            this._body.setVelocityY(-200);
        }
        else if (this._cursors.down.isDown && !this._cursors.up.isDown)
        {
            this._body.setVelocityY(200);
        }


        /* se si tiene premuto il tasto per saltare il personaggio raggiunge il picco massimo
        se invece si rilascia subito il click allora si evita di farlo arrivare al picco massimo */
        if (this._moveState.is('jumping')) {
        
            if (!this._cursors.up.isDown && this.body.velocity.y < -150) {
                this._body.setVelocityY(-150);
            }

        }


        // per ogni azione che possiamo eseguire in base al nostro stato attuale
        for (const t of this._moveState.transitions()) {
            // se la transizione è valida e il metodo associato è valido
            if (t in this._movePredicates && this._movePredicates[t]()) {
                // eseguiamo l'azione e cambiamo stato
                this._moveState[t]();
                break;
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