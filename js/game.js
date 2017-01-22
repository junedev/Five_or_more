(function(){
  'use strict';

  angular.module("fiveApp")
  .service("Game",Game);

  function Game(){
    var self = this;
    self.score = 0;
    self.boxes = new Array(9*9);
    self.preview = [];
    self.distanceArray = [];
    self.finalPath = [];
    self.stopGame = false;

    self.fillPreview();
    self.placeBubbles();
  }

  Game.prototype.fillPreview = function(){
    for(var i=0; i<3; i++){
      this.preview.push(colorPicker());
    }
  };

  Game.prototype.placeBubbles = function(){
    for(var i=0; i<3; i++){
      var boxIndex = this.randomEmptyBox();

      if(boxIndex !== false){
        var color = this.preview.shift();
        this.boxes[boxIndex] = color;
        this.score += this.getScore(boxIndex);
      }

      if(boxIndex === false || getEmptyBoxes(this.boxes).length < 1){
        this.stopGame = true;
        return;
      }
    }
    this.fillPreview();
  };

  Game.prototype.randomEmptyBox = function(){
    var emptyBoxes = getEmptyBoxes(this.boxes);
    if(emptyBoxes.length < 1) return false;
    return emptyBoxes[Math.floor(Math.random()*emptyBoxes.length)];
  };

  Game.prototype.moveBubble = function(fromIndex, toIndex){
    this.boxes[toIndex] = this.boxes[fromIndex];
    this.boxes[fromIndex] = null;
    var scoreUpdate = this.getScore(toIndex);
    this.score += scoreUpdate;
    if(scoreUpdate === 0) this.placeBubbles();
  };

  Game.prototype.getScore = function(currentIndex){
    var self = this;
    var color = self.boxes[currentIndex];
    var score = 0;
    var currentNeighbours = allNeighbours(currentIndex);
    var bubbleCount = 0;
    var i;

    // the four dimensions storage correspond to the four possible
    // directions to get 5 or more
    var storage = [[],[],[],[]];

    // for each of the 4 dimensions check for bubbles of same color as start bubble
    // check both possible directions (e.g. up and down) for each dimension
    for(i=0; i<storage.length; i++){
      checkForSameColor(i,currentIndex,currentNeighbours[i*2]);
      checkForSameColor(i,currentIndex,currentNeighbours[i*2+1]);
    }

    function checkForSameColor(dim, currentIndex, neighbour){
      if(neighbour!==null && color==self.boxes[neighbour]){
        storage[dim].push(neighbour);
        // continue checking in the same direction for more bubbles of the same color
        // if the next candidate is a valid neighbour
        var next = neighbour + (neighbour - currentIndex);
        if(allNeighbours(neighbour).indexOf(next)>-1){
          checkForSameColor(dim, neighbour, next);
        }
      }
    }

    // remove bubbles if more than 5 were found in one or more dimensions
    for(i=0; i<storage.length; i++){
      if(storage[i].length >= 4){
        bubbleCount += storage[i].length;
        storage[i].push(currentIndex);
        storage[i].forEach(resetBox);
      }
    }

    function resetBox(index){
      self.boxes[index] = null;
    }

    // update score by the correct amount depending on number of bubbles removed
    if(bubbleCount!==0){
      bubbleCount++; //add initial bubble to bubbles count
      score += scoreMap[bubbleCount];
    }

    return score;
  };

  Game.prototype.fillPath = function(bubbleId, targetId){
    this.finalPath = [];
    if(this.pathPossible(bubbleId, targetId)){
      this.fillPathArray(targetId);
      this.finalPath.unshift(targetId);
      this.finalPath.push(bubbleId);
      this.finalPath.reverse();
      return true;
    } else {
      return false;
    }
  };

  Game.prototype.pathPossible = function(bubbleId, targetId){
    var i,j;
    var self = this;
    self.distanceArray = [[bubbleId,0]];
    function checkNeighbourDistances(neighbour){
      if(!self.boxes[neighbour] && !self.distanceArray.some(neighbourIncluded)) addToDistanceArray.push(neighbour);
      function neighbourIncluded(element){
        return element[0]===neighbour && element[1]<=currentDistance;
      }
    }

    // Path-finding using Dijkstra's algorithm (see https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm)
    // Has to be done with for-loops as forEach can't work on arrays that change size
    for(i=0; i<self.distanceArray.length; i++){
      var currentNeighbours = neighbours(self.distanceArray[i][0]);
      var addToDistanceArray = [];
      var currentDistance = self.distanceArray[i][1]+1;

      currentNeighbours.forEach(checkNeighbourDistances);

      for(j=0;j<addToDistanceArray.length;j++){
        if(addToDistanceArray[j]===targetId){
          return true;
        } else {
          self.distanceArray.push([addToDistanceArray[j],currentDistance]);
        }
      }
    }
    return false;
  };

  // Start from targetId and go through distanceArray and find the best path by 
  // always going to the neighbour that is closest to the bubble
  // stop if you reach the element with length 0 (bubble position)
  Game.prototype.fillPathArray = function(currentId){
    var currentNeighbours = neighbours(currentId);
    var distance = 1000;
    var closestNeighbour;
    for(var i=0; i<currentNeighbours.length; i++){
      for(var j=0; j<this.distanceArray.length; j++){
        if(currentNeighbours[i]===this.distanceArray[j][0] && this.distanceArray[j][1]<distance){
          distance = this.distanceArray[j][1];
          closestNeighbour = currentNeighbours[i];
        }
      }
    }
    if(distance === 0){
      return true;
    } else{
      this.finalPath.push(closestNeighbour); 
      this.fillPathArray(closestNeighbour);
    }
  };

  // ------- INDEPENDENT HELPER METHODS --------

  function colorPicker(){
    var colors=["#06AED5", "#086788", "#F0C808", "#FFF1D0", "#DD1C1A", "#253031","#E9724C"];
    return colors[Math.floor(Math.random()*colors.length)];
  }

  var scoreMap = (function(){
    var add = 2;
    var result = [];
    result[5] = 10;
    // score formula reverse engineered from original game
    for(var i=6; i<=13; i++){
      result[i] = add + result[i-1];
      add += 4;
    }
    return result;
  })();

  function getEmptyBoxes(array){
    var emptyBoxes = [];
    for(var i=0; i<array.length; i++){
      if(!array[i]) emptyBoxes.push(i); //not operator is ok since array elements are never 0
    }
    return emptyBoxes;
  }

  // directions hard-coded since for loop wouldn't give the exact order needed
  var DIRECTIONS = [[0,-1],[0,1],[-1,0],[1,0],[-1,-1],[1,1],[-1,1],[1,-1]];

  // get index of neighbours of a box incl. the diagonal ones
  // fixed order of direction, includes null if no neighbour exists
  function allNeighbours(i){
    var x = toCoordinate(i)[0];
    var y = toCoordinate(i)[1];
    var coordinates = [];
    DIRECTIONS.forEach(function(direction){
      var newCoord = [x+direction[0], y+direction[1]];
      if(isOnGrid(newCoord)){
        coordinates.push(newCoord);
      } else {
        coordinates.push(null);
      }
    });
    return coordinates.map(function(coord){ return toIndex(coord); });
  }

  // get index of neighbours of a box excl. the diagonal ones and empty elements
  function neighbours(i){
    return allNeighbours(i).splice(0,4).filter(function(i){ return i!==null; });
  }

  function toCoordinate(index){
    return [parseInt(index/9), index%9];
  }

  function toIndex(coordinate){
    if(!coordinate) return null;
    return coordinate[0]*9+coordinate[1];
  }

  function isOnGrid(coord){
    var x = coord[0];
    var y = coord[1];
    return ((x >= 0 && y >= 0) && x < 9) && y < 9;
  }

})();