export default class GameOver extends Phaser.Scene {

  private _GameOver: Phaser.GameObjects.BitmapText;
  private _intro: Phaser.GameObjects.BitmapText;
  private _restart: Phaser.GameObjects.BitmapText;

  constructor() {
    super({
      key: "GameOver",
    });
  }

  create() {
  

    this._GameOver = this.add
      .bitmapText(640, 65, "arcade", "GAME OVER", 60)
      .setAlpha(1)
      .setOrigin(0)
      .setDepth(1001)
      .setOrigin(0.5).setTint(0x000000);
    
      this._intro = this.add
      .bitmapText(840, 550, "arcade", "Intro")
      .setAlpha(1)
      .setOrigin(0.5)
      .setInteractive()
      .setDepth(100)
      .setTint(0xff8200)

      .on("pointerup", () => {
        this._intro.removeInteractive();
        this.intro();
      })
      .on("pointerover", () => {
        this._intro.setTint(0xff0000);
      })
      .on("pointerout", () => {
        this._intro.setTint(0xff8200);
      });
    
     this._restart = this.add
      .bitmapText(340, 550, "arcade", "Replay")
      .setAlpha(1)
      .setOrigin(0.5)
      .setInteractive()
      .setDepth(100)
      .setTint(0xff8200)
      .on("pointerup", () => {
        this._restart.removeInteractive();
        this.restartGame();
      })
      .on("pointerover", () => {
        this._restart.setTint(0xff0000);
      })
      .on("pointerout", () => {
        this._restart.setTint(0xff8200);
      });

  }

   intro() {
  
      this.scene.stop("GameOver");
      this.scene.start("Intro");
      
   }

   restartGame() {
  
      this.scene.stop("GameOver");
      this.scene.start("GamePlay");
      this.scene.bringToTop("GamePlay");
      this.scene.start("Hud");
      this.scene.bringToTop("Hud");
      this.scene.bringToTop("TimerBar");
      this.scene.bringToTop("ReputationBar");
      this.scene.bringToTop("BatteryBar");
      this.scene.bringToTop("Message");
     
   }
  
  

}
