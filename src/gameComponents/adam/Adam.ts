import IAdam from "./IAdam"; // Questa sezione varia ogni volta
import Hero from "../hero/Hero";
import GamePlay from "../../scenes/GamePlay";
import javascript_state_machine from "javascript-state-machine";
import AnimationCreator from "./AAdam";


// #TODO Testare la classe Player

export default class Adam extends Phaser.GameObjects.Sprite implements IAdam {

    // ---- Variabili ----
    protected _config: genericConfig;
    protected _scene: GamePlay;
    private _body: Phaser.Physics.Arcade.Body;
    private _cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private _spacebar: Phaser.Input.Keyboard.Key;
    private _animationDone : boolean = false;

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
        this.setScale(1); // Impostiamo la scala
        this.alpha = 1; // Impostiamo l'alpha
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
                    console.log(this._config.key+'-'+ lifecycle.to+'-'+this._lastdirection);
                    this.anims.play(this._config.key+'-'+ lifecycle.to+'-'+this._lastdirection);
                },
            },
        });

        this._animPredicates = {
            idle: () => {
              return this._body.acceleration.x === 0 && this._body.acceleration.y === 0;
            },
            run: () => {
              return this._body.acceleration.x !== 0 || this._body.acceleration.y !== 0;
            },
          };

        this._body.offset.y = 10; // serve per patchare il bug della dimensione (Rendere l'area di contatto minore)
    }

    public movit(chat: Array<{nome:String,dice:String}>,player:Hero) : void {

        if (!this._animationDone) 
        {
            player._bodyBlock = true;
            player._body.acceleration.x = 0;
            player._body.acceleration.y = 0;
            player._body.velocity.x = 0;
            player._body.velocity.y = 0;
            


            this._body.acceleration.y = 20;
            this._lastdirection = "front";
    
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
    
    
            setTimeout(() => {
                this._body.acceleration.y = 0;  
            
                this._body.acceleration.x = 20; 
            }
            , 510);
    
            setTimeout(() => {
                this._body.acceleration.x = 0;
    
                this._body.velocity.y = 0;
                this._body.velocity.x = 0;
                this._lastdirection = "right";
    
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
            this._scene.events.emit("conversazione",chat,"LivelloMarino");
            }
            

            
    
            , 3600);
        }
        this._animationDone = true;

    }



    update(time: number, delta: number): void {


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
