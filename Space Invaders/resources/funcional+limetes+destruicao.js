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
	90, 70);
	/* Global */ naveLaser = undefined; // criação do objeto laser (vazio)
}

function atualizarJogoArea() { // intervalo de atualizar a área
	jogoArea.atualizar();
	limitEsq.desenhar();
	limitDir.desenhar();
	nave.setSpeedX(0);
	if(jogoArea.teclas && jogoArea.teclas[37])
		nave.setSpeedX(-4);
	if(jogoArea.teclas && jogoArea.teclas[39])
		nave.setSpeedX(4);
	if((jogoArea.teclas && jogoArea.teclas[32]) && !existe(naveLaser))
		naveLaser = criarLaser(true, "sprites/laser_1.png", ["sprites/laser_1.png", "sprites/laser_2.png", "sprites/laser_3.png", "sprites/laser_4.png"], -5);
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
	for(var i=0; i<6; i++) {
		for(var j=0; j<6; j++) {
			if(existe(jogoAliens[i][j]))
				jogoAliens[i][j].desenhar();
		}
	}
	if(existe(naveLaser)) {
		naveLaser.desenhar();
		naveLaser.moverY(-4);
		if(naveLaser.getY() < 0)
			naveLaser = null;
		
		for(var i=0; i<6; i++) {
			for(var j=0; j<6; j++)
				if(existe(naveLaser) && existe(jogoAliens[i][j]))
					if(naveLaser.colidiu(jogoAliens[i][j])) {
						naveLaser = null;
						jogoAliens[i][j].cancelarRitmo();
						jogoAliens[i][j].frameMorrer();
						jogoAliens[i][j] = null;
					}
		}
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
			aliens[i][j].iniciarRitmo();
			
			x += 80;
		}
		x = xInicial;
		y += 50;
	}
		
	return aliens;
}


function criarLaser(ehAmigo, primeiraImg, laserFrames, speed) {
	var laser = new Laser(); // agora laser é um objeto
	if(ehAmigo) {
		laser.setX(nave.getX()+nave.getImg().width/2);
		laser.setY(nave.getY()-nave.getImg().height/1.2);
		laser.setImg(primeiraImg);
		laser.setFrames(laserFrames[0], laserFrames[1], laserFrames[2], laserFrames[3]);
		laser.setSpeedY(speed);
		
	}
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
	}
}

function existe(o) {
    if (o != undefined && o != null)
        return true;

    return false;
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
	
	this.getFrame2 = function() {
		return frame2;
	}
	this.getFrame2Src = function() {
		return frame2.src;
	}
	this.setFrame2 = function(value) {
		frame2.src = value;
	}

	this.iniciarRitmo = function() {
		var that = this;
		this.intervalo = setInterval(function() {
			var temp = that.getImgSrc();
			that.setImg(that.getFrame2Src());
			that.setFrame2(temp);
		}, 700);
	}
	
	this.cancelarRitmo = function() {
		clearInterval(this.intervalo);
	}
	
}
Alien.prototype = Object.create(Sprite.prototype);
Alien.prototype.constructor = Alien;

function Laser() {
	Sprite.call(this);
	
	var laserFrames = [];
	for(var i=0; i<4; i++)
		laserFrames[i] = new Image();
	
	this.getFramesSrc = function() {
		var src = [];
		for(var i=0; i<4; i++)
			src[i] = laserFrames[i].src;
		return src;
	}
	this.setFrames = function(fr1, fr2, fr3, fr4) {
		var frameSrc = [fr1, fr2, fr3, fr4];
		for(var i in frameSrc)
			laserFrames[i].src = frameSrc[i];
	}
	
	this.rodarFrames = function() {
		var that = this;
		var i=0;
		
	}
	
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
