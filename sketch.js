// Estado do jogo
var gameState;

// Torre e fundo
var tower, towerImg;

// Portas e obstáculos
var door, doorImg, doorsGroup;
var climber, climberImg, climbersGroup;
var invisibleBlock, invisibleBlockGroup;

// Fantasma
var ghost, ghostImg;

// Sons do jogo
var spookySound;

function preload() {
  // Carrega as imagens
  towerImg = loadImage("tower.png");
  doorImg = loadImage("door.png");
  climberImg = loadImage("climber.png");
  ghostImg = loadImage("ghost-standing.png");

  // Carrega o som de fundo
  spookySound = loadSound("spooky.wav");
}

function setup() {
  createCanvas(600, 600);

  // Toca o som de fundo em loop
  spookySound.loop();

  // Cria a torre
  tower = createSprite(300, 300);
  tower.addImage("tower", towerImg);
  tower.velocityY = 1;

  // Cria o fantasma
  ghost = createSprite(200, 200, 50, 50);
  ghost.scale = 0.3;
  ghost.addImage("ghost", ghostImg);

  // Inicializa os grupos de portas e obstáculos
  doorsGroup = new Group();
  climbersGroup = new Group();
  invisibleBlockGroup = new Group();

  // Estado de jogo
  gameState= "PLAY";
}

function draw() {
  background(0);

    // Desenha os sprites na tela  
    drawSprites();

  // Chama a função PLAY se o estado do jogo for "PLAY"
  if (gameState == "PLAY") {
    PLAY();
  }

  // Chama a função END se o estado do jogo for "END"
  if (gameState == "END") { 
    END(); 
  }
   

}

function PLAY() {
  // Atualizando o cenário
    if (tower.y > 400) {
      tower.y = 300;
    }

  // Movimentação para a esquerda
      if (keyDown("left_arrow")) {
        ghost.x = ghost.x - 3;
      }
  
      // Movimentação para a direita
      if (keyDown("right_arrow")) {
        ghost.x = ghost.x + 3;
      }
  
      // Pulo
      if (keyDown("space")) {
        ghost.velocityY = -10;
      }  
  
      // Aplica gravidade ao fantasma
      ghost.velocityY = ghost.velocityY + 0.8;
  
      // Verifica colisões
      if (climbersGroup.isTouching(ghost)) {
        ghost.velocityY = 0;
      }
  
      // Fim de jogo se o fantasma cair ou colidir com um bloco invisível
      if (invisibleBlockGroup.isTouching(ghost) || ghost.y > 600) {
        gameState = "END";
      }
  
      // Gera as portas e obstáculos
      spawnDoors();
  }
  

  function END() {
    // Deixando o fantasma invisivel
      ghost.visible= false;

    //Criando o texto de fim de jogo
        stroke("yellow");
        fill("yellow");
        textSize(30);
        text("Fim de Jogo, pressione R para reiniciar", 30,250)
    
    // Reinicia o jogo quando o botão de restart é pressionado
      if (keyDown("r")) {
        reset();
      }
    }
    
    function spawnDoors() {
      if (frameCount % 240 === 0) {
        // Cria uma porta, um escalador e um bloco invisível
        var door = createSprite(200, -50);
        var climber = createSprite(200, 10);
        var invisibleBlock = createSprite(200, 15,100  ,20);
        invisibleBlock.visible= false
        // Configura os sprites
        door.x = Math.round(random(120, 400));
        climber.x = door.x;
        invisibleBlock.x = door.x;
    
        // Adiciona as imagens
        door.addImage(doorImg);
        climber.addImage(climberImg);  
    
        // Define a velocidade
        door.velocityY = 1;
        climber.velocityY = 1;
        invisibleBlock.velocityY = 1;
    
        //Definindo camanda do fantasma 
        ghost.depth = door.depth;
        ghost.depth +=1;

        // Define o tempo de vida
        door.lifetime = 800;
        climber.lifetime = 800;
        invisibleBlock.lifetime = 800;
    
        // Adiciona aos grupos
        doorsGroup.add(door);
        climbersGroup.add(climber);
        invisibleBlockGroup.add(invisibleBlock);

        //colidindo com a climber
        ghost.collide(climbersGroup)
      }
    }
    
function reset() {
  // Deixando o fantasma visivel
  ghost.visible= true;

  // Reseta o estado do jogo para "PLAY"
  gameState = "PLAY";

  // Reposiciona o fantasma
  ghost.x = 200;
  ghost.y = 200;
  ghost.velocityY = 0;

  // Reposiciona a torre
  tower.y = 300;

  // Destroi todos os obstáculos
  climbersGroup.destroyEach();
  invisibleBlockGroup.destroyEach();
  doorsGroup.destroyEach();

  // Reinicia o som
  spookySound.stop();
  spookySound.loop();

}
