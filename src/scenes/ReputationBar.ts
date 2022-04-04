
import { Scene, Display } from "phaser";
import GamePlay from "./GamePlay";
import LivelloMarino from "./livelli/LivelloMarino";
import GameOver from "./GameOver";
import LivelloAereo from "./livelli/LivelloAereo";
export default class ReputationBar extends Phaser.Scene {

    private timeLeft: number;
    private timeMask: Phaser.GameObjects.Sprite;
    private gameTimer: Phaser.Time.TimerEvent;
    private timerContainer: Phaser.GameObjects.Sprite;
    private timeBar: Phaser.GameObjects.Sprite;
    private _LivelloMarino: LivelloMarino;
    private _Gameplay: GamePlay;
    private _Gameover: GameOver;
    private _working = false;
    private _reptext: Phaser.GameObjects.BitmapText;
    private _energyBar: Phaser.GameObjects.Sprite;
    private _energyContainer: Phaser.GameObjects.Sprite;
    private _Aereo: LivelloAereo;
  constructor() {
    super({
        key: "ReputationBar",
      });
  }
  preload() {
    this.load.image(
      "repbar",
      "repbar.png"
    );
    this.load.image("energybar", "energybar.png");
  }
  create() {
    this.timeLeft = 10;

    this._Aereo = <LivelloAereo>this.scene.get("LivelloAereo");
    this._Aereo.events.off("updatereputation", this.addTime, this);
    this._Aereo.events.on("updatereputation", this.addTime, this);


    this._LivelloMarino = <LivelloMarino>this.scene.get("LivelloMarino");

    this._LivelloMarino.events.off("updatereputation", this.addTime, this);
    this._LivelloMarino.events.on("updatereputation", this.addTime, this);

    this._Gameplay = <GamePlay>this.scene.get("GamePlay");

    this._Gameplay.events.off("updatereputation", this.addTime, this);
    this._Gameplay.events.on("updatereputation", this.addTime, this);



 
    // the energy container. A simple sprite
    //@ts-ignore
    this._energyContainer = this.add.sprite(this.game.config.width / 2  + 460 , this.game.config.height / 2 - 270, "repbar").setScale(0.5).setAlpha(1);

    // the energy bar. Another simple sprite
     this._energyBar = this.add.sprite(this._energyContainer.x + 23, this._energyContainer.y, "energybar").setScale(0.5).setAlpha(1);

    // a copy of the energy bar to be used as a mask. Another simple sprite but...
    this.timeMask = this.add.sprite(this._energyBar.x, this._energyBar.y, "energybar").setScale(0.5).setAlpha(1);

    // ...it's not visible...
    this.timeMask.visible = false;

    // and we assign it as energyBar's mask.
    this._energyBar.mask = new Phaser.Display.Masks.BitmapMask(this, this.timeMask);

    let stepWidth = this.timeMask.displayWidth / 60;

    // moving the mask
        //@ts-ignore
    this.timeMask.x += stepWidth - 250;

      //@ts-ignore
    this._reptext = this.add
          //@ts-ignore
    .bitmapText(this.game.config.width / 2  + 380 , this.game.config.height / 2 -277, "arcade", "Reputazione")
    .setFontSize(12)
    .setTint(0xffffff)
    .setOrigin(0);


}

    addTime(valore:integer): void {
        console.log("addTime");
        this.timeLeft += valore;
        let stepWidth = this.timeMask.displayWidth / 60;
        // moving the mask
            //@ts-ignore
        this.timeMask.x += stepWidth * valore;
        console.log(this.timeMask.x);
        if (this.timeMask.x > 1125) {
          console.log("Gioco Finto..");
          this.scene.start("Crediti");
        }
    }

    update(time: number, delta: number): void {

    }
}

