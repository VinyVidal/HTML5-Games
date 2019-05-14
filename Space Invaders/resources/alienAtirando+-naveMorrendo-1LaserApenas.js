window.onload = function() {
	jogoArea.iniciar();
	/* Global */ limitEsq = new Sprite();
	limitEsq.setImg("sprites/limite.png");
	limitEsq.setX(110);
	limitEsq.setY((jogoArea.height/8*7.3));
	/* Global */ limitDir = new Sprite();
	limitDir.setImg("sprites/limite.png");
	limitDir.setX(jogoArea.width-110);
	limitDir.setY((jogoArea.height/8*7.3));
	/* Global */ nave = new Nave();
	nave.gerarNave(jogoArea.width/2, jogoArea.height/8*6.75, "sprites/nave.png");
	/* Global */ jogoAliens = criarArrayAlien("sprites/alienA_1.png", "sprites/alienB_1.png",
	"sprites/alienC_1.png", "sprites/alienD_1.png",
	"sprites/alienE_1.png", "sprites/alienF_1.png",
	"sprites/alienA_2.png", "sprites/alienB_2.png",
	"sprites/alienC_2.png", "sprites/alienD_2.png",
	"sprites/alienE_2.png", "sprites/alienF_2.png",
	"sprites/alienDeath_1.png",
	60, 70);
	/* Global */ ocorreu = [false, false, false, false, false, false];
	/* Global */ naveLaser = undefined; // criação do objeto laser (vazio)
	/* Global */ alienLaser = undefined; // criação do objeto laser (vazio)
	/* Global */ gameOver = false;
}

function atualizarJogoArea() { // intervalo de atualizar a área
	jogoArea.atualizar();
	limitEsq.desenhar();
	limitDir.desenhar();
	if(existe(nave)) {
		nave.setSpeedX(0);
		if(jogoArea.teclas && jogoArea.teclas[37])
			nave.setSpeedX(-4);
		if(jogoArea.teclas && jogoArea.teclas[39])
			nave.setSpeedX(4);
		if((jogoArea.teclas && jogoArea.teclas[32]) && !existe(naveLaser)) {
			naveLaser = criarNaveLaser("sprites/laser_1.png", -5);
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
	if(jogoArea.aliensMortos >= 35) {
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
						jogoArea.aliensMortos++;
					}
		}
	}
	
	/* Global */ lideres = getLideres();
	// jogoarea.contexto.fillstyle = "#f00";
	for(var i=0; i < 6; i++) {
		if(existe(lideres[i])) {
			lideres[i].setEhLider(true);
			lideres[i].invadiu();
			if(!existe(alienLaser)) {
				alienLaser = criarAlienLaser("sprites/laser_1.png", 4, selectAtiradores());
			}
		}
	}
	
	if(existe(alienLaser)) {
		alienLaser.desenhar();
		alienLaser.moverY();
		
		if(existe(nave) && existe(alienLaser)) {
			if(alienLaser.colidiu(nave)){
				nave = null;
				gameOver = true;
			}
		}
		if((alienLaser.getY()) > (jogoArea.height/8*6.75+15))
			alienLaser = null;
	}
	
	if(gameOver) {
		jogoArea.pausar();
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
	return atirador1;
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
	laser.setX(lideres[atirador].getX()+lideres[atirador].getImg().width/2);
	laser.setY(lideres[atirador].getY()+lideres[atirador].getImg().height/1.2);
	laser.setImg(imgSrc);
	laser.setSpeedY(speed);
	return laser;
}

var jogoArea = {
	canvas : document.createElement("canvas"),
	iniciar : function() {
		this.canvas.width = 830;
		this.canvas.height = 610;
		this.width = jogoArea.canvas.width;
		this.height = jogoArea.canvas.height;
		this.contexto = jogoArea.canvas.getContext("2d");
		document.body.appendChild(jogoArea.canvas);
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
		this.contexto.fillRect(0,0, jogoArea.width, jogoArea.height);
		this.contexto.fillStyle = "#556B2F";
		this.contexto.fillRect(0, (jogoArea.height/8*6.75)+30, jogoArea.width, 200);
	},
	pausar : function() {
		clearInterval(this.intervalo);
		for(var i = 0; i < 6; i++)
			for(var j = 0; j < 6; j++) {
				if(existe(jogoAliens[i][j]))
					clearInterval(jogoAliens[i][j].intervalo);
			}
		
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
	
	this.gerarNave = function(x, y, imgSrc) {
		
		this.setX(x);
		this.setY(y);
		this.setImg(imgSrc);
		
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
