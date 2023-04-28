
import Plane from "../../gameComponents/Aereo/plane/Plane";
import Water from "../../gameComponents/Aereo/water/Water";
import Tree from "../../gameComponents/Aereo/tree/Tree";
import Bird from "../../gameComponents/Aereo/bird/Bird";
import Energy from "../../gameComponents/Aereo/energy/Energy";
import { Bounds } from "matter";
import { Scene } from "phaser";


export default class LivelloAereo extends Phaser.Scene {

  private _sfx: Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
  private _logo: Phaser.GameObjects.Image;

  private _previousX: number = 0;
  private _rndX: number;

  private _plane: Plane;
  private _water: Water;
  private _tree: Tree;
  private _bird: Bird;

  private _timeLeft: number;  
  private _energyMask: Phaser.GameObjects.Sprite;
  private _gameTimer: Phaser.Time.TimerEvent;
  private _energyContainer: Phaser.GameObjects.Sprite;
  private _energyBar: Phaser.GameObjects.Sprite;


  private _zTree: number = 100;

  // ---- LEVEL COUNTER -----
  private _level: number = 0;
  private _levelTitle: Phaser.GameObjects.BitmapText;
  private _score: number = 0;

  // ---- GROUP ----
  private _treeGroup: Phaser.GameObjects.Group;
  private _birdGroup: Phaser.GameObjects.Group;
  private _waterGroup: Phaser.GameObjects.Group;
  private _energyGroup: Phaser.GameObjects.Group;

  // ---- BACKGROUND ----
  private _bg: Phaser.GameObjects.TileSprite;
  private map: Phaser.Tilemaps.Tilemap;
  private tileset : Phaser.Tilemaps.Tileset;
  private layer: Phaser.Tilemaps.TilemapLayer;
  private layer2: Phaser.Tilemaps.TilemapLayer;
  private layer3: Phaser.Tilemaps.TilemapLayer;

  constructor() {
    super({ key: "LivelloAereo" });
  }

  preload() {
    this._energyContainer = this.add.sprite(50, 50, "batterycontainer", "batterycontainer.png").setAngle(90);
    this._energyBar = this.add.sprite(this._energyContainer.x * 46, this._energyContainer.y, "batterybar", "batterybar.png").setAngle(90);
    this.load.audio("aria", "assets/audio/livello-aereo.mp3");
  }
  create() {

    this._treeGroup = this.add.group({ runChildUpdate: true });
    this._birdGroup = this.add.group({ runChildUpdate: true });
    this._waterGroup = this.add.group({ runChildUpdate: true });
    this._energyGroup = this.add.group({ runChildUpdate: true });
  
    this._bg = this.add.tileSprite(0, 0, 1024, 600, "bg-forest").setOrigin(0).setScrollFactor(0).setScale(1.5);

    // ---- creazione PLANE ----
    this._plane = new Plane({
      scene: this, x: this.game.canvas.width/2, y: 400, key: "plane"
    });
    this._plane
      .setAlpha(3)
      .setDepth(300);

    //this.createTimeLine();

    this.nextLevel();

    this.events.emit("startbttimer");


    this.createCollision(); 
    this.sound.stopAll();
    this.load.audio("aria", "assets/audio/livello-aereo.mp3");
  }

    
  createCollision() : void {
    //collisione PLANE-BIRD
    this.physics.add.collider(this._plane, this._birdGroup, this.hitPlaneBird, undefined, this);
    //collisione PLANE-BIRD
    this.physics.add.collider(this._plane, this._energyGroup, this.hitPlaneEnergy, undefined, this);
    //collisione WATER-TREE
    this.physics.add.collider(this._waterGroup, this._treeGroup, this.hitWaterTree, undefined, this);
    //collisione TREE-BORDO INFERIORE
  }  

  /*
  createTimeLine () {

    let game;
    let gameOptions = {
      initialTime: 60
    }

    this._timeLeft = gameOptions.initialTime;
 
        // the energy container. A simple sprite
        let _energyContainer = this.add.sprite( this.game.canvas.width / 2, this.game.canvas.height / 2, "energycontainer");
 
        // the energy bar. Another simple sprite
        let _energyBar = this.add.sprite(_energyContainer.x + 46, _energyContainer.y, "energybar");
 
        // a copy of the energy bar to be used as a mask. Another simple sprite but...
        this._energyMask = this.add.sprite(_energyBar.x, _energyBar.y, "energybar");
 
        // ...it's not visible...
        this._energyMask.visible = false;
 
        // and we assign it as energyBar's mask.
        _energyBar.mask = new Phaser.Display.Masks.BitmapMask(this, this._energyMask);
 
        // a boring timer.
        this._gameTimer = this.time.addEvent({
          delay: 1000,
          callback: function(){
            //@ts-ignore
              this._timeLeft --;

              // dividing enery bar width by the number of seconds gives us the amount
              // of pixels we need to move the energy bar each second
              let stepWidth = this._energyMask.displayWidth / gameOptions.initialTime;  

              // moving the mask
              this._energyMask.x -= stepWidth;
              if(this._timeLeft == 0){
                  this.scene.start("GameOver")
              }
          },
          callbackScope: this,
          loop: true
      });
  }*/

  hitPlaneBird(plane: any, bird: any) {
    if (plane.getActivity()) { //è attivo
      this._score -= 10;
      this.events.emit("decrease-score", [10]);
      plane.setActivity(); //lo disattivo
      bird.anims.play("bird-goaway");
      //this.events.emit("decrease-live");
      //tween per la scomparsa
      this.tweens.add({
        targets: plane, alpha: 0, duration: 1000, yoyo: true, onComplete: () => {
          //al completamento del tween rimuovo il bonus dalla scena
          plane.setActivity();//dopo 1 secondi ridiventa attivo
        }
      })
      bird.setAccelerationX(100); 
      this.time.delayedCall(1000, ()=>{

        bird.setAccelerationX(0);
      }, [], this); 
    }
  }

  hitWaterTree(water: any, tree: any) {
    if(water._isActive) {
      tree.anims.play("tree-burnt");
      this._score += 20;
      this.removeWater(water);
      this.removeTree(tree);
      this.events.emit("update-score", [20])
    }
  }

  hitPlaneEnergy(plane: any, energy: any) {
    //this.events.emit("increase-time");
    this.events.emit("addtimebt");
    this.removeEnergy(energy);
  }

  addTree(tree: Tree) {
    this._treeGroup.add(tree);
  }
  removeTree(tree: Tree) {
    this._treeGroup.remove(tree, false, false);
  }
  
  addEnergy(energy: Energy) {
    this._energyGroup.add(energy);
  }
  removeEnergy(energy: Energy) {
    this._energyGroup.remove(energy, true, true);
  }

  addBird(bird: Bird) {
    this._birdGroup.add(bird);
  }
  removeBird(bird: Bird) {
    this._birdGroup.remove(bird, true, true);
  }

  addWater(water: Water) {
    this._waterGroup.add(water);
  }
  removeWater(water: Water) {
    this._waterGroup.remove(water, true, true);
  }

  nextLevel() {
    this._level++;

    if (this._level == 4) {
      this.sound.stopAll();
      this.scene.start("Victory");
      this.events.emit("updatereputation",50);
      this.events.emit("stopbttimer");
    }
    
    // ---- STAMPA DEL LIVELLO CORRENTE ----
    this._levelTitle = this.add.bitmapText(this.game.canvas.width / 2, this.game.canvas.height / 2, "arcade", "Level "+ this._level)
      .setOrigin(.5)
      .setScrollFactor(0)
      .setAlpha(0)
      .setDepth(310);

    //creo un tween this._levelTitle che si ripete una volta con dissolvenza e della durata di 1000ms
    this.add.tween({
      targets: this._levelTitle,
      alpha: 1,
      repeat: 1,
      yoyo: true,
      duration: 1000,
      onComplete: () => {
        this._levelTitle = this.add.bitmapText(this.game.canvas.width / 2, this.game.canvas.height / 2, "arcade", "Raggiungi i "+ this._level * 200 + " punti")
          .setOrigin(.5)
          .setScrollFactor(0)
          .setAlpha(0)
          .setDepth(310);
        this.add.tween({
          targets: this._levelTitle,
          alpha: 1,
          repeat: 1,
          yoyo: true,
          duration: 1000
        })
      }
    });
  }

  checkLevel() {
    console.log("Controllo");
    if( this._score >= this._level *200){
      console.log("SO entrato");
      this.nextLevel();
    }
  }
  

  spawnLogic() {
    
    do{
      this._rndX = Phaser.Math.RND.integerInRange(350, 930);
    }while( this._rndX >= (this._previousX-20)  &&  this._rndX <= (this._previousX+20));

    this._previousX = this._rndX;

    // produco un valore random tra 0 e 100 PER LA SCELTA DELL'ELEMENTO DA GENERARE
    const _rndElement: number = Phaser.Math.RND.integerInRange(0, 100);
    
    // se il valore è minore di 60 genero un Tree
    if ( _rndElement < 75 ) {
      //creo elemento di tipo Tree

      new Tree({ scene: this, x: this._rndX, y: -30, key: "tree" }).setDepth(this._zTree);
      this._zTree -= 1;
    }
    // se il valore è tra 75 e 90 genero un elemento di tipo Bird
    else if ( _rndElement >= 75 && _rndElement < 90 ) {
      //creo un elemento di tipo Bird
      new Bird({ scene: this, x: this._rndX, y: -30, key: "bird" });
    }
    else if ( _rndElement >= 90 && _rndElement <= 95 ) {
      //creo un bonus di tipo chiave
      new Energy({ scene: this, x: this._rndX, y: -30, key: "energy" });
    }
    //this._previousX = _rndX;

  }

  update(time: number, delta: number) {

    this.checkLevel();

    this._bg.tilePositionY -= 1.1;

    this._plane.update(time, delta);

    if( time % 3 !== 0 && time % 5 === 0 ) { // && this._level == 1
      this.spawnLogic();
    }

    //SE THIS._LEVEL === 3 E 3 ALBERI TOCCANO TERRA ALLORA GAMEOVER()
    if ( this._level === 3)
    this._treeGroup.children.each(function (tree) {
      if(tree.body.position.y > 600) {
        console.log("Vittori");
        //@ts-ignore
        this.scene.start("GameOverAereo");
      }
    }, this);
  }


}
