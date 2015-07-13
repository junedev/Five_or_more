$(function(){
	console.log("READY");
	Fom.setup();
})

var Fom = Fom || {};

Fom.setup = function(){
	this.size = 9;
	this.neighbourMap = [];
	this.neighbourMapInclDiagonal = [];
	this.emptyArea = null;
	this.checkedIds = null;
	this.score = 0;
	this.scoreMap = {};
	this.rankMap = [[0, "LOOSER"],[200,"BRONZE"],[500, "SILVER"],[1000, "GOLD"],[2000,"LEGEN-DARY"]];
	Fom.fillScoreMap();
	Fom.newGame();
	$("#reset").on("click",Fom.newGame);
}

Fom.newGame = function(){
	Fom.score = 0;
	Fom.neighbourMap = [];
	Fom.neighbourMapInclDiagonal = [];
	Fom.createGrid();
	Fom.addThreeBubbles();
}

Fom.fillScoreMap = function (){
	var add = 2;
	Fom.scoreMap[5]=10;
	for(var i=6; i<=13; i++){
		Fom.scoreMap[i]=add+Fom.scoreMap[i-1];
		add+=4;
	}
}

Fom.createGrid = function (){
	var newBox;
	$("#grid").empty();
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
	Fom.fillNeighbourMapInclDiagonal();
}

Fom.fillNeighbourMap = function(){
	for(var i=0; i<(Fom.size*Fom.size);i++){
		var neighbours=[];		
		if(i-Fom.size>=0){neighbours.push(i-Fom.size);} else{neighbours.push(null);} //top
		if(i+Fom.size<(Fom.size*Fom.size)){neighbours.push(i+Fom.size);} else{neighbours.push(null);} //bottom
		if(i%Fom.size!==0){neighbours.push(i-1);} else{neighbours.push(null);} //left
		if(i%Fom.size!==Fom.size-1){neighbours.push(i+1);} else{neighbours.push(null);} //right
		Fom.neighbourMap.push(neighbours);
	}
}

Fom.fillNeighbourMapInclDiagonal = function(){
	for(var i=0; i<(Fom.size*Fom.size);i++){
		var neighbours=[];		
		if(i-Fom.size>=0){neighbours.push(i-Fom.size);} else{neighbours.push(null);} //top
		if(i+Fom.size<(Fom.size*Fom.size)){neighbours.push(i+Fom.size);} else{neighbours.push(null);} //bottom
		if(i%Fom.size!==0){neighbours.push(i-1);} else{neighbours.push(null);} //left
		if(i%Fom.size!==Fom.size-1){neighbours.push(i+1);} else{neighbours.push(null);} //right
		Fom.neighbourMapInclDiagonal.push(neighbours);
	}

	for(var i=0; i<(Fom.size*Fom.size);i++){
		if(i-Fom.size-1>=0 && i%Fom.size!==0){Fom.neighbourMapInclDiagonal[i].push(i-Fom.size-1)} //top left
			else{Fom.neighbourMapInclDiagonal[i].push(null);};
		if(i+Fom.size+1<(Fom.size*Fom.size) && i%Fom.size!==Fom.size-1){Fom.neighbourMapInclDiagonal[i].push(i+Fom.size+1)} //bottom right
			else{Fom.neighbourMapInclDiagonal[i].push(null);};
		if(i-(Fom.size-1)>=0 && i%Fom.size!==Fom.size-1){Fom.neighbourMapInclDiagonal[i].push(i-(Fom.size-1))} //top right
			else{Fom.neighbourMapInclDiagonal[i].push(null);};
		if(i+Fom.size-1<(Fom.size*Fom.size) && i%Fom.size!==0){Fom.neighbourMapInclDiagonal[i].push(i+Fom.size-1)} //bottom right
			else{Fom.neighbourMapInclDiagonal[i].push(null);}
	}
}

Fom.isFull=function(){
	var $emptyBoxes = $(".box[state='empty']");
	if($emptyBoxes.length===0){
		for(var i=Fom.rankMap.length-1;i>=0;i--){
			if(Fom.score>=Fom.rankMap[i][0]){
				alert("You earned the rank "+Fom.rankMap[i][1]+"!");
				i=-1;
			}
		}
		return true;
	} else {
		return false;
	}
}

Fom.addThreeBubbles=function(){
	for(var i=0;i<3;i++){
		var $emptyBoxes = $(".box[state='empty']");
		if($emptyBoxes.length>0){
			var box = $emptyBoxes[Math.floor(Math.random()*$emptyBoxes.length)];
			Fom.addBubble(box);
			$(box).attr("state","taken");
			Fom.checkRemoval(box);
			Fom.isFull();
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
}

Fom.boxEvent = function(){
	$("#message").html("");
	if(Fom.validMove(event.currentTarget,$(".selected")[0])){
		$(event.currentTarget).attr("state","taken");
		$(".selected").parent().attr("state","empty");
		$(".selected").detach().appendTo(event.currentTarget);
		$(".selected").removeClass("selected");
		Fom.checkRemoval(event.currentTarget);
		Fom.addThreeBubbles();
		$(".box").prop("disabled",true);}
		else{
			$("#message").html("You can't move there.")
		}
	}

	Fom.validMove = function(targetBox,bubble){
		var targetId = parseInt(targetBox.id);
		var bubbleId = parseInt($(bubble).parent()[0].id);
		var result = false;
		Fom.emptyArea = [targetId];
		Fom.checkedIds = [];

		var checkForEmptyNeighbours = function(id){
			if(!isNaN(id) && $.inArray(id,Fom.checkedIds)===-1){
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
		return result; 
	}

	Fom.checkRemoval = function (startBox){
		Fom.color = $(startBox).children().css("background-color");
		Fom.counter = [1,1,1,1];
		var startId = parseInt(startBox.id);
		var startN = Fom.neighbourMapInclDiagonal[startId];
		var storage = [[],[],[],[]];
		var bubbleCount = 0;

		var checkColor = function(index, id, neighbour){
			if(!isNaN(neighbour)){
				if( $("#"+neighbour).children().length>0 && $("#"+neighbour).children().css("background-color")===Fom.color){
					Fom.counter[index]++;
					storage[index].push($("#"+neighbour));
					checkColor(index,neighbour, neighbour+(neighbour-id));
				} else {
					return
				}
			}
		}

		for(var i=0; i<Fom.counter.length;i++){
			checkColor(i,startId,startN[i*2]);
			checkColor(i,startId,startN[i*2+1]);
		}

		for(var i=0; i<Fom.counter.length;i++){
			if(Fom.counter[i]>=5){
				bubbleCount+=Fom.counter[i]-1;
				$(startBox).empty();
				$(startBox).attr("state","empty");
				$(storage[i]).each(function(index,element){
					$(element).empty();
					$(element).attr("state","empty");
				});
			}
		}

		if(bubbleCount!==0){
		bubbleCount++; //add start bubble to connected bubbles count
		Fom.score+=Fom.scoreMap[bubbleCount];
		$("#score").html("Score: "+Fom.score);
	}

}