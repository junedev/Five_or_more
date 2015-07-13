$(function(){
	console.log("READY");
	Fom.setup();
})

var Fom = Fom || {};

Fom.setup = function(){
	this.size = 9;
	this.neighbourMap = [];
	this.neighbourMapInclDiagonal = null;
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
	this.neighbourMapInclDiagonal=this.neighbourMap;
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
			Fom.checkRemoval(box);
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
	//console.log("box clicked");
	if(Fom.validMove(event.currentTarget,$(".selected")[0])){
		$(event.currentTarget).attr("state","taken");
		$(".selected").parent().attr("state","empty");
		$(".selected").detach().appendTo(event.currentTarget);
		$(".selected").removeClass("selected");
		Fom.checkRemoval(event.currentTarget);
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
	return result; 
}

Fom.checkRemoval = function (startBox){
	Fom.color = $(startBox).children().css("background-color");
	Fom.counter = [1,1,1,1];
	var startId = parseInt(startBox.id);
	var startN = Fom.neighbourMapInclDiagonal[startId];
	var storage = [[],[],[],[]];
	
	var checkColor = function(index, id, neighbour){
		if(!isNaN(neighbour)){
			if( $("#"+neighbour).children().length>0 && $("#"+neighbour).children().css("background-color")===Fom.color){
				console.log(index+" "+id+" "+neighbour);
				Fom.counter[index]++;
				storage[index].push($("#"+neighbour));
				checkColor(index,neighbour, neighbour+(neighbour-id));
				console.log(Fom.counter);
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
			$(startBox).empty();
			$(startBox).attr("state","empty");
			$(storage[i]).each(function(index,element){
				$(element).empty();
				$(element).attr("state","empty");
			});
		}
	}
}

	// var checkLeftN = function(startId,leftNId){
	// 	if(startId%Fom.size!==0 && $("#"+leftNId).children().css("background-color")===color){
	// 		Fom.rowCounter++;
	// 		storage.push($("#"+leftNId)[0]);
	// 		checkLeftN(leftNId,leftNId-1);
	// 	} else {
	// 		return
	// 	}
	// }
	// checkLeftN(startId,startId-1);

	// var checkRightN = function(startId,rightNId){
	// 	if(startId%Fom.size!==Fom.size-1 && $("#"+rightNId).children().css("background-color")===color){
	// 		Fom.rowCounter++;
	// 		storage.push($("#"+rightNId)[0]);
	// 		checkRightN(rightNId,rightNId+1);
	// 	} else {
	// 		return
	// 	}
	// }

	// checkRightN(startId,startId+1);
	// if(Fom.rowCounter>=5){
	// 	$(storage).each(function(i,element){
	// 		$(element).empty();
	// 		$(element).attr("state","empty");
	// 	});
	// }
