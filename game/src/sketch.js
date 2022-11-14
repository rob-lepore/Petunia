let score = 0;

let groundW;
let groundH;
let groundsCount = 1;
let leftPadding = 30;

let playerSpeed = 2.5;
let playerH = 64;
let playerW = 64;
let jumpSpeed = 0.02

let player;
let backgroundImg;

let obstacles = [];
let bodies = [];

const ATKBUFFERTIME = 300;
let atkBuffer = ATKBUFFERTIME;

let mati = {
  run: [],
  jump: null,
  crouch: null,
  atk: []
};
function preload() {
  mati.run.push(loadImage("src/assets/mati-cam-1.png"));
  mati.run.push(loadImage("src/assets/mati-cam-2.png"));
  mati.jump = loadImage("src/assets/mati-jump.png");
  mati.crouch = loadImage("src/assets/mati-crouch.png")
  mati.atk.push(loadImage("src/assets/mati-atk-1.png"))

  backgroundImg = loadImage("src/assets/sfondo1.png");

}

function setup() {
  createCanvas(innerWidth , 400);
  groundW = 600;
  groundH = 80;
  let newBack = new Body(0, 0, groundW, 400, {texture: backgroundImg});
  bodies.push(newBack)

  let options = {
    texture: mati.run[0],
    runAnimation: mati.run,
    jumpTexture: mati.jump,
    crouchTexture: mati.crouch,
    attackAnimation: mati.atk
  }
  player = new Body(0, groundH, playerW, playerH, options);
  bodies.push(player);


  setInterval(changeSprite, 100);

}

function draw() {
  background(255);

  //image(backgroundImg, 0, 0, width, height)

  player.pos.x += playerSpeed;
  score += playerSpeed;

  if (atkBuffer > 0)
    atkBuffer -= 1;

  push();
  translate(-player.pos.x + leftPadding, height);
  scale(1, -1);

  if (frameCount % 100 == 0 && playerSpeed <= 10)
    playerSpeed += 0.2;


  // check collisions
  let flag = false;
  obstacles.forEach((o) => {
    if (player.collide(o)) {
      //alert("Hai perso");
      //noLoop();
      flag = true;
    }
  });
  if (flag) player.color = color(0, 255, 0);
  else player.color = color(220);
  // //////////////

  if (player.pos.x >= groundW * groundsCount / 2 - groundW * 0.99) {
    expandWorld(0);
    expandWorld(1);
    groundsCount+=2;
    
  }

  bodies.forEach((b) => b.show());

  pop();

  
  fill(0)
  text("Punteggio: " + nf(round(score), 10, 0), 30, 30)

  push();
  rectMode(CENTER)
  textAlign(CENTER, CENTER);
  textSize(32);
  text(location.search.split("=")[1].replace("%20", " "), width / 2, 50);
  pop();

  fill(255, atkBuffer == 0 ? 255 : 0, 0);
  rect(width - 150, 20, map(atkBuffer, 0, ATKBUFFERTIME, 100, 0), 20);

}

function keyPressed() {
  if (key == " " && !player.jumping) {
    handleJump();
  }

  if (key == "s") {
    handleCrouch();
  }

  if (key == "e") {
    handleAttack();
  }
}

function keyReleased() {
  if (key == "s") {
    handleEndCrouch();
  }
}


function expandWorld(i) {
  //let newGround = new Body(groundW * groundsCount, 0, groundW, 30)
  //newGround.invisible = true;
  //bodies.push(newGround);
  let newBack = new Body(groundW * (groundsCount + i), 0, groundW, 400, {texture: backgroundImg});
  bodies.splice(0,0,newBack);
  let o = getRandomObstacles(i);
  bodies.push(o[0], o[1], o[2]);
  obstacles.push(o[0], o[1], o[2]);

  
}

function getRandomObstacles(i) {
  let x1 = groundW * 0.2,
    x2 = groundW * 0.5,
    x3 = groundW * 0.8;
  let obsW = 30;
  let obs1 = [
    new Body(x1 + groundW * (groundsCount+i), groundH, obsW, 40),
    new Body(x1 + groundW * (groundsCount+i), groundH + 40, obsW, 40),
    new Body(x1 + groundW * (groundsCount+i), groundH + 90, obsW, 40),
  ];
  let obs2 = [
    new Body(x2 + groundW * (groundsCount+i), groundH, obsW, 40),
    new Body(x2 + groundW * (groundsCount+i), groundH + 40, obsW, 40),
    new Body(x2 + groundW * (groundsCount+i), groundH + 90, obsW, 40),
  ];
  let obs3 = [
    new Body(x3 + groundW * (groundsCount+i), groundH, obsW, 40),
    new Body(x3 + groundW * (groundsCount+i), groundH + 40, obsW, 40),
    new Body(x3 + groundW * (groundsCount+i), groundH + 90, obsW, 40),
  ];
  return [random(obs1), random(obs2), random(obs3)];
}
