
import { Scene, Display } from "phaser";
import GamePlay from "./GamePlay";
import LivelloMarino from "./livelli/LivelloMarino";
import LivelloAereo from "./livelli/LivelloAereo";
export default class BatteryBar extends Phaser.Scene {

    private timeLeft: number;
    private timeMask: Phaser.GameObjects.Sprite;
    private gameTimer: Phaser.Time.TimerEvent;
    private timerContainer: Phaser.GameObjects.Sprite;
    private timeBar: Phaser.GameObjects.Sprite;
    private _LivelloMarino: LivelloMarino;
    private _LivelloAereo: LivelloAereo;
    private _working = false;

    private _energyBar: Phaser.GameObjects.Sprite;
    private _energyContainer: Phaser.GameObjects.Sprite;

  constructor() {
    super({
        key: "BatteryBar",
      });
  }
  preload() {
    this.load.image(
      "batterybar",
      "batterycontainer.png"
    );
    this.load.image("energybar", "energybar.png");
  }
  create() {
    this.timeLeft = 60;

    this._LivelloMarino = <LivelloMarino>this.scene.get("LivelloMarino");
    this._LivelloAereo = <LivelloAereo>this.scene.get("LivelloAereo");
   
    this._LivelloMarino.events.off("addtimebt", this.addTime, this);
    this._LivelloMarino.events.on("addtimebt", this.addTime, this);

    this._LivelloMarino.events.off("startbttimer", this.startoxtimer, this);
    this._LivelloMarino.events.on("startbttimer", this.startoxtimer, this);

    this._LivelloMarino.events.off("stopbttimer", this.stopoxtimer, this);
    this._LivelloMarino.events.on("stopbttimer", this.stopoxtimer, this);
 
    this._LivelloAereo.events.off("addtimebt", this.addTime, this);
    this._LivelloAereo.events.on("addtimebt", this.addTime, this);

    this._LivelloAereo.events.off("startbttimer", this.startoxtimer, this);
    this._LivelloAereo.events.on("startbttimer", this.startoxtimer, this);

    this._LivelloAereo.events.off("stopbttimer", this.stopoxtimer, this);
    this._LivelloAereo.events.on("stopbttimer", this.stopoxtimer, this);
 


    // the energy container. A simple sprite
    //@ts-ignore
    this._energyContainer = this.add.sprite(this.game.config.width / 2  + 410 , this.game.config.height / 2 + 240, "batterybar").setScale(0.5).setAlpha(0);

    // the energy bar. Another simple sprite
     this._energyBar = this.add.sprite(this._energyContainer.x + 23, this._energyContainer.y, "energybar").setScale(0.5).setAlpha(0);

    // a copy of the energy bar to be used as a mask. Another simple sprite but...
    this.timeMask = this.add.sprite(this._energyBar.x, this._energyBar.y, "energybar").setScale(0.5).setAlpha(0);

    // ...it's not visible...
    this.timeMask.visible = false;

    // and we assign it as energyBar's mask.
    this._energyBar.mask = new Phaser.Display.Masks.BitmapMask(this, this.timeMask);

    // a boring timer.
    this.gameTimer = this.time.addEvent({
        delay: 1000,
        callback: function(){
            //@ts-ignore
            if (this._working) {
            //@ts-ignore
            this.timeLeft --;
            
          //@ts-ignore
        if (this.timeLeft == 0)   this.scene.start("GameOver");

            // dividing enery bar width by the number of seconds gives us the amount
            // of pixels we need to move the energy bar each second
               //@ts-ignore
            let stepWidth = this.timeMask.displayWidth / 60;

            // moving the mask
               //@ts-ignore
            this.timeMask.x -= stepWidth;
               //@ts-ignore
            if(this.timeLeft == 0){
                   //@ts-ignore
                this.timeLeft = 60;
                    //@ts-ignore
                this.scene.start("GameOver");

            }
            }

        },
        callbackScope: this,
        loop: true
    });
}
    startoxtimer(): void {
        console.log("startoxtimer");
        this._working = true;
        this._energyContainer.setAlpha(1);
        this._energyBar.setAlpha(1);
        this.timeMask.setAlpha(1);
    }

    stopoxtimer(): void {
        this._working = false;
        this._energyContainer.setAlpha(0);
        this._energyBar.setAlpha(0);
        this.timeMask.setAlpha(0);
    }

    addTime(): void {
        this.timeLeft += 5;

        let stepWidth = this.timeMask.displayWidth / 60;

        // moving the mask
            //@ts-ignore
        this.timeMask.x += stepWidth * 5;
    }

    update(time: number, delta: number): void {

    }
}

