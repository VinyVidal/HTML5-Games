/* Ao carregar a página, uma função indefinida (funciton()) cria os obejtos no contexto e executa a função setinterval() */
window.onload = function(){
	var canvas = document.getElementById("GameScreen");
	var ctx = canvas.getContext("2d");
	resizeCanvas();
	var ball = new Sprite(canvas, ctx, "img/bola.png", canvas.width/2-30, canvas.height-47);
	var tecla = false;
	var speed = 2;
	var touchInicial = {x: false, y: false};
	var touchDurante = {x: false, y: false};
	var gameOverSoundPlayed = false;
	/* propriedade da bola que checa se ela atravessou a tela */
	ball.pontuou = function()
	{
		if(this.y <= 5)
		{
			this.y = canvas.height - this.imagem.height;
			return true;
		}
		else
			return false;
	}
	
	var rect1 = new Sprite(canvas, ctx, "img/retangulo.png", -5, 450);
	var rect2 = new Sprite(canvas, ctx, "img/retangulo.png", canvas.width-50, 350);
	var rect3 = new Sprite(canvas, ctx, "img/retangulo.png", -20, 250);
	var rect4 = new Sprite(canvas, ctx, "img/retangulo.png", 0, 150);
	var rect5 = new Sprite(canvas, ctx, "img/retangulo.png", canvas.width-66, 50);
	var gameOver = false;
	var pontuacao = 0;
	var gameOverSound = new Sound("sound/gameOver.mp3");
	var scoreSound = new Sound("sound/score.mp3");

	window.addEventListener('resize', resizeCanvas);
	function resizeCanvas(e)
	{
		if(window.innerHeight <= canvas.height*1.5)
		{
			canvas.style.height = window.innerHeight-10 + 'px';
			canvas.style.width = window.innerHeight * 0.90 + 'px';
		}
		else
		{
			canvas.style.width = '100%';
			canvas.style.height = '100%';
		}
	}
	
		/* Movimentação do personagem controlavel (bola) */
	document.onkeydown = function(event){ // event é um objeto que se refere ao evento disparado (onkeydown)
		event.preventDefault();
		if(gameOver)
		{
			if(event.which == 13 || event.which == 32)
			{
				clearInterval(intervalo);
				window.onload(event);
			}
		}
		
		tecla = event.which; // A propriedade 'which' do objeto event retorna o código da tecla pressionada

	}
	
	document.onkeyup = function(event){
		tecla = false;
	}

	// Touch:
	canvas.ontouchstart = function(event){
		if(gameOver)
		{
			clearInterval(intervalo);
			window.onload(event);
		}
		touchInicial.x = event.touches[0].pageX;
		touchInicial.y = event.touches[0].pageY;
	}
	canvas.ontouchmove = function(event){
		event.preventDefault();

		touchDurante.x = event.touches[0].pageX;
		touchDurante.y = event.touches[0].pageY;
	}
	canvas.ontouchend = function(event){
		touchInicial.x = false;
		touchInicial.y = false;
		touchDurante.x = false;
		touchDurante.y = false;
	}

	/* periodicamente o plano de fundo e objetos serão redesenhados no canvas */
	intervalo = setInterval(function(){ // Uma função indefinida pode ser usada para executar um conjunto de funções como valor de uma propriedade ou parametro
		drawBackground(ctx,canvas);
		drawPoints(ctx, canvas, pontuacao);
		
		// Checando teclas de movimento
		if(!gameOver)
		{
			switch(tecla) {
			case 37: // 37 é o código da tecla 'seta para esquerda'
				ball.move(-7,0);
				break;
			case 38: // Tecla cima
				ball.move(0,-8);
				break;
			case 39: // Tecla direita
				ball.move(7,0);
				break;
			case 40: // Tecla baixo
				ball.move(0,8);
				break;
			}

			if(touchDurante.x && touchDurante.y)
			{
				var offset = 60; // distancia minima para ocorrer o movimento

				// Se o touch foi movido para cima
				if(touchDurante.y < touchInicial.y && (touchInicial.y - touchDurante.y) > offset)
				{
					ball.move(0,-8);
				}

				// Se o touch foi movido para baixo
				if(touchDurante.y > touchInicial.y && (touchDurante.y - touchInicial.y) > offset)
				{
					ball.move(0,8);
				}
				
				// Se o touch foi movido para esquerda
				if(touchDurante.x < touchInicial.x && (touchInicial.x - touchDurante.x) > offset)
				{
					ball.move(-7,0);
				}

				// Se o touch foi movido para direita
				if(touchDurante.x > touchInicial.x && (touchDurante.x - touchInicial.x) > offset)
				{
					ball.move(7,0);
				}
			}
		}

		if(ball.pontuou())
		{
			scoreSound.play();
			pontuacao++;
			speed++;
			console.log(speed);
		}

		ball.draw();
		rect1.draw();
		rect2.draw();
		rect3.draw();
		rect4.draw();
		rect5.draw();
		
		// Checagem do GameOver
		if(gameOver)
		{
			ctx.fillStyle = "#F00";
			ctx.font = "80px Comic Sans MS";
			ctx.fillText("GAME OVER", canvas.width/36, canvas.height/2+20);

			if(gameOverSoundPlayed == false)
			{
				gameOverSound.play();
				gameOverSoundPlayed = true;
			}
			return;
		}
		
		// Movimentação dos retangulos
		
		rect1.move(speed,0);
		rect2.move(-speed*2,0);
		rect3.move(speed*1.2,0);
		rect4.move(speed*2.5,0);
		rect5.move(-speed*3,0);

		/*
		rect1.move(5,0);
		rect2.move(-10,0);
		rect3.move(7,0);
		rect4.move(15,0);
		rect5.move(-20,0);
		*/
		
		// Checar se houve colisão entre um retangulo e a bola
		if(rect1.colidiu(ball) ||
		rect2.colidiu(ball) ||
		rect3.colidiu(ball) ||
		rect4.colidiu(ball) ||
		rect5.colidiu(ball))
			gameOver = true;
			
		
	},50);
	
	
};

/* Função que desenha o plano de fundo do canvas */
function drawBackground(ctx,canvas) {
	ctx.fillStyle = "#000";
	ctx.fillRect(0,0,canvas.width,canvas.height);
}


	
/* Função que desenha a pontuação no Canvas */
function drawPoints(ctx, canvas, pontuacao)
{
	ctx.fillStyle = "#FFF";
	ctx.font = "12px Comic Sans MS";
	
	ctx.fillText(pontuacao, 5, 20);
}



/* Criação da 'classe' Sprite, que irá gerar os objetos no canvas, e controlar o movimento, etc */
function Sprite(canvas, ctx, imgPath, Xstart, Ystart) {
	this.x = Xstart;
	this.y = Ystart;
	
	/* propriedade 'imagem' recebe um objeto da classe Image */
	this.imagem = new Image();
	this.imagem.src = imgPath;
	
	/* método que desenha a imagem no canvas */
	this.draw = function(){
		ctx.drawImage(this.imagem, this.x, this.y, this.imagem.width, this.imagem.height); 
		
		/* HitBox
		ctx.strokeStyle = "#F0F";
		ctx.strokeRect(this.x, this.y, this.imagem.width, this.imagem.height); 
		*/
	}
	
	/* propriedade 'onload' da classe Image, o valor dessa propriedade é a chamada do método criado anteriormente, que irá desenhar a imagem no canvas quando ela for carregada na página */
	this.imagem.onload = this.draw();
	
	/* método que define o movimento dos objetos */
	this.move = function(dx, dy) {
		 /* a propriedade 'x' e 'y' do Sprite é incrementada de acordo com o valor do movimento */
		
		this.x += dx;
		this.y += dy;
		
		/* Tratamento do limite dos movimentos dos objetos */
		
		// Se o objeto ultrapassar o canvas pela direita, ele aparecera na esquerda e vice-versa
		if(this.x > canvas.width)
			this.x = -this.imagem.width;
		else if(this.x < -this.imagem.width)
			this.x = canvas.width;
		
		// O chão é fixo
		if(this.y>canvas.height - this.imagem.height)
			this.y -= dy;
		// Ao tocar no topo, volta pro inicio
		else if(this.y <= -5)
			this.y = canvas.height - this.imagem.height;
	}
	
	/* Metodo que vai detectar a colisão dos objetos */
	
	this.colidiu = function(outro){ // Parametro 'outro' se refere à bola
		var colidiuXtop = (outro.x + outro.imagem.width) >= this.x && outro.x <= (this.x + this.imagem.width); // Variavel do tipo boolean, caso haja intersecção entre os objetos, o valor da varíavel é verdadeiro
		var colidiuYtop = (outro.y + outro.imagem.height) >= this.y && outro.y <= (this.y + this.imagem.height);
		
		var colidiuXbase = (outro.x + outro.imagem.width) >= this.x && (outro.x + outro.imagem.width) <= (this.x + this.width);
		var colidiuYbase = (outro.y + outro.imagem.height) >= this.y && (outro.y + outro.imagem.height) <= (this.y + this.height);
		
		return ((colidiuXtop && colidiuYtop) || (colidiuXbase && colidiuYbase));
	}
}


/* Classe representando o som */
function Sound(src)
{
	this.sound = document.createElement("audio"); // Criação de um elemento de audio
	this.sound.src = src;
	this.sound.setAttribute("preload", "auto"); // o som é reproduzido automaticamente
	this.sound.setAttribute("controls","none"); // não há controladores do elemento
	this.sound.style.display = "none"; // invisivel
	document.body.appendChild(this.sound);
	
	this.play = function()
	{
		this.sound.play();
	}
	
	this.stop = function()
	{
		this.sound.pause();
	}
	
}