window.onload = function() {
		/*Global*/iniciou = false;
	};
function botaoReset() {
	if(iniciou == false) {
		document.getElementById("content").removeChild(document.getElementById("cover"));
		jogoArea.iniciar();
		document.getElementById("btReset").blur();
		document.getElementById("btReset").style = "display: none;"
		/* Global */ shootSound = new Sound();
		shootSound.setSound("sounds/shoot.wav");
		/* Global */ alienMoveSound = new Sound();
		alienMoveSound.setSound("sounds/fastinvader1.wav");
		/* Global */ explosionSound = new Sound();
		explosionSound.setSound("sounds/explosion.wav");
		/* Global */ alienDeathSound = new Sound();
		alienDeathSound.setSound("sounds/invaderkilled.wav");
		
		/* Global */ atualScore = new Score();
		atualScore.construir(0, 30, "#FFF", "#FFF", 1.0, "25px OCR A Extended", "SC " + atualScore.getScoreText());
		/* Global */ highScore = new Score();
		highScore.construir(100, 30, "#FFD700", "#FFD700", 1.0, "25px OCR A Extended", "HI " + highScore.getScoreText());
		/* Global */ gameOverBox = new Box();
		gameOverBox.construir(jogoArea.width/2-200 , jogoArea.height/2-110, 400, 220, "#000", "#FFD700", 2.0);
	}
	else if(gameOver){
		jogoArea.parar();
		jogoArea.iniciar();
		document.getElementById("btReset").blur();
		document.getElementById("btReset").style = "display: none;"
		atualScore.zerar();
	}
	iniciou = true;
}

function atualizarJogoArea() { // intervalo de atualizar a área
	jogoArea.atualizar();
	limitEsq.desenhar();
	limitDir.desenhar();
	atualScore.setString("SC " + atualScore.getScoreText());
	atualScore.escrever();
	highScore.escrever();
	if(existe(nave)) {
		nave.setSpeedX(0);
		if(jogoArea.teclas && jogoArea.teclas[37])
			nave.setSpeedX(-4);
		if(jogoArea.teclas && jogoArea.teclas[39])
			nave.setSpeedX(4);
		if((jogoArea.teclas && jogoArea.teclas[32]) && !existe(naveLaser)) {
			naveLaser = criarNaveLaser("sprites/laser_1.png", -5);
			var isPlaying = shootSound.currentTime > 0 && !shootSound.paused && !shootSound.ended && shootSound.readyState > 2;
			if(!isPlaying)
				shootSound.play();
		}
		nave.moverX();
		if(nave.getX() < (limitEsq.getX()+limitEsq.getImg().width/2)) {
			nave.setSpeedX(4);
			nave.moverX();
		}
		if((nave.getX()+nave.getImg().width) > (limitDir.getX()+limitDir.getImg().width/2)) {
			nave.setSpeedX(-4);
			nave.moverX();
		}
		nave.desenhar();
	}
	for(var i=0; i<6; i++) {
		for(var j=0; j<6; j++) {
			if(existe(jogoAliens[i][j])) {
					jogoAliens[i][j].desenhar();
					if(jogoArea.aliensMortos >= 35) {
						if(!ocorreu[0]) {
							jogoAliens[i][j].cancelarRitmo();
							jogoAliens[i][j].iniciarRitmo(45);
						}
					}
					else if(jogoArea.aliensMortos >= 34) {
						if(!ocorreu[1]) {
							jogoAliens[i][j].cancelarRitmo();
							jogoAliens[i][j].iniciarRitmo(70);
						}
					}
					else if(jogoArea.aliensMortos >= 33) {
						if(!ocorreu[2]) {
							jogoAliens[i][j].cancelarRitmo();
							jogoAliens[i][j].iniciarRitmo(120);
						}
					}
					else if(jogoArea.aliensMortos >= 32) {
						if(!ocorreu[3]) {
							jogoAliens[i][j].cancelarRitmo();
							jogoAliens[i][j].iniciarRitmo(260);
						}
					}
					else if(jogoArea.aliensMortos >= 28) {
						if(!ocorreu[4]) {
							jogoAliens[i][j].cancelarRitmo();
							jogoAliens[i][j].iniciarRitmo(325);
						}
					}
					else if(jogoArea.aliensMortos >= 15) {
						if(!ocorreu[5]) {
							jogoAliens[i][j].cancelarRitmo();
							jogoAliens[i][j].iniciarRitmo(450);
						}
					}	
			}
		}
	}
	if(jogoArea.aliensMortos == 36) {
		if(passarFaseOcorreu == false) {
			setTimeout(function() {passouFase = true;},3000);
			passarFaseOcorreu = true;
		}
	}
	else if(jogoArea.aliensMortos >= 35) {
		ocorreu[0] = true;
	}
	else if(jogoArea.aliensMortos >= 34) {
		ocorreu[1] = true;
	}
	else if(jogoArea.aliensMortos >= 33) {
		ocorreu[2] = true;
	}
	else if(jogoArea.aliensMortos >= 32) {
		ocorreu[3] = true;
	}
	else if(jogoArea.aliensMortos >= 28) {
		ocorreu[4] = true;
	}
	else if(jogoArea.aliensMortos >= 15) {
		ocorreu[5] = true;
	}
	
	if(existe(naveLaser)) {
		naveLaser.desenhar();
		naveLaser.moverY();
		if((naveLaser.getY()+naveLaser.getImg().height-10) < 0)
			naveLaser = null;
		
		for(var i=0; i<6; i++) {
			for(var j=0; j<6; j++)
				if(existe(naveLaser) && existe(jogoAliens[i][j]))
					if(naveLaser.colidiu(jogoAliens[i][j])) {
						naveLaser = null;
						jogoAliens[i][j].frameMorrer();
						jogoAliens[i][j].cancelarRitmo();
						jogoAliens[i][j] = null;
						var isPlaying = alienDeathSound.currentTime > 0 && !alienDeathSound.paused && !alienDeathSound.ended && alienDeathSound.readyState > 2;
						if(!isPlaying)
							alienDeathSound.play();
						jogoArea.aliensMortos++;
						atualScore.add(10);
					}
		}
	}
	
	/* Global */ lideres = getLideres();
	for(var i=0; i < 6; i++) {
		if(existe(lideres[i])) {
			lideres[i].setEhLider(true);
			lideres[i].invadiu();
			if(!existe(alienLaser[0]) && !existe(alienLaser[1])) {
				alienLaser1();
				setTimeout(alienLaser2, 500);
			}
		}
	}
	
	for(var i = 0; i < 2; i++) {
		if(existe(alienLaser[i])) {
			alienLaser[i].desenhar();
			alienLaser[i].moverY();
			
			if(existe(nave) && existe(alienLaser[i])) {
				if(alienLaser[i].colidiu(nave)){
					naveMorreu = true;
				}
			}
			if((alienLaser[i].getY()) > (jogoArea.height/8*6.75+15))
				alienLaser[i] = null;
		}
	}
	
	if(gameOver) {
		gameOverBox.desenhar();
		var gameOverText = new Text();
		gameOverText.construir(gameOverBox.getX()+50, gameOverBox.getY()+50, "#CD0000", null, 3.0, "50px OCR A Extended", "GAME OVER");
		gameOverText.escrever();
		var bestSc = new Text();
		bestSc.construir(gameOverBox.getX()+50, gameOverBox.getY()+100, "#FFD700", null, 3.0, "30px OCR A Extended", "Record: " + highScore.getScoreText() + " Score");
		bestSc.escrever();
		var currentSc = new Text();
		currentSc.construir(gameOverBox.getX()+50, gameOverBox.getY()+140, "#FFF", null, 3.0, "30px OCR A Extended", "Current: " + atualScore.getScoreText() + " Score");
		currentSc.escrever();
		
		if(atualScore.getScore() > highScore.getScore()) {
			highScore.setScore(atualScore.getScore());
			highScore.setString("HI " + atualScore.getScoreText());
			var newRecord = new Text();
			newRecord.construir(gameOverBox.getX()+50, gameOverBox.getY()+200, "#FFD700", null, 3.0, "40px OCR A Extended", "New Record!");
			newRecord.escrever();
		}
		document.getElementById("btReset").style = "display: normal;"
		document.getElementById("btReset").focus();
		jogoArea.pausar();
		// setTimeout(function() {
			// jogoArea.iniciar();
		// },1000);
	}
	if(naveMorreu) {
		if(existe(nave)) {
			nave.frameMorrer();
			var isPlaying = explosionSound.currentTime > 0 && !explosionSound.paused && !explosionSound.ended && explosionSound.readyState > 2;
			if(!isPlaying)
				explosionSound.play();
			nave = null;
			for(var i = 0; i < 6; i++)
				for(var j = 0; j < 6; j++)
					if(existe(jogoAliens[i][j]))
						jogoAliens[i][j].cancelarRitmo();
			setTimeout(function(){gameOver=true;}, 3000);
		}
	}
	
	if(passouFase) {
		atualScore.add(200);
		jogoArea.pausar();
		jogoArea.iniciar();
	}
}

function criarArrayAlien(srcA, srcB, srcC, srcD, srcE, srcF, srcA2, srcB2, srcC2, srcD2, srcE2, srcF2, deathSrc, xInicial, yInicial) {
	var aliens = [[],[],[],[],[],[]];
	var tipos = [srcA, srcB, srcC, srcD, srcE, srcF, srcA2, srcB2, srcC2, srcD2, srcE2, srcF2];
	var x = xInicial;
	var y = yInicial;
	var i;
	var j;
	
	for(i=0; i<6; i++) {
		for(j=0; j<6; j++) {
			aliens[i][j] = new Alien();
			aliens[i][j].setX(x);
			aliens[i][j].setY(y);
			aliens[i][j].setImg(tipos[i]);
			aliens[i][j].setFrame2(tipos[i+6]);
			aliens[i][j].setImgMorte(deathSrc);
			aliens[i][j].iniciarRitmo(600);
			
			x += 80;
		}
		x = xInicial;
		y += 50;
	}
		
	return aliens;
}

function getLideres() {
	var ultAlien = [5, 5, 5, 5, 5, 5]; // Qual alien esta na posição mais baixa em cada Coluna
	var lideres = [];
	var i = 0;
	while(i < 6) {
		if(existe(jogoAliens[ultAlien[i]][i])) {
			lideres[i] = jogoAliens[ultAlien[i]][i];
			i++;
		}
		else {
			if(ultAlien[i]>0) {
				ultAlien[i]--;
			}
			else {
				lideres[i] = null;
				i++;
			}
		}
	}
	return lideres;
}

function selectAtiradores() {
	var atirador1 = randomNum(0,5);
	var atirador2 = randomNum(0,5);
	while(atirador2 == atirador1) {
		atirador2 = randomNum(0,5);
	}
	return [atirador1, atirador2];
}

function criarNaveLaser(imgSrc, speed) {
	var laser = new Laser(); // agora laser é um objeto
		laser.setX(nave.getX()+nave.getImg().width/2);
		laser.setY(nave.getY()-nave.getImg().height/1.2);
		laser.setImg(imgSrc);
		laser.setSpeedY(speed);
	return laser;
}

function criarAlienLaser(imgSrc, speed, atirador) {
	var laser = new Laser();
	if(existe(lideres[atirador])) {
		laser.setX(lideres[atirador].getX()+lideres[atirador].getImg().width/2);
		laser.setY(lideres[atirador].getY()+lideres[atirador].getImg().height/1.2);
		laser.setImg(imgSrc);
		laser.setSpeedY(speed);
		return laser;
	}
}

function alienLaser1() {
	if(!existe(alienLaser[0])) {
		var atiradores = selectAtiradores();
		alienLaser[0] = criarAlienLaser("sprites/laser_1.png", 4, atiradores[0]);
	}
}
function alienLaser2() {
	if(!existe(alienLaser[1])) {
		var atiradores = selectAtiradores();
		alienLaser[1] = criarAlienLaser("sprites/laser_1.png", 4, atiradores[1]);
	}
}

var jogoArea = {
	canvas : document.createElement("canvas"),
	iniciar : function() {
		this.canvas.width = 830;
		this.canvas.height = 610;
		this.canvas.id = "canvas";
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.contexto = this.canvas.getContext("2d");
		document.getElementById("content").insertBefore(this.canvas, document.getElementById("content").childNodes[1]);
		/* Global */ limitEsq = new Sprite();
		limitEsq.setImg("sprites/limite.png");
		limitEsq.setX(110);
		limitEsq.setY((this.height/8*7.16));
		/* Global */ limitDir = new Sprite();
		limitDir.setImg("sprites/limite.png");
		limitDir.setX(this.width-110);
		limitDir.setY((this.height/8*7.16));
		/* Global */ nave = new Nave();
		nave.construir(this.width/2, this.height/8*6.75, "sprites/nave.png", "sprites/naveDeath_1.png");
		/* Global */ jogoAliens = criarArrayAlien("sprites/alienA_1.png", "sprites/alienB_1.png",
		"sprites/alienC_1.png", "sprites/alienD_1.png",
		"sprites/alienE_1.png", "sprites/alienF_1.png",
		"sprites/alienA_2.png", "sprites/alienB_2.png",
		"sprites/alienC_2.png", "sprites/alienD_2.png",
		"sprites/alienE_2.png", "sprites/alienF_2.png",
		"sprites/alienDeath_1.png",
		60, 70);
		/* Global */ ocorreu = [false, false, false, false, false, false];
		/* Global */ passarFaseOcorreu = false;
		/* Global */ naveLaser = undefined; // criação do objeto laser (vazio)
		/* Global */ alienLaser = [undefined,undefined]; // criação do objeto laser (vazio)
		/* Global */ gameOver = false;
		/* Global */ naveMorreu = false;
		/* Global */ passouFase = false;
		
		this.aliensMortos = 0;

		this.intervalo = setInterval(atualizarJogoArea, 20);
		window.addEventListener('keydown', function(e) {
			jogoArea.teclas = (jogoArea.teclas || []);
			jogoArea.teclas[e.keyCode] = true;
		}),
		window.addEventListener('keyup', function(e) {
			jogoArea.teclas[e.keyCode] = false;
		})
	},
	atualizar : function() {
		// Background
		this.contexto.fillStyle = "#000";
		this.contexto.fillRect(0,0, this.width, this.height);
		this.contexto.fillStyle = "#556B2F";
		this.contexto.fillRect(0, (this.height/8*6.75)+30, this.width, 200);
	},
	pausar : function() {
		clearInterval(this.intervalo);
		for(var i = 0; i < 6; i++)
			for(var j = 0; j < 6; j++) {
				if(existe(jogoAliens[i][j]))
					clearInterval(jogoAliens[i][j].intervalo);
			}
		
		return true;
	},
	parar : function() {
		clearInterval(this.intervalo);
		for(var i = 0; i < 6; i++)
			for(var j = 0; j < 6; j++) {
				if(existe(jogoAliens[i][j])) {
					clearInterval(jogoAliens[i][j].intervalo);
					jogoAliens[i][j] = undefined;
				}
			}
		naveLaser = undefined;
		alienLaser = undefined;
		nave = undefined;
	},
	aliensMortos : 0
}

function existe(o) {
    if (o != undefined && o != null)
        return true;

    return false;
}

function randomNum(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/******Classes******/
function Sprite(src, x, y) {
	var x;
	var y;
	var img = new Image();
	var imgMorte = new Image();
	var speedX = 0;
	var speedY = 0;
	
	this.getX = function() {
		return x;
	}
	this.setX = function(value) {
		x = value;
	}
	
	this.getY = function() {
		return y;
	}
	this.setY = function(value) {
		y = value;
	}
	
	this.getImg = function() {
		return img;
	}
	this.getImgSrc = function() {
		return img.src;
	}
	this.setImg = function(value) {
		img.src = value;
	}
	
	this.getImgMorte = function() {
		return imgMorte;
	}
	this.getImgMorteSrc = function() {
		return imgMorte.src;
	}
	this.setImgMorte = function(value) {
		imgMorte.src = value;
	}
	
	this.getSpeedX = function() {
		return speedX;
	}
	this.setSpeedX = function(value) {
		speedX = value;
	}
	
	this.getSpeedY = function() {
		return speedY;
	}
	this.setSpeedY = function(value) {
		speedY = value;
	}
	
	this.desenhar = function() {
		if(existe(this))
			jogoArea.contexto.drawImage(img, x, y);
	}
	var that = this;
	img.onload = function() {
		that.desenhar();
	}
	this.moverX = function() {
		x += speedX;
	}
	this.moverY = function() {
		y += speedY;
	}
	
	this.frameMorrer = function() {
		jogoArea.contexto.drawImage(imgMorte, x, y);
		var intervalo = setInterval(function() {
				jogoArea.contexto.drawImage(imgMorte, x, y);
			},20);
		setTimeout(function() {
			clearInterval(intervalo);
		}, 1000);
	}
	
}

function Nave() { // Sprite
	Sprite.call(this);
	var vidas;
	
	this.getVidas = function() {
		return vidas;
	}
	this.setVidas = function(value) {
		vidas = value;
	}
	
	this.construir = function(x, y, imgSrc, deathSrc) {
		
		this.setX(x);
		this.setY(y);
		this.setImg(imgSrc);
		this.setImgMorte(deathSrc);
		
	}
}
Nave.prototype = Object.create(Sprite.prototype); // herança
Nave.prototype.constructor = Nave; // corrige o ponteiro do construtor

function Alien() { // Sprite
	Sprite.call(this);
	var frame2 = new Image();
	var qntMovimentos = 0;
	var direcaoMov = 15;
	var ehLider;
	
	this.getFrame2 = function() {
		return frame2;
	}
	this.getFrame2Src = function() {
		return frame2.src;
	}
	this.setFrame2 = function(value) {
		frame2.src = value;
	}
	this.getEhLider = function() {
		return ehLider;
	}
	this.setEhLider = function(value) {
		ehLider = value;
	}

	this.iniciarRitmo = function(velocidade) {
		this.intervalo = setInterval(this.ritmo, velocidade);
	}
	var that = this;
	this.ritmo = function() {
		var temp = that.getImgSrc();
		that.setImg(that.getFrame2Src());
		that.setFrame2(temp);
		
		that.setSpeedX(direcaoMov);
		that.moverX();
		qntMovimentos++; //18
		if(qntMovimentos%18 == 0) {
			that.setSpeedY(32);
			that.moverY();
			direcaoMov *= -1;
		}
		if(that.getEhLider()) {
			var isPlaying = alienMoveSound.currentTime > 0 && !alienMoveSound.paused && !alienMoveSound.ended && alienMoveSound.readyState > 2;
			if(!isPlaying)
				alienMoveSound.play();
		}
	}
	
	this.cancelarRitmo = function() {
		clearInterval(this.intervalo);
	}
	
	this.invadiu = function() {
		if(ehLider) {
			if((this.getY()+this.getImg().height) >= (jogoArea.height/8*6.75)-30)
				gameOver = true;
		}
	}
	
}
Alien.prototype = Object.create(Sprite.prototype);
Alien.prototype.constructor = Alien;

function Laser() {
	Sprite.call(this);
	
	this.colidiu = function(outroObjeto) {
		var laserTop = this.getY();
		var laserBottom = this.getY() + (this.getImg().height);
		var laserLeft = this.getX();
		var laserRight = this.getX() + (this.getImg().width);
		
		var outroTop = outroObjeto.getY();
		var outroBottom = outroObjeto.getY() + (outroObjeto.getImg().height);
		var outroLeft = outroObjeto.getX();
		var outroRight = outroObjeto.getX() + (outroObjeto.getImg().width);
		
		var colisao = false;
		
		if((laserTop <= outroBottom && laserBottom >= outroTop)  && (laserRight >= outroLeft && laserLeft <= outroRight) ){
			colisao = true;
		}
		return colisao;
			
	}
	
}
Laser.prototype = Object.create(Sprite.prototype);
Laser.prototype.constructor = Laser;

function Sound() {
	var sound = document.createElement("audio");
	sound.setAttribute("preload","auto");
	sound.setAttribute("controls","none");
	sound.style.display = "none";
	if(existe(sound.src))
		document.body.appendChild(sound);
	
	this.getSound = function() {
		return sound;
	}
	this.getSoundSrc = function() {
		return sound.src;
	}
	this.setSound = function(value) {
		sound.src = value;
	}
	
	this.play = function() {
		sound.play();
	}
	
	this.stop = function() {
		sound.pause();
	}
}

function Text() {
	var x;
	var y;
	var fillColor;
	var borderColor;
	var borderSize;
	var font; // size, face, bold/sublime/etc
	var string;
	
	this.getX = function() {
		return x;
	}
	this.setX = function(value) {
		x = value;
	}
	this.getY = function() {
		return y;
	}
	this.setY = function(value) {
		y = value;
	}
	this.getFillColor = function() {
		return fillColor;
	}
	this.setFillColor = function(value) {
		fillColor = value;
	}
	this.getBorderColor = function() {
		return borderColor;
	}
	this.setBorderColor = function(value) {
		borderColor = value;
	}
	this.getBorderSize = function() {
		return borderSize;
	}
	this.setBorderSize = function(value) {
		borderSize = value;
	}
	this.getFont = function() {
		return font;
	}
	this.setFont = function(value) {
		font = value;
	}
	this.getString = function() {
		return string;
	}
	this.setString = function(value) {
		string = value;
	}
	
	this.construir = function(Cx, Cy, fillC, strokeC, strokeS, Cfont, texto) {
		this.setX(Cx);
		this.setY(Cy);
		this.setFillColor(fillC);
		this.setBorderColor(strokeC);
		this.setBorderSize(strokeS);
		this.setFont(Cfont);
		this.setString(texto);
	}
	
	this.escrever = function() {
		jogoArea.contexto.fillStyle = fillColor;
		jogoArea.contexto.strokeStyle = borderColor;
		jogoArea.contexto.lineWidth = borderSize;
		jogoArea.contexto.font = font;
		jogoArea.contexto.fillText(string, x, y);
		if(borderColor != null) {
			jogoArea.contexto.strokeText(string, x, y);
		}
	}
}

function Score() {
	Text.call(this);
	
	var score = 0; // contagem da pontuação
	var scoreFormat = "" + score;
	var format = "0000";
	var scoreText = format.substring(0, format.length - scoreFormat.length) + scoreFormat;
	
	this.getScore = function() {
		return score;
	}
	this.setScore = function(value) {
		score = value;
		this.formatar();
	}
	
	this.add = function(value) {
		score += value;
		this.formatar();
	}
	
	this.zerar = function() {
		score = 0;
		this.formatar();
	}
	
	this.formatar = function() {
		scoreFormat = "" + score;
		scoreText = format.substring(0, format.length - scoreFormat.length) + scoreFormat;
	}
	
	this.getScoreText = function() {
		return scoreText;
	}
}
Score.prototype = Object.create(Text.prototype);
Score.prototype.constructor = Score;

function Box() {
	var x;
	var y;
	var width;
	var height;
	var color;
	var borderColor;
	var borderSize;
	
	this.setX = function(value) {
		x = value;
	}
	this.getX = function() {
		return x;
	}
	
	this.setY = function(value) {
		y = value;
	}
	this.getY = function() {
		return y;
	}
	
	this.setWidth = function(value) {
		width = value;
	}
	this.getWidth = function() {
		return width;
	}
	
	this.setHeight = function(value) {
		height = value;
	}
	this.getHeight = function() {
		return height;
	}
	
	this.setColor = function(value) {
		color = value;
	}
	this.getColor = function() {
		return color;
	}
	
	this.setBorderColor = function(value) {
		borderColor = value;
	}
	this.getBorderColor = function() {
		return borderColor;
	}
	
	this.setBorderSize = function(value) {
		borderSize = value;
	}
	this.getBorderSize = function() {
		return borderSize;
	}
	
	this.construir = function(bx, by,  bwidth, bheight, bcolor, bborderColor, bborderSize) {
		this.setX(bx);
		this.setY(by);
		this.setWidth(bwidth);
		this.setHeight(bheight);
		this.setColor(bcolor);
		this.setBorderColor(bborderColor);
		this.setBorderSize(bborderSize);
	}
	
	this.desenhar = function() {
		jogoArea.contexto.fillStyle = color;
		jogoArea.contexto.strokeStyle = borderColor;
		jogoArea.contexto.lineWidth = borderSize;
		jogoArea.contexto.fillRect(x, y, width, height);
		if(borderColor != null) {
			jogoArea.contexto.strokeRect(x, y, width, height);
		}
	}
	
}