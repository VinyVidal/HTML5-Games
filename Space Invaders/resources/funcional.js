window.onload = function() {
	var canvas = document.getElementById("canvas");
	var contexto = canvas.getContext("2d");
	
	var nave = new Sprite(canvas, contexto, "nave.bmp", 20, 20);

}

function Sprite(canvas, contexto, src, x, y) {
	this.x = x;
	this.y = y;
	
	this.img = new Image();
	this.img.src = src;
	
	this.desenhar = function() {
		contexto.drawImage(this.img, 20, 20);
	}
	
	var sprite = this;
	this.img.onload = function() {
		sprite.desenhar();
	}
}