import "phaser";
import Boot from "./scenes/Boot";
import Preloader from "./scenes/Preloader";
import Intro from "./scenes/Intro";
import Hud from "./scenes/Hud";
import GameOver from "./scenes/GameOver";
import GamePlay from "./scenes/GamePlay";
import LivelloAereo from "./scenes/livelli/LivelloAereo";
import Message from "./scenes/Message";
import { GameData } from "./GameData";
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import Lab from "./scenes/livelli/LivelloMarino";
import LivelloMarino from "./scenes/livelli/LivelloMarino";
import TimerBar from "./scenes/TimeBar";
import ReputationBar from "./scenes/ReputationBar";
import BatteryBar from "./scenes/BatteryBar";
import Victory from "./scenes/Victory";
import Crediti from "./scenes/Crediti";


window.addEventListener("load", () => {
  
  const config: any = {
    type: Phaser.WEBGL,
    backgroundColor: GameData.globals.bgColor,
    parent: "my-game",
    scale: {
      mode: Phaser.Scale.FIT,
      width: GameData.globals.gameWidth,
      height: GameData.globals.gameHeight,
    },

    scene: [
      Boot,
      Preloader,
      Intro,
      Hud,
      GamePlay,
      GameOver,
      Message,
      LivelloMarino,
      TimerBar,
      ReputationBar,
      LivelloAereo,
      BatteryBar,
      Victory,
      Crediti
    ],

    physics: {
      default: "arcade",

    },

    plugins: {
      global: [
          //{key, plugin, start}
      ],
      scene: [
        {
          key: 'rexUI',
          plugin: UIPlugin,
          mapping: 'rexUI'
      },
      ]
  },


    input: {
      activePointers: 2,
      keyboard: true,
      gamepad: true,
    },
    render: {
      pixelArt: true,
      antialias: false,
    },
  };

  const game = new Phaser.Game(config);

  return;
  /*
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js", {
        scope: "/",
      })
      .then(
        function (registration) {
          //console.log("ServiceWorker registration successful with scope: ",registration.scope);
        },
        function (err) {
          //console.log("ServiceWorker registration failed: ", err);
        }
      );
  }
  */
});
