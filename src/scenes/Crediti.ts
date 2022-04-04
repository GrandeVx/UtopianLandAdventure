export default class Crediti extends Phaser.Scene {

  private _Crediti: Phaser.GameObjects.Image;
  private _next: Phaser.GameObjects.BitmapText;
  private _next1: Phaser.GameObjects.BitmapText;
  private _bg:Phaser.GameObjects.TileSprite;;


  constructor() {
    super({
      key: "Crediti",
    });
  }

  create() {
  
    this._bg = this.add.tileSprite(this.game.canvas.width / 2, this.game.canvas.height / 2 , 1280, 600, "crediti").setOrigin(0.5).setScale(1).setAlpha(1);
    
  }
   intro() {
  
      this.scene.stop("Crediti");
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
      this.scene.bringToTop("Message");
     
   }
  
  

}
