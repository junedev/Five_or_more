$(function(){
	console.log("READY");
	Fom.setup();
})

var Fom = Fom || {};

Fom.setup= function(){
	this.size=9;
	var newBox;
	var squareSeed = $("#grid")[0];

	//Create grid
	for(var i = 0; i<(this.size*this.size);i++){
		newBox=document.createElement("div");
		newBox.className="box";
		newBox.id=i;
		squareSeed.appendChild(newBox);
	}

	this.boxes=$(".box");
	Fom.placeBubble();
}

Fom.addBubble = function(container){
	var $newBubble=$(document.createElement("div"));
	$newBubble.css("background-color",Fom.colorPicker());
	$newBubble.addClass("bubble");
	container.appendChild($newBubble[0]);
}

Fom.colorPicker=function (){
	var colors=["red", "blue", "pink", "green", "cyan", "yellow","orange"];
	return colors[Math.floor(Math.random()*colors.length)];
}

Fom.placeBubble=function(){
	var position= Math.floor(Math.random()*this.size*this.size);
	Fom.addBubble($("#"+position)[0]);

	//place only on free field and mark as taken after placing
}