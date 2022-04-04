
/*

  Qualsiasi impostazione / asset..  che influisce col gioco deve passare da qui.

*/


export let GameData: any = {
  globals: {
    leaderboard: false,
    gameWidth: 1280,
    gameHeight: 600,
    bgColor: "#ffffff",
    debug: true,
  },

  preloader: {
    bgColor: "",
    image: "logo",
    imageX: 640,
    imageY: 300,
    loadingText: "",
  },

  tilemaps : [
    {
      key:"city",
      path:"assets/map/city.json"
    },
    {
      key:"ocean",
      path:"assets/map/ocean.json"
    },
  ],

  spritesheets: [
    // Ogni Elemento "Animato" va definito qui.    
    {
      name: "plane",
      path: "assets/images/plane.png",
      width: 116,
      height: 116,
      frames: 8
    },
    {
      name: "amelia",
      path: "assets/images/amelia.png",
      width: 16,
      height: 32,
      frames: 4,
    },

    {
      name: "adam",
      path: "assets/images/adam.png",
      width: 16,
      height: 32,
      frames: 4,
    },

    {
      name: "marco",
      path: "assets/images/marco.png",
      width: 16,
      height: 32,
      frames: 4,
    },

    {
      name: "marco_run",
      path: "assets/images/marco_run.png",
      width: 16,
      height: 32,
      frames: 24,
    },

    {
      name: "amelia_run",
      path: "assets/images/amelia_run.png",
      width: 16,
      height: 32,
      frames: 24,
    },

    {
      name: "adam_run",
      path: "assets/images/adam_run.png",
      width: 16,
      height: 32,
      frames: 24,
    },

    {
      name: "map",
      path: "assets/map/Modern_Exteriors_Complete_Tileset.png",
      width: 32,
      height: 32
    },

    {
      name: "oceano",
      path: "assets/map/Oceano.png",
      width: 32,
      height: 32
    },
    {
      name: "car",
      path: "assets/images/car.png",
      width: 28,
      height: 30,
      frames: 4
    },

    {
      name: "hero",
      path: "assets/images/an.png",
      width: 44,
      height: 53,
      frames: 12
    }, 
    {
      name: "enemy",
      path: "assets/images/pesce.png",
      width: 52,
      height: 48,
      frames: 4
    },
    {
      name: "points_s",
      path: "assets/images/busta.png",
      width: 128,
      height: 128,
      frames: 1
    },    {
      name: "points_m",
      path: "assets/images/bibita.png",
      width: 128,
      height: 128,
      frames: 1
    },    {
      name: "points_b",
      path: "assets/images/mascherina.png",
      width: 128,
      height: 128,
      frames: 1
    },
     {
      name: "bonus",
      path: "assets/images/bonus_bubble.png",
      width: 128,
      height: 128,
      frames: 1
    },
    {
      name: "water",
      path: "assets/images/water.png",
      width: 70,
      height: 100,
      frames: 5
    }, 
    {
      name: "tree",
      path: "assets/images/tree.png",
      width: 80,
      height: 100,
      frames: 8
    },
    {
      name: "bird",
      path: "assets/images/gabbiano.png",
      width: 130,
      height: 83,
      frames: 3
    },
    {
      name: "energy",
      path: "assets/images/battery.png",
      width: 180,
      height: 140,
      frames: 2
    },


  ],

  images: [
    // Ogni Immagine (Non animata) va definita qui.
    { name: "logo", path: "assets/images/logo.png" },
    { name: "ocbg", path: "assets/images/ocbg.png" },
    { name: "ocbg1", path: "assets/images/ocbg1.png" },
    { name: "oxybar", path: "assets/images/oxybar.png" },
    { name: "energybar", path: "assets/images/energybar.png" },
    { name: "repbar", path: "assets/images/repbar.png" },
    { name: "title", path: "assets/images/title.png" },
    { name: "bg-intro", path: "assets/images/bg.png" },
    { name: "start", path: "assets/images/start.png" },
    { name: "credits", path: "assets/images/credits.png" },
    { name: "gameover", path: "assets/images/gameover.png" },
    { name: "ok", path: "assets/images/OK.mov" },
    { name: "bg-forest", path:"assets/images/forest.png"},
    { name: "batterybar", path:"assets/images/batterycontainer.png"},
    { name: "bg-victory", path: "assets/images/complete.png" },
    { name: "lcomplete", path: "assets/images/lcomplete.png" },
    { name: "continue", path: "assets/images/continue.png" },
    { name: "exit", path: "assets/images/exit.png" },
    { name: "crediti", path: "assets/images/crediti_1.png" },





  ],

  atlas: [
    
  ],

 
  sounds: [
      {
      name: "music0",
      paths: ["assets/sounds/music0.ogg", "assets/sounds/music0.m4a"],
      volume: 1,
      loop: false,
      frame: 1,
    },
    {
      name: "lobby",
      paths: ["assets/sounds/lobby.mp3"],
      volume: 1,
      loop: true,
      frame: 1,
    },
    {
      name: "acqua",
      paths: ["assets/sounds/livello-acqua.mp3"],
      volume: 1,
      loop: true,
      frame: 1,
    },
    {
      name: "aria",
      paths: ["assets/sounds/livello-aereo.mp3"],
      volume: 1,
      loop: true,
      frame: 1,
    },
  ],
  audio: [
    {
      name: "sfx",
      jsonpath: "assets/sounds/sfx.json",
      paths: ["assets/sounds/sfx.ogg", "assets/sounds/sfx.m4a"],
      instances: 10,
    },
  ],

  script: [
    {
      key: "webfont",
      path: "assets/js/webfonts.js",
    },
  ],

  bitmapfont: [
    // Ogni BitmapFont (Font "particolari" :) ) va definito qui.
    {
      name: "arcade",
      imgpath: "assets/fonts/arcade.png",
      xmlpath: "assets/fonts/arcade.xml",
    }
  ],
};
