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
      conversation : [
      [
        {nome:"Rackete", dice:"Ciao Amelia! Sono felice di averti qui con me."},
        {nome:"Amelia", dice:"Ciao Rackete, anche io sono felice di essere qui con te."},
        {nome:"Rackete", dice:"Sapevi che una delle cose più importanti da fare per \n\nsalvaguardare l'ambiente marino è proteggere l'acqua \n\ne promuoverne il riutilizzo?"},
        {nome:"Amelia", dice:"No, non lo sapevo. Come possiamo fare \n\nla differenza nella vita quotidiana?"},
        {nome:"Rackete", dice:"Ci sono molte cose che possiamo fare, \n\ncome ridurre l'uso di plastica monouso, raccogliere la plastica\n\ne riutilizzare l'acqua per mansioni di pulizia\n\nnelle scuole per esempio!"},
        {nome:"Amelia", dice:"Cosa possiamo fare per promuovere l'uso \n\nsostenibile dell'acqua a livello più ampio?"},
        {nome:"Rackete", dice:"Ci sono molte organizzazioni e progetti che lavorano per\n\nsensibilizzare le persone sull'importanza della salvaguardia\n\ndell'ambiente marino e dell'acqua.\n\nPotremmo anche organizzare eventi e attività educative\n\nnella nostra comunità."},
        {nome:"Amelia", dice:"Mi piace l'idea. Ma come possiamo fare una differenza concreta?"},
        {nome:"Rackete", dice:"Potremmo organizzare un'escursione in barca per esplorare\n\n i meravigliosi paesaggi marini e, nel contempo, \n\nfare un'azione di pulizia per mantenere l'acqua al sicuro.\n\nChe ne dici?"},
        {nome:"Amelia", dice:"Sì, mi piace molto l'idea! Sarebbe fantastico poter fare la\n\ndifferenza e godere della bellezza\n\ndell'ambiente marino."},
        {nome:"Rackete", dice:"Esattamente! Cominciamo a pianificare e coinvolgere\n\naltre persone ella nostra missione\n\nper salvaguardare\n\n'ambiente marino e l'acqua."}
    ],
    [
      {name:"Rackete", dice:"Grande lavoro, Amelia!\n\nSiamo riuscite a salvaguardare una grande quantità di acqua\n\ndurante la nostra ultima missione."},
      {name:"Amelia", dice:"Sì, è stato fantastico vedere quanti hanno partecipato\n\ne si sono uniti alla nostra causa per proteggere\n\nl'ambiente marino e l'acqua."},
      {name:"Rackete", dice:"Assolutamente!\n\nE Sappi che l’acqua che abbiamo salvato\n\ndurante la nostra missione sarà depurata e usata per i servizi\n\nigienici scolastici e per altre mansioni sostenibili nella\n\nnostra comunità "},
      {name:"Amelia", dice:"Sono felice di sapere che il nostro lavoro sta facendo\n\nuna vera differenza.\n\nContinuerò a fare la mia parte per proteggere\n\nl'ambiente e l'acqua in futuro."}
    ]
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

  private _lvljustfinished: boolean = false;
  private _lvlplaying : String = "";


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

    /*
    this._marco = new Marco({
      scene: this, x: 1236.7444444444475 , y:
      2140.000000000002, key: "marco"
    });
    */

    this._car.setAlpha(1).setDepth(101);

    this._player.setAlpha(1).setDepth(101);
    this._adam.setAlpha(1).setDepth(101);
    //this._marco.setAlpha(1).setDepth(101);
    this._spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); 

    this.createMap();
    this.createMessage();

  }

  createMessage() : void {


  }

  finishchatting(lvl:String) : void {

    if (lvl == "LivelloMarino") {
      this._lvljustfinished = true;
      this._lvlplaying = "LivelloMarino";
    }

    this._player._bodyBlock = false;

    if (lvl != "") {
      this.scene.start(String(lvl));
    }


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


    if (this._lvljustfinished) {
      this._lvljustfinished = false;
      this._adam.movit(this._events_cordinate[0].event.conversation[1],this._player,true);
    }

    this._events_cordinate.forEach(element => {
      if ((this.float2int(this._player.x) - element.x < 30) && (this.float2int(this._player.y) - element.y > 0 && this.float2int(this._player.y) - element.y < 20)) {
        {

          switch (element.event.who) {
            case "adam":
              this._last_cordinate.x = this.float2int(this._player.x);
              this._last_cordinate.y = this.float2int(this._player.y);
              if (!this._events_done.adam ){
                this._events_done.adam = true;
                this._adam.movit(element.event.conversation[0],this._player);
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
