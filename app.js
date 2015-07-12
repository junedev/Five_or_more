$(function(){
	console.log("READY");
	Fom.setup();
})

var Fom = Fom || {};

Fom.setup = function(){
	this.size = 9;
	this.neighbourMap = [];
	this.emptyArea = null;
	this.checkedIds = null;

	Fom.createGrid();
	Fom.addThreeBubbles();
}

Fom.createGrid = function (){
	var newBox;
	var squareSeed = $("#grid")[0];
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
	Fom.fillNeighbourMap();
}

Fom.fillNeighbourMap = function(){
	for(var i=0; i<(Fom.size*Fom.size);i++){
		var neighbours=[];
		if(i-Fom.size>=0){neighbours.push(i-Fom.size);}
		if(i+Fom.size<(Fom.size*Fom.size)){neighbours.push(i+Fom.size);}
		if(i%Fom.size!==0){neighbours.push(i-1);}
		if(i%Fom.size!==Fom.size-1){neighbours.push(i+1);}
		Fom.neighbourMap.push(neighbours);
	}
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
	event.stopPropagation();
	$(".bubble").removeClass("selected");
	$(event.currentTarget).addClass("selected");
	$(".box").prop("disabled",true);
	$(".box[state='empty']").prop("disabled",false);
	console.log("bubble clicked");
}

Fom.boxEvent = function(){
	console.log("box clicked");
	if(Fom.validMove(event.currentTarget,$(".selected")[0])){
	$(event.currentTarget).attr("state","taken");
	$(".selected").parent().attr("state","empty");
	$(".selected").detach().appendTo(event.currentTarget);
	$(".selected").removeClass("selected");
	Fom.addThreeBubbles();
	$(".box").prop("disabled",true);}
	else{
		//show "you can't move there" on display
	}
}

Fom.validMove = function(targetBox,bubble){
	var targetId = parseInt(targetBox.id);
	var bubbleId = parseInt($(bubble).parent()[0].id);
	var result = false;
	Fom.emptyArea = [];
	Fom.checkedIds = [];

	var checkForEmptyNeighbours = function(id){
		if($.inArray(id,Fom.checkedIds)===-1){
			Fom.checkedIds.push(id);
			for(var i=0;i<Fom.neighbourMap[id].length;i++){
				nId = Fom.neighbourMap[id][i];
				if($("#"+nId).attr("state")==="empty"){
					if($.inArray(nId,Fom.emptyArea)===-1){
						Fom.emptyArea.push(nId);
						checkForEmptyNeighbours(nId);
					}
				}
			}
		}
	}
	checkForEmptyNeighbours(targetId);
	for(var i=0;i<Fom.neighbourMap[bubbleId].length;i++){
		if($.inArray(Fom.neighbourMap[bubbleId][i],Fom.emptyArea)!==-1){
			result=true;
		}
	}
	if(!result){
		console.log("unvalid move"); // FICME: print on screen
	}

	return result; 
}

