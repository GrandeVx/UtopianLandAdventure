import IHero from "./IHero"; // Questa sezione varia ogni volta
import LivelloMarino from "../../../scenes/livelli/LivelloMarino";
import javascript_state_machine from "javascript-state-machine";


// #TODO Testare la classe Player

export default class Hero extends Phaser.GameObjects.Sprite implements IHero {

    // ---- Variabili ----
    protected _config: genericConfig;
    protected _scene: LivelloMarino;
    private _body: Phaser.Physics.Arcade.Body;
    private _cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private _spacebar: Phaser.Input.Keyboard.Key;

        // ---- State Machine ----
        private _animState : any;
        private _moveState : any;
        private _animPredicates : any;
        private _movePredicates : any;
        private _didPressJump: boolean = false;
        public p: boolean =false;
        public n: integer =0;
        public vel: integer =0;

        // ---- State Machine ----
        
    // ---- Variabili ----


    // ---- Costruttore ----
    constructor(params: genericConfig) {
        super(params.scene, params.x, params.y, params.key);
        this._config = params;
        this._scene = <LivelloMarino>params.scene;
        this._config.scene.physics.world.enable(this); // Abilitiamo la fisica sullo sprite
        this._body = <Phaser.Physics.Arcade.Body>this.body; // salviamo il "puntatore" al corpo fisico
        this._scene.add.existing(this); // Aggiungiamo lo sprite alla scena
    
        this._body.setGravity(0,0) // Impostiamo la gravità (x,y)
        this.setDepth(0); // Impostiamo la profondità (sarabbe il valore z in una scena 3D)

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


        let _animation = {
            key: "hero-idle",
            frames: this.anims.generateFrameNumbers(this._config.key, {
              frames: [0,1,2,3]
            }),
            frameRate: 3,
            yoyo: false,
            repeat: -1
          }; 

        this.anims.create(_animation);


        _animation = {
            key: "hero-running",
            frames: this.anims.generateFrameNumbers(this._config.key, {
              frames: [4,5,6,7,8,9,10,11]
            }),
            frameRate: 7,
            yoyo: false,
            repeat: -1
          };
          this.anims.create(_animation);
        
          _animation = {
            key: "hero-boost2",
            frames: this.anims.generateFrameNumbers(this._config.key, {
              frames: [0,1,2,3]
            }),
            frameRate: 13,
            yoyo: false,
            repeat: -1
          };
          this.anims.create(_animation);
        
          _animation = {
            key: "hero-boost",
            frames: this.anims.generateFrameNumbers(this._config.key, {
              frames: [4,5,6,7,8,9,10,11]
            }),
            frameRate: 20,
            yoyo: false,
            repeat: -1
          };
          //la inizializziamo
          this.anims.create(_animation);


        /* Generiamo il sistema di automatizazzione per le Animazioni */

        this._animState = new javascript_state_machine({
            init: 'idle',
            transitions: [
                { name: 'idle', from: ['running', 'boost2'], to: 'idle' },
                { name: 'run', from: ['idle', 'boost2', 'boost'], to: 'running' },
                { name: 'boost2', from: ['idle', 'boost','running'], to: 'boost2' },
                { name: 'boost', from: ['running', 'boost2'], to: 'boost' },
            ],
            methods: {
                onEnterState: (lifecycle : any ) => {
                    this.anims.play(this._config.key+'-'+ lifecycle.to);
                },
            },
        });

        this._animPredicates = {
            idle: () => {
              return (this.body.velocity.x === 0 && this.body.velocity.y === 0)&&this.vel==0;
            },
            run: () => {
              return (this.body.velocity.x !== 0 || this.body.velocity.y !== 0)&& this.vel==0;
            },
            boost2: () => {
                return (this.body.velocity.x === 0 && this.body.velocity.y === 0)&&this.vel!=0;
              },
            boost: () => {
                return (this.body.velocity.x !== 0 || this.body.velocity.y !== 0)&&this.vel!=0;
              },
          };
    }




    setupMovement(element : any): void {

        this._moveState = new javascript_state_machine({
            init: 'standing',
            transitions: [
                { name: 'jump', from: 'standing', to: 'jumping' }, // quando il personaggio salta
             //   { name: 'fall', from : 'standing', to: 'falling' }, // quando il personaggio cade
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


        if(!this.p)
         this._body.setVelocity(0);

        this.setAngle(0);

        if(this.n==50){

            this.p=false;
            this.n=0
        }

        if(this.p)
        {   if(this.n==0) 
                this._body.setVelocityX(0);
            this._body.setVelocityY(-200);
            this.n++;
        
        }
        else{ if (this._cursors.left.isDown && !this._cursors.right.isDown)
        {
            this._body.setVelocityX(-130-this.vel);
            this.setFlipX(true);
        
           
        }
        else if (this._cursors.right.isDown && !this._cursors.left.isDown)
        {
            this._body.setVelocityX(130+this.vel);
            this.setFlipX(false);
       
        }
    
        if (this._cursors.up.isDown && !this._cursors.down.isDown)
        {
            this._body.setVelocityY(-130-this.vel);
  
        }
        else if (this._cursors.down.isDown && !this._cursors.up.isDown)
        {
            this._body.setVelocityY(130+this.vel);

        }


        //Gestisce angolazione personaggio
        if(this._cursors.down.isDown && this._cursors.left.isDown)
            this.setAngle(-45);
        else if(this._cursors.down.isDown && this._cursors.right.isDown)
            this.setAngle(45);
        else if(this._cursors.up.isDown && this._cursors.right.isDown)
            this.setAngle(-45);
        else if(this._cursors.up.isDown && this._cursors.left.isDown)
           this.setAngle(45);
    }
        //angolazione non settata per up e down


        /* Questo Metodo viene chiamato ogni volta che viene richiamato il metodo "update" della scena.
        Qui si può scrivere tutto il codice che si vuole eseguire ogni volta che viene chiamato il metodo "update" */

  
        /* se si tiene premuto il tasto per saltare il personaggio raggiunge il picco massimo
        se invece si rilascia subito il click allora si evita di farlo arrivare al picco massimo */
        /*
        if (this._moveState.is('jumping')) {
        
            if (!this._cursors.up.isDown && this.body.velocity.y < -150) {
                this._body.setVelocityY(-150);
            }

        }
        */

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
