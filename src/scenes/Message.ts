import GamePlay from "./GamePlay";
import Adam from "../gameComponents/adam/Adam";
export default class Message extends Phaser.Scene {

  private _score: number;
  private _gamePlay: GamePlay;
  private _spacebar: Phaser.Input.Keyboard.Key;

  private _testi : Array<{nome:String,dice:String}>;
  private _counter : integer;

  private _scoreText: Phaser.GameObjects.BitmapText;
  private _messText: Phaser.GameObjects.BitmapText;
  private _rectangle: Phaser.GameObjects.Rectangle;

  private _yesButton: Phaser.GameObjects.BitmapText;
  private _noButton: Phaser.GameObjects.BitmapText;
  private _lvl : String;
  constructor() {
    super({
      key: "Message",
    });
  }
  

  preload() {}

  create() {
  
    this._gamePlay = <GamePlay>this.scene.get("GamePlay");
    this._gamePlay.events.off("conversazione", this.showmess, this);
    this._gamePlay.events.on("conversazione", this.showmess, this);

    this._spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );



    this._rectangle = this.add.rectangle(300,400, 700, 150, 0xA57548);
    this._rectangle.setOrigin(0,0);

    this._scoreText = this.add
      .bitmapText(310, 410, "arcade", "Will Smith")
      .setFontSize(15)
      .setTint(0xffffff)
      .setOrigin(0);





    this._messText = this.add
      .bitmapText(310, 440, "arcade", "")
      .setFontSize(11)
      .setTint(0xffffff)
      .setOrigin(0);


    this._yesButton = this.add
      .bitmapText(950, 475, "arcade", "Si")
      .setFontSize(15)
      .setTint(0xffffff)
      .setOrigin(0)
      .setInteractive()
      .on("pointerup", () => {
      
          this.scene.scene.events.emit("finish_Conversation",this._lvl)
          this._rectangle.alpha = 0;
          this._scoreText.alpha = 0;
          this._messText.alpha = 0;
          this._yesButton.alpha = 0;
          this._noButton.alpha = 0;
      }).on("pointerover", () => {
        this._yesButton.setTint(0x000000);
      }).on("pointerout", () => {
        this._yesButton.setTint(0xffffff);
      });


    this._noButton = this.add
      .bitmapText(950, 510, "arcade", "No")
      .setFontSize(15)
      .setTint(0xffffff)
      .setOrigin(0)
      .setInteractive()
      .on("pointerup", () => {
      
        this._rectangle.alpha = 0;
        this._scoreText.alpha = 0;
        this._messText.alpha = 0;
        this._yesButton.alpha = 0;
        this._noButton.alpha = 0;
      })
      .on("pointerover", () => {
        this._noButton.setTint(0x000000);})
      .on("pointerout", () => {
        this._noButton.setTint(0xffffff);
      });

  
      this._scoreText.alpha = 0;
      this._messText.alpha = 0;
      this._rectangle.alpha = 0;
      this._yesButton.alpha = 0;
      this._noButton.alpha = 0;



    this._testi = new Array<{nome:String,dice:String}>();
    
  }

  update() {

    if (Phaser.Input.Keyboard.JustDown(this._spacebar)) {
      
        this._counter++;

        if (this._counter < this._testi.length) {



          this._scoreText.setText(String(this._testi[this._counter].nome));
          this._messText.setText(String(this._testi[this._counter].dice));
        
          if (this._counter == this._testi.length - 1) {
            this._yesButton.alpha = 1;
            this._noButton.alpha = 1;
          }
        
        }


    }
  }

  // questo viene chiamato dal GamePlay quando deve comparire il mes
  private showmess(parameters: Array<{nome:String,dice:String}>,lvl:String): void {

      this._lvl = lvl
      this._testi = parameters;

      this._scoreText.setText(String(this._testi[0].nome));
      this._messText.setText(String(this._testi[0].dice));

      this._rectangle.alpha = 1;
      this._scoreText.alpha = 1;
      this._messText.alpha = 1;

      this._counter = 0;

  }

  private gameOver() {
    
      this.scene.stop("Hud");
      this.scene.stop("GamePlay");
      this.scene.start("GameOver");
     
  }
}
