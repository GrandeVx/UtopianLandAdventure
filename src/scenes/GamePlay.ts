import Hero from "../gameComponents/hero/Hero";
import Adam from "../gameComponents/adam/Adam";
import Car from "../gameComponents/car/Car";
import Message from "./Message";
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import { CustomShapes } from 'phaser3-rex-plugins/templates/ui/ui-components';
import { Vector } from "matter";
import LivelloMarino from "./livelli/LivelloMarino";
import Marco from "../gameComponents/marco/Marco";

export default class GamePlay extends Phaser.Scene {


  private _sfx: Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
  private _logo: Phaser.GameObjects.Image;
  private menuMusic: any
  private _player: Hero;
  private _car: Car;
  private _adam: Adam;
  private _marco : Marco
  private _last_cordinate: { x: number, y: number } = { x: 1400, y: 1200 };
  private _events_done : {adam:boolean,marco:boolean} = {adam:false,marco:false};
  private _spacebar: Phaser.Input.Keyboard.Key;

  private _events_cordinate: Array<{
    x:integer,
    y:integer,
    event:{who:any,livello:any,conversation:any}
  }>  
  = [
    { x:1452,
      y:1659,
    event:{
      who: "adam",
      livello: "1",
      conversation : 
      [
        {nome:"Rackete",dice:"Ehi ciao Amelia !"},
        {nome:"Amelia",dice:"Ciao Rackete"},
        {nome:"Rackete",dice:"Amelia ti devo aggiornare"},
        {nome:"Rackete",dice:"Adesso faccio parte della Sea Watch"},
        {nome:"Rackete",dice:"Per salvaguardare l ambiente marino"},
        {nome:"Amelia",dice:"WOW sono felicissima per te!"},
        {nome:"Amelia",dice:"Anche io vorrei aiutare l ambiente!"},
        {nome:"Rachete",dice:"Stavo proprio cercando un aiutante!"},
        {nome:"Rackete",dice:"Noi puliamo i fondali oceanici"},
        {nome:"Rachete",dice:"Vorresti aiutare la Sea Watch ?"},
    ]
    }
    },
    { x:1274,
      y:2045,
    event:{
      who: "marco",
      livello: "2",
      conversation : 
      [
          {nome:"Marco",dice:"Ehiii Come va ?"},
          {nome:"Amelia",dice:"Ehi Marco tutto bene"},
          {nome:"Marco",dice:"Vuoi Partecipare ?"}
      ]
    }
    },
  ]

  private map: Phaser.Tilemaps.Tilemap;
  private tileset : Phaser.Tilemaps.Tileset;
  private layer: Phaser.Tilemaps.TilemapLayer;
  private layer2: Phaser.Tilemaps.TilemapLayer;
  private layer3: Phaser.Tilemaps.TilemapLayer;
  private layer4: Phaser.Tilemaps.TilemapLayer;
  private event_point: Phaser.Tilemaps.TilemapLayer;
  private collision: Phaser.Tilemaps.TilemapLayer;


  private _message: Message;
  private _water : LivelloMarino


  constructor() {
    super({ key: "GamePlay" });
  }

  preload() {



  }
  init() {}
  create() {
    
    this.menuMusic = this.sound.add("lobby");
    var musicConfig = {
        mute: 0,
        volume: 0.2,
        seek: 0,
        loop: true, //DEBUG. Change back to true for final build
        delay: 0
    }
    // this.menuMusic.play(musicConfig);


    // questo evento serve per capire quando il bloco dei mesaggi è sparito
    this._message = <Message>this.scene.get("Message");
    this._message.events.off("finish_Conversation", this.finishchatting, this);
    this._message.events.on("finish_Conversation", this.finishchatting, this);

    this._water = <LivelloMarino>this.scene.get("LivelloMarino");
    this._water.events.off("lvfinish", this.finishchatting, this);
    this._water.events.on("lvfinish", this.finishchatting, this);


    this._player = new Hero({
      scene: this, x: this._last_cordinate.x, y:
      this._last_cordinate.y, key: "amelia"
    });

    this._car = new Car({
      scene: this, x: 64, y:
        450, key: "car"
    });

    this._adam = new Adam({
      scene: this, x: 1359, y:
      1632, key: "adam"
    });

    this._marco = new Marco({
      scene: this, x: 1236.7444444444475 , y:
      2140.000000000002, key: "marco"
    });

    this._car.setAlpha(1).setDepth(101);

    this._player.setAlpha(1).setDepth(101);
    this._adam.setAlpha(1).setDepth(101);
    this._marco.setAlpha(1).setDepth(101);
    this._spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); 

    this.createMap();
    this.createMessage();

  }

  createMessage() : void {


  }

  finishchatting(lvl:String) : void {
    this._player._bodyBlock = false;
    this.scene.start(String(lvl));
  }

       
  createMap() : void {

   this.game.scale.startFullscreen();

    if(this.map != null) this.map.destroy(); // distruggo l'oggetto per poi ricrearlo [leviamo la mappa del livello precedente]
    this.map = this.make.tilemap({key:"city"});
    
    this.physics.world.setBounds(0,0,this.map.widthInPixels,this.map.heightInPixels);
    this.tileset = this.map.addTilesetImage("b1","map")

    this.layer = this.map.createLayer("Strada",this.tileset,0,0)
    .setDepth(100).setAlpha(1)

    this.layer2 = this.map.createLayer("Palazzi",this.tileset,0,0)
    .setDepth(102).setAlpha(1)

    this.layer3 = this.map.createLayer("Piante",this.tileset,0,0)
    .setDepth(103).setAlpha(1)

    this.layer4 = this.map.createLayer("Addon",this.tileset,0,0)
    .setDepth(103).setAlpha(1)
    
    this.collision = this.map.createLayer("Collisione",this.tileset,0,0)
    .setDepth(10).setAlpha(0)

    this.collision.setCollisionByProperty({collide: true});

    this.physics.add.collider(this._player,this.collision);

    this.cameras.main.setZoom(2);
    
    this.cameras.main.startFollow(this._player,true,0.5,0.5);

  }  

  float2int (value:any) {
    return value | 0;
}




  update(time: number, delta: number) {


    this._events_cordinate.forEach(element => {
      if ((this.float2int(this._player.x) - element.x < 30) && (this.float2int(this._player.y) - element.y > 0 && this.float2int(this._player.y) - element.y < 20)) {
        {

          switch (element.event.who) {
            case "adam":
              this._last_cordinate.x = this.float2int(this._player.x);
              this._last_cordinate.y = this.float2int(this._player.y);
              if (!this._events_done.adam ){
                this._events_done.adam = true;
                this._adam.movit(element.event.conversation,this._player);
              }
              break;

            case "marco":
              this._last_cordinate.x = this.float2int(this._player.x);
              this._last_cordinate.y = this.float2int(this._player.y);
              if (!this._events_done.marco ){
                this._events_done.marco = true;
                this._marco.movit(element.event.conversation,this._player);
              }
            
            default:
              break;
          }
      }
    }
    });


    /*
    if (Phaser.Input.Keyboard.JustDown(this._spacebar)) {

      this.events.emit("updatereputation",5);
      
    }
    */


    this._player.update(time, delta);
    this._car.update(time, delta);
  }


}
