window.onload = function(){
	
	var canvas = document.getElementById("design");
	var ctx = canvas.getContext("2d");

	// // Main
	// ctx.fillStyle = "#CD0000";
	// ctx.strokeStyle = "#8B1A1A";
	// ctx.lineWidth = 3.0;
	
	// ctx.beginPath();
	// ctx.arc(canvas.width/2,canvas.height/2,22,0,100);
	// ctx.stroke();
	// ctx.fill();
	// ctx.closePath();
	
	// // NPC
	// canvas = document.getElementById("design2");
	// ctx = canvas.getContext("2d");
	
	// ctx.fillStyle = "#ADFF2F";
	// ctx.strokeStyle = "#006400";
	
	// ctx.rect(0,0,64,24);
	// ctx.fill();
	// ctx.stroke();
	
	// Botao
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#222";
	ctx.strokeRect(2,2,48,21);
	ctx.fillText("hello",16,10)
}