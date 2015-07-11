$(function(){
	console.log("READY");
	Fom.setup();
})

var Fom = Fom || {};

Fom.setup = function(){
	this.size = 9;
	var newBox;
	var squareSeed = $("#grid")[0];

	//Create grid
	for(var i = 0; i<(this.size*this.size);i++){
		newBox=document.createElement("button");
		newBox.type="button";
		newBox.className="box";
		newBox.id=i;
		$(newBox).attr("state","empty");
		squareSeed.appendChild(newBox);
		$(newBox).on("click", Fom.boxEvent);
		newBox.disabled=true;
	}

	Fom.addThreeBubbles();

	//this.boxes=$(".box");

	// Test:
	// for(var i=0;i<81;i++){
	// 	Fom.placeBubble();
	// }
}

Fom.isFull=function(){
	var $emptyBoxes = $(".box[state='empty']");
	if($emptyBoxes.length===0){
		return true;
	} else {
		return false;
	}
}

Fom.addThreeBubbles=function(){
	for(var i=0;i<3;i++){
		var $emptyBoxes = $(".box[state='empty']");
		if(!Fom.isFull()){
			var box = $emptyBoxes[Math.floor(Math.random()*$emptyBoxes.length)];
			Fom.addBubble(box);
			$(box).attr("state","taken");
		}
	}
}

Fom.addBubble = function(container){
	var $newBubble=$(document.createElement("button"));
	$newBubble.prop("type","button");
	$newBubble.css("background-color",Fom.colorPicker());
	$newBubble.addClass("bubble");
	$newBubble.on("click",Fom.bubbleEvent);
	container.appendChild($newBubble[0]);
}

Fom.colorPicker=function (){
	var colors=["red", "blue", "pink", "green", "cyan", "yellow","orange"];
	return colors[Math.floor(Math.random()*colors.length)];
}

Fom.bubbleEvent = function(){
	$(".bubble").removeClass("selected");
	$(event.currentTarget).addClass("selected");
	$(".box").prop("disabled",true);
	$(".box[state='empty']").prop("disabled",false);
	console.log("bubble clicked");
}

Fom.boxEvent = function(){
	console.log("box clicked");
	$(event.currentTarget).attr("state","taken");
	$(".selected").parent().attr("state","empty");
	$(".selected").detach().appendTo(event.currentTarget);
	Fom.addThreeBubbles();
	$(".box").prop("disabled",true);
	$(".box[state='empty']").prop("disabled",false);
}
