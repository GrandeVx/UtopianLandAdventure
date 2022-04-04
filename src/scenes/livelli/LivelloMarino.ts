import Hero from "../../gameComponents/Marino/hero/Hero";
import Points from "../../gameComponents/Marino/points/Points";
import Enemy from "../../gameComponents/Marino/enemy/Enemy";
import Bonus from "../../gameComponents/Marino/bonus/Bonus";
export default class LivelloMarino extends Phaser.Scene {

  private _sfx: Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
  private _logo: Phaser.GameObjects.Image;

  private _player: Hero;
  private points: Points;
  private pointsgroup: Phaser.GameObjects.Group;
  private enemy: Enemy;
  private enemygroup: Phaser.GameObjects.Group;
  private bonus: Bonus;
  private bonusgroup: Phaser.GameObjects.Group;
  private _cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private map: Phaser.Tilemaps.Tilemap;
  private tileset : Phaser.Tilemaps.Tileset;
  private layer: Phaser.Tilemaps.TilemapLayer;
  private layer2: Phaser.Tilemaps.TilemapLayer;
  private layer3: Phaser.Tilemaps.TilemapLayer;
  private layer4: Phaser.Tilemaps.TilemapLayer;
  private collisione: Phaser.Tilemaps.TilemapLayer;
  private _bg : Phaser.GameObjects.TileSprite;
  private _bg2 : Phaser.GameObjects.TileSprite;

  private _timeLeft: number = 0;

  private _levelTitle: Phaser.GameObjects.BitmapText;


  private _spacebar: Phaser.Input.Keyboard.Key;

  
  private timeLeft: number;
  private timeMask: Phaser.GameObjects.Sprite;
  private gameTimer: Phaser.Time.TimerEvent;
  private timerContainer: Phaser.GameObjects.Sprite;
  private timeBar: Phaser.GameObjects.Sprite;

  private _levelcount: number = 0;
  private _leveldata : {level_1:any} = {
    level_1 : {

      points: [
        {x:419.8055555555504,y:1268.166666666662,key:"points_b"},
        {x:804.7222222222213,y:1268.000000000002,key:"points_m"},
        {x:1281.7777777777828,y:444.83333333333235,key:"points_s"},
        {x:461.49999999999955,y:903.9999999999982,key:"points_s"},
      ],

      bonus: [
        {x:968.4166666666722,y:719.3333333333363,key:"bonus"},
      ],

      enemy: [
        {x:385.5833333333278,y:1530.333333333342,key:"enemy"},
        {x:904.2500000000048,y:1283.3333333333333,key:"enemy"},
      ],

      player: {x:1770,y:1476.4999999999977},

    }

  }

  public numerop: integer=0;
  constructor() {
    super({ key: "LivelloMarino" });
  }
/*



      BISOGNA 
      -SETTARE GLI SPAWN DI TUTTE LE ENTITA' E ALTRO PER ESEMPIO ZONA DOVE STA LA BARCA E TI DA PUNTI
      -GESTIRE TIPOLOGIE MULTIPLE DI ENEMY E POINTS (ad esempio pesci più difficili da schivare e oggetti che danno più punti)
      -FAR CAPIRE IN QUALCHE MODO CHE SI POSSIEDE UN OGGETTO QUANDO LO SI DEVE PORTARE SU
      -HUD ossigeno


*/
  preload() {
    this.load.image("energybar", "energybar.png");
    this.load.image("oxybar", "oxybar.png");
    // load music
    this.load.audio("acqua", "assets/audio/livello-acqua.mp3");
  }
  init() {}
  create() {
    this.pointsgroup = this.add.group({ runChildUpdate: true });
    this.enemygroup = this.add.group({ runChildUpdate: true });
    this.bonusgroup = this.add.group({ runChildUpdate: true });

    switch (this._levelcount) {
      case 0:
        
      this._levelTitle = this.add.bitmapText(this.game.canvas.width / 2, this.game.canvas.height / 2, "arcade", "Livello 1")
      .setOrigin(.5)
      .setScrollFactor(0)
      .setAlpha(0)
      .setDepth(201)

      //creo un tween this._levelTitle che si ripete una volta con dissolvenza e della durata di 1000ms
      this.add.tween({ targets: this._levelTitle, alpha: 1, repeat: 1, yoyo: true, duration: 1000 });


        this._leveldata.level_1.points.forEach((element: { x: any; y: any; key:any}) => {
          console.log(element.x,element.y,element.key);
          this.points = new Points({scene:this,x:element.x,y:element.y,key:element.key}).setScale(0.7);
          this.pointsgroup.add(this.points);
        });

        this._leveldata.level_1.enemy.forEach((element: { x: any; y: any; key:any}) => {
          console.log(element.x,element.y,element.key);
          this.enemy = new Enemy({scene:this,x:element.x,y:element.y,key:element.key}).setScale(1);
          this.enemygroup.add(this.enemy);
        });

        this._leveldata.level_1.bonus.forEach((element: { x: any; y: any; key:any}) => {
          console.log(element.x,element.y,element.key);
          this.bonus = new Bonus({scene:this,x:element.x,y:element.y,key:element.key}).setScale(0.7);
          this.bonusgroup.add(this.bonus);
        });

        this._player = new Hero({
          scene: this, x: this._leveldata.level_1.player.x, y:
          this._leveldata.level_1.player.y, key: "hero"
        }).setScale(1.0);
      
      break;

    }
    
    
    this._player.setAlpha(3).setDepth(200);
    this.pointsgroup.setAlpha(3).setDepth(200);
    this.enemygroup.setAlpha(3).setDepth(200);
    this.bonusgroup.setAlpha(3).setDepth(200);


    this._spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); 

    //this.createMap();
    this._cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(this._player, this.pointsgroup, this.hitPoints,
      undefined, this);
    this.physics.add.collider(this._player, this.enemygroup, this.hitEnemy,
      undefined, this);
    this.physics.add.collider(this._player, this.bonusgroup, this.hitBonus,
      undefined, this);

      this.createMap();
  }

    
  createMap() : void {

    if(this.map != null) this.map.destroy(); // distruggo l'oggetto per poi ricrearlo [leviamo la mappa del livello precedente]
    this.map = this.make.tilemap({key:"ocean"});
    
  
    this.physics.world.setBounds(0,0,this.map.widthInPixels,this.map.heightInPixels);
    this.tileset = this.map.addTilesetImage("b1","oceano")
    
    this._bg = this.add.tileSprite(0,0,this.map.widthInPixels,this.map.heightInPixels,"ocbg").setScrollFactor(1).setOrigin(0,0);
    this._bg2 = this.add.tileSprite(0,0,this.map.widthInPixels,this.map.heightInPixels,"ocbg1").setScrollFactor(1).setOrigin(0,0);

    this.layer = this.map.createLayer("Strutture",this.tileset,0,0)
    .setDepth(100).setAlpha(1);

    this.layer2 = this.map.createLayer("Caverne",this.tileset,0,0)
    .setDepth(101).setAlpha(1);

    this.layer3 = this.map.createLayer("Strutture2",this.tileset,0,0)
    .setDepth(102).setAlpha(1);

    this.layer4 = this.map.createLayer("Strutture3",this.tileset,0,0)
    .setDepth(103).setAlpha(1);

    this.collisione = this.map.createLayer("Collisione",this.tileset,0,0)
    .setDepth(100).setAlpha(0);

    this.collisione.setCollisionByProperty({collide:true});

    this.physics.add.collider(this._player, this.collisione);


    //this.layer2 = this.map.createLayer("collision",this.tileset,0,0)
    //.setDepth(100).setAlpha(0);

    this.cameras.main.setZoom(2);

    this.cameras.main.startFollow(this._player,false)
    
    //this.layer2.setCollisionByProperty({collision:true})
    this.physics.add.collider(this._player,this.layer2)
    this.sound.stopAll();

    this.events.emit("startoxtimer");

    this.sound.play("acqua", {
      volume: 0.5,
      loop: true,
    });

   
  }  


  update(time: number, delta: number) {

    if (Phaser.Input.Keyboard.JustDown(this._spacebar)) {
        
      /* let Arrays = [
              {nome:"Amelia:",dice:"Ciao"},
              {nome:"Giovanni:",dice:"Ciao Amica"},
              {nome:"Luca:",dice:"Ragazzi Come Sta Andando"},
          ]
          //let Arrays : Array<> = ['idle','run','CIAO','AMICO'];
          this._scene.events.emit("visible",Arrays)
      */

          console.log(this._player.x, this._player.y);
      }

    if (this.pointsgroup.getLength() == 0) {
      this.sound.stopAll();
      this.scene.start("Victory");
      this.events.emit("updatereputation",50);
      this.events.emit("stopoxtimer");
    }



    this._player.update(time, delta);


  }
  

  //metodo richiamato quando il PLAYER collide con un BONUS

  hitPoints(player: any, points: any) {
    let _points: Points = <Points>points;
    let _player: Hero = <Hero>player;
    if (_points != null){
        if(_points._config.key=="points_s")
          this.numerop=this.numerop+10
        else if(_points._config.key=="points_m")
          this.numerop=this.numerop+30
        else if(_points._config.key=="points_b")
          this.numerop=this.numerop+50
    } 

    this.events.emit("update-score", [this.numerop]);
    this.numerop=0;
    this.removePoints(_points);
  }

  hitEnemy(player: any, enemy: any) {
    let _enemy: Enemy = <Enemy>enemy;
    let _player: Hero = <Hero>player;
    _player.p=true;
    this.numerop=0;
    this.tweens.add({
      targets: _player, alpha: 0, duration: 150,repeat: 2, yoyo: true,
    });
    this._player.setAlpha(3)
    this.scene.start("GameOver");
  }

  
  hitBonus(player: any, bonus: any) {
    let _bonus: Bonus = <Bonus>bonus;
    let _player: Hero = <Hero>player;
    this.events.emit("addtimeox");
    _player.vel=100;
    this.removeBonus(_bonus);
    this.time.delayedCall(5000, ()=>{

      _player.vel=0;

    }, [], this);
   
  }


  addBonus(bonus: Bonus) {
    this.bonusgroup.add(bonus);
  }

  removeBonus(bonus:  Bonus) {
    this.bonusgroup.remove(bonus, true, true);
  }

  addPoints(points: Points) {

    this.pointsgroup.add(points);
  }

  removePoints(points: Points) {
    this.pointsgroup.remove(points, true, true);
  }

  addEnemy(enemy: Enemy) {
    this.enemygroup.add(enemy);
  }

  removeEnemy(enemy: Enemy) {
    this.enemygroup.remove(enemy, true, true);
  }



}
