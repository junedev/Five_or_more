$(function(){
	console.log("READY");
	Fom.setup();
})

var Fom = Fom || {};

Fom.setup = function(){
	this.size = 9;
	this.neighbourMap = []; //only up, down, left, right neighbours
	this.neighbourMapInclDiagonal = [];
	this.score = 0;
	this.scoreMap = {};
	this.rankMap = [[0, "LOOSER"],[200,"BRONZE"],[500, "SILVER"],[1000, "GOLD"],[2000,"LEGEN-DARY"]];
	this.fillScoreMap();
	this.fillNeighbourMap();
	this.fillNeighbourMapInclDiagonal();
	this.newGame();
	$("#reset").on("click",Fom.newGame);
}

Fom.newGame = function(){
	Fom.score = 0;
	$("#score").html(Fom.score);
	Fom.createGrid();
	Fom.fillPreview();
	Fom.addThreeBubbles();
}

Fom.fillPreview = function(){
	var bubblesNeeded = 3-$("#preview").children().length;
	if(bubblesNeeded>0){
		for(var i=0;i<bubblesNeeded;i++){
			Fom.addBubble($("#preview")[0]);
		}
	} 
}

Fom.fillScoreMap = function (){
	var add = 2;
	Fom.scoreMap[5] = 10;
	// score formula reverse engineered from original game
	for(var i=6; i<=13; i++){
		Fom.scoreMap[i] = add + Fom.scoreMap[i-1];
		add += 4;
	}
}

Fom.createGrid = function (){
	var newBox;
	$("#grid").empty();
	$("#preview").empty();
	var boxSeed = $("#grid")[0];
	for(var i = 0; i<(this.size*this.size);i++){
		newBox = document.createElement("button");
		newBox.type = "button";
		newBox.className = "box";
		newBox.id = i;
		boxSeed.appendChild(newBox);
		$(newBox).on("click", Fom.boxEvent);
		newBox.disabled = true;
	}
}

Fom.fillNeighbourMap = function(){
	for(var i=0; i<(Fom.size*Fom.size);i++){
		var neighbours=[];
		// all boxes are labeled with an consecutive id from 0 to 80
		// these formulas ensure neighbours are only added if they don't go "over the border" of the grid
		if(i-Fom.size>=0){neighbours.push(i-Fom.size);} //up
		if(i%Fom.size!==Fom.size-1){neighbours.push(i+1);} //right
		if(i+Fom.size<(Fom.size*Fom.size)){neighbours.push(i+Fom.size);} //down
		if(i%Fom.size!==0){neighbours.push(i-1);} //left
		Fom.neighbourMap.push(neighbours);
	}
}

Fom.fillNeighbourMapInclDiagonal = function(){
	// in this map "null" will be pushed if the neighbour doesn't exists
	// this ensures the position of the respective neighbour (e.g. up or down neighbour) 
	// will be the same for all of the neighbour arrays
	for(var i=0; i<(Fom.size*Fom.size);i++){
		var neighbours=[];		
		if(i-Fom.size>=0){neighbours.push(i-Fom.size);} else{neighbours.push(null);} //up
		if(i+Fom.size<(Fom.size*Fom.size)){neighbours.push(i+Fom.size);} else{neighbours.push(null);} //down
		if(i%Fom.size!==0){neighbours.push(i-1);} else{neighbours.push(null);} //left
		if(i%Fom.size!==Fom.size-1){neighbours.push(i+1);} else{neighbours.push(null);} //right
		Fom.neighbourMapInclDiagonal.push(neighbours);
	}

	for(var i=0; i<(Fom.size*Fom.size);i++){
		if(i-Fom.size-1>=0 && i%Fom.size!==0){Fom.neighbourMapInclDiagonal[i].push(i-Fom.size-1)} //up left
			else{Fom.neighbourMapInclDiagonal[i].push(null);};
		if(i+Fom.size+1<(Fom.size*Fom.size) && i%Fom.size!==Fom.size-1){Fom.neighbourMapInclDiagonal[i].push(i+Fom.size+1)} //down right
			else{Fom.neighbourMapInclDiagonal[i].push(null);};
		if(i-(Fom.size-1)>=0 && i%Fom.size!==Fom.size-1){Fom.neighbourMapInclDiagonal[i].push(i-(Fom.size-1))} //up right
			else{Fom.neighbourMapInclDiagonal[i].push(null);};
		if(i+Fom.size-1<(Fom.size*Fom.size) && i%Fom.size!==0){Fom.neighbourMapInclDiagonal[i].push(i+Fom.size-1)} //down right
			else{Fom.neighbourMapInclDiagonal[i].push(null);}
	}
}

// Shows rank earned of board is full
Fom.isFull=function(){ 
	var $emptyBoxes = $("#grid").find(".box:empty");
	if($emptyBoxes.length === 0){
		for(var i=Fom.rankMap.length-1; i>=0; i--){
			if(Fom.score >= Fom.rankMap[i][0]){
				alert("You earned the rank " + Fom.rankMap[i][1] + "!");
				i=-1;
			}
		}
		return true;
	} else {
		return false;
	}
}

// Fill preview and place random colored bubbles on empty fields on the board
Fom.addThreeBubbles=function(){
	for(var i=0;i<3;i++){
		var $emptyBoxes = $("#grid").find(".box:empty");
		if($emptyBoxes.length>0){
			var box = $emptyBoxes[Math.floor(Math.random()*$emptyBoxes.length)];
			$("#preview .bubble:first-child").detach().appendTo(box);
			Fom.checkRemoval(box);
			Fom.isFull();
		} 
	}
	Fom.fillPreview();
}

Fom.addBubble = function(parent){
	var $newBubble=$(document.createElement("button"));
	$newBubble.prop("type","button");
	$newBubble.css("background","radial-gradient(circle at 10px 15px, "+Fom.colorPicker()+", rgba(0,0,0,0.8))");
	$newBubble.addClass("bubble");
	$newBubble.on("click",Fom.bubbleEvent);
	parent.appendChild($newBubble[0]);
}

Fom.colorPicker=function (){
	var colors=["rgb(221, 14, 48)", "rgb(89, 130, 218)", "rgb(133, 5, 104)", "rgb(4, 109, 16)", "rgb(18, 142, 145)", "rgb(251, 207, 1)","rgb(235, 124, 4)"];
	return colors[Math.floor(Math.random()*colors.length)];
}

// clicking on a bubble adds/resets the animation and enables all empty boxes to be clickable
Fom.bubbleEvent = function(){
	$(".box").css("background-image","url('./tile.jpg')");
	event.stopPropagation();
	$(".bubble").removeClass("selected");
	$(".bubble").removeClass("animated infinite pulse");
	$(event.currentTarget).addClass("selected");
	$(event.currentTarget).addClass("animated infinite pulse");
	$(".box").prop("disabled",true);
	$("#grid").find(".box:empty").prop("disabled",false);
}

// clicking on a box moves the currently selected bubble there if possible
Fom.boxEvent = function(){
	$("#message").html("");
	if(Fom.validMove(event.currentTarget,$(".selected")[0])){
		Fom.finalPath.forEach(function(element){
			$("#"+element).css("background-image","url('./tile_marked.jpg')");
		})
		$(".selected").detach().appendTo(event.currentTarget);
		$(".selected").removeClass("animated infinite pulse");
		$(".selected").removeClass("selected");
		if(!Fom.checkRemoval(event.currentTarget)){Fom.addThreeBubbles();}
		$(".box").prop("disabled",true);
	}
	else{
		$("#message").html("You can't move there.")
	}
}

// Check whether the bubble can reach the target by moving over empty boxes only
Fom.validMove = function(targetBox,bubble){
	var targetId = parseInt(targetBox.id);
	var bubbleId = parseInt($(bubble).parent()[0].id);
	var searching = true;
	var pathPossible = false;
	Fom.distanceArray = [[bubbleId,0]];
	Fom.finalPath=[];

	for(var i=0; i<Fom.distanceArray.length;i++){
		var neighbours = Fom.neighbourMap[Fom.distanceArray[i][0]];
		var addToDistanceArray = [];
		var pathCounter= Fom.distanceArray[i][1]+1;

		for(var j=0; j<neighbours.length; j++) {
			if($("#"+neighbours[j]).children().length<=0){
				addToDistanceArray.push(neighbours[j]);
				for(var k=0; k<Fom.distanceArray.length; k++){
					if(Fom.distanceArray[k][0]===addToDistanceArray[addToDistanceArray.length-1] && Fom.distanceArray[k][1]<=pathCounter){
						addToDistanceArray.pop(); break;
					}
				}
			}
		}

		for(var m=0;m<addToDistanceArray.length;m++){
			if(addToDistanceArray[m]===targetId){ 
				searching = false; 
				pathPossible = true; 
				Fom.tracePath(targetId, Fom.distanceArray); 
				Fom.finalPath.unshift(targetId);
				Fom.finalPath.push(bubbleId);
				return true;
			} else {
				Fom.distanceArray.push([addToDistanceArray[m],pathCounter]);
			}
		}
	}
	return pathPossible; 
}

// Start from targetId and go through distanceArray and find the best path by 
// always going to the one of the neighbours that is closest to the bubble
// stop if you reach the element with length 0 (start bubble)
Fom.tracePath = function(start, distanceArray){
	var neighbours = Fom.neighbourMap[start];
	var length=1000;
	var closestNeighbour=null;
	for(var i=0;i<neighbours.length;i++){
		for(var j=0;j<distanceArray.length;j++){
			if(neighbours[i]===distanceArray[j][0] && distanceArray[j][1]<length){
				length=distanceArray[j][1];
				closestNeighbour=neighbours[i];
			}
		}
	}
	if(length!==0){ Fom.finalPath.push(closestNeighbour);  Fom.tracePath(closestNeighbour, distanceArray)} 
	else{return};
}

// Check whether there are 5 or more connected bubbles and if yes, remove them
Fom.checkRemoval = function (startBox){
	Fom.color = $(startBox).children().css("background");
	// the four dimensions in counter and storage correspond to the four possible
	// directions to get 5 or more: up to down / left to right / 
	// up-left to down right / up right to down left
	var counter = [1,1,1,1];
	var storage = [[],[],[],[]];
	var startId = parseInt(startBox.id);
	var startIdNeighbours = Fom.neighbourMapInclDiagonal[startId];
	var bubbleCount = 0;
	var bubblesRemoved = false;

	var checkForSameColor = function(index, id, neighbour){
		if(!isNaN(neighbour)){
			if( $("#"+neighbour).children().length>0 && $("#"+neighbour).children().css("background")===Fom.color){
				counter[index]++;
				storage[index].push(neighbour);
				// continue checking in the same direction for more bubbles of the same color
				checkForSameColor(index,neighbour, neighbour+(neighbour-id));
			} else {
				return
			}
		}
	}

	// for each of the 4 dimensions check for bubbles of same color as start bubble
	// check both possible directions (e.g. up and down) for each dimension
	for(var i=0; i<counter.length;i++){
		checkForSameColor(i,startId,startIdNeighbours[i*2]);
		checkForSameColor(i,startId,startIdNeighbours[i*2+1]);
	}

	// remove bubbles if more than 5 were found in one or more dimensions
	for(var i=0; i<counter.length;i++){
		if(counter[i]>=5){
			bubblesRemoved=true;
			bubbleCount+=counter[i]-1; //avoid double counting of start bubble
			storage[i].push(parseInt(startBox.id));
			storage[i].forEach(function(element){
				var bubble = $("#"+element).children()[0];
				$(bubble).fadeOut(500, function(){$(bubble).remove();});
			})
		}
	}

	// update score by the correct amount depending on number of bubbles removed
	if(bubbleCount!==0){
		bubbleCount++; //add start bubble to connected bubbles count
		Fom.score+=Fom.scoreMap[bubbleCount];
		$("#score").html(Fom.score);
	}

	return bubblesRemoved;
}