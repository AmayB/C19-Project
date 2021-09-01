var PLAY = 1;
var END = 0;
var gamestate = PLAY;
var bird, birdFlying;
var ground, groundImage;
var pipeGroup, pipe1Group, pipe1, pipe2;
var score = 0;
var gameover;
var backgroundImage, background1;
var restart;
var gameover;
var invisWall;
var scoreBlockGroup;
//sound doesnt work

function preload(){
    birdFlying = loadAnimation("yellowbird-downflap.png","yellowbird-midflap.png","yellowbird-midflap.png","yellowbird-upflap.png");
    groundImage = loadImage("base.png");
    wingSound = loadSound("wing.wav")
    backgroundImage = loadImage("background-day1.png");
    pipe1 = loadImage ("pipe-green.png");
    pipe2 = loadImage ("pipe-green-upsidedon.png");
    restartImage = loadImage ("flappyBirdPlayButton.png");
    gameoverImage = loadImage("gameover.png")
}

function setup() {
    createCanvas(380,400)

    background1 = createSprite(180, 10);
    background1.addImage(backgroundImage);
    background1.scale = 1;

    ground = createSprite(200, 400, 400, 20);
    ground.addImage("ground", groundImage);
    ground.x = ground.width / 4;
    ground.scale = 1.5;

    bird = createSprite(100,200);
    bird.addAnimation("flying", birdFlying);
    bird.scale = 1;

    restart = createSprite(190,220);
    restart.addImage(restartImage);
    restart.scale = 0.5;

    gameover = createSprite(190,160);
    gameover.addImage(gameoverImage);
    gameover.scale = 1;

    invisWall = createSprite(200,0,400,10)
    invisWall.visible = false;

    pipeGroup = new Group();
    pipe1Group = new Group();
    scoreBlockGroup = new Group();

    score = 0;
}

function draw() {
    background("white");

    if (gamestate === PLAY) {
        if (scoreBlockGroup.isTouching(bird)) {
          score = score + 1;
        }

        ground.velocityX = -(6 + 0.5 * score / 10);
        background1.velocityX = -(6 + 0.5 * score / 10);

        gameover.visible = false;
        restart.visible = false;
    
        if (keyDown("space")&& bird.y >= 100 ) {
          bird.velocityY = -6;
        }
    
        bird.velocityY = bird.velocityY + 0.4;

        if (background1.x < 0) {
            background1.x = background1.width / 2;
          } 
    
        if (ground.x < 130) {
          ground.x = ground.width / 2;
        } 

        spawnPipes();
        spawnUpsideDownPipes();
        spawnScoreBlocks();

        bird.collide(ground);

        if (pipe1Group.isTouching(bird)||pipeGroup.isTouching(bird)||invisWall.isTouching(bird)) {
            gamestate = END;
        }
    }
    else if (gamestate === END) {
        gameover.visible = true;
        restart.visible = true;
    
        bird.velocityY = 0;
        ground.velocityX = 0;
        background1.velocityX = 0;
    
        pipe1Group.setVelocityXEach(0);
        pipeGroup.setVelocityXEach(0);
        scoreBlockGroup.setVelocityXEach(0);
    
        pipe1Group.setLifetimeEach(-1);
        pipeGroup.setLifetimeEach(-1);
        scoreBlockGroup.setLifetimeEach(-1);

        if (mousePressedOver(restart)) {
          reset();
        }
      }
    
    
    drawSprites();
}

function spawnPipes() {
    if (frameCount % 60 === 0) {
      var pipe = createSprite(600, 300, 10, 40);
      pipe.velocityX = -(6 + 0.5 * score / 10);
      var rand = Math.round(random(1,1));
      pipe.y = Math.round(random(270, 300));
      switch (rand) {
        case 1: pipe.addImage(pipe1);
          break;
        default: break;
      }
      pipe.scale = 0.7;
      pipe.lifetime = 300;
      pipeGroup.add(pipe);
      pipe.depth = ground.depth;
      ground.depth = ground.depth + 1;
    }
}

function reset() {
    gamestate = PLAY;
    pipeGroup.destroyEach();
    pipe1Group.destroyEach();
    scoreBlockGroup.destroyEach();
    score = 0;
  }

function spawnUpsideDownPipes() {
    if (frameCount % 60 === 0) {
      var pipe1 = createSprite(600, 0, 10, 40);
      pipe1.velocityX = -(6 + 0.5 * score / 10);
      pipe1.y = Math.round(random(0, -30));
      var rand = Math.round(random(1,1));
      switch (rand) {
        case 1: pipe1.addImage(pipe2);
          break;
        default: break;
      }
      pipe1.scale = 0.7;
      pipe1.lifetime = 300;
      pipe1Group.add(pipe1);
    }
}

function spawnScoreBlocks() {
    if (frameCount % 60 === 0) {
      var scoreBlock = createSprite(600, 200, 10, 1000);
      scoreBlock.velocityX = -(6 + 0.5 * score / 10);
      scoreBlock.scale = 0.7;
      scoreBlock.lifetime = 300;
      scoreBlockGroup.add(scoreBlock);
      scoreBlock.visible = false;
    }
}