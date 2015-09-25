angular.module("fiveApp")
.service("Game",GameConstructor);

function GameConstructor(){

  function Game(){
    var self = this;
    self.boxes = new Array(9*9);
    self.preview = [];
    self.fillPreview();
    self.placeBubbles();
  }

  Game.prototype.fillPreview = function(){
    for(var i=0; i<3; i++){
      this.preview.push(colorPicker());
    }
  }

  Game.prototype.placeBubbles = function(){
    for(var i=0; i<3; i++){
      var color = this.preview.shift();
      this.boxes[this.randomEmptyBox()] = color;
    }
    this.fillPreview();
  }

  Game.prototype.moveBubble = function(fromIndex, toIndex){
    var color = this.boxes[fromIndex];
    this.boxes[fromIndex] = null;
    this.boxes[toIndex] = color;
    this.placeBubbles();
  }

  Game.prototype.randomEmptyBox = function(){
    var indexOfEmptyBoxes = [];
    for(var i=0; i<this.boxes.length; i++){
      if(!this.boxes[i]) indexOfEmptyBoxes.push(i);
    }
    return indexOfEmptyBoxes[Math.floor(Math.random()*indexOfEmptyBoxes.length)];
  }

  Game.prototype.getScore = function(currentIndex){
    var self = this;
    var color = self.boxes[currentIndex];
    var score = 0;

    // the four dimensions storage correspond to the four possible
    // directions to get 5 or more
    var storage = [[],[],[],[]];
    var currentNeighbours = allNeighbours(currentIndex);
    var bubbleCount = 0;

    // for each of the 4 dimensions check for bubbles of same color as start bubble
    // check both possible directions (e.g. up and down) for each dimension
    for(var i=0; i<storage.length;i++){
      checkForSameColor(i,currentIndex,currentNeighbours[i*2]);
      checkForSameColor(i,currentIndex,currentNeighbours[i*2+1]);
    }

    function checkForSameColor(dim, currentIndex, neighbour){
      if(!isNaN(neighbour) && color==self.boxes[neighbour]){
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
    for(var i=0; i<storage.length; i++){
      if(storage[i].length >= 4){
        bubblesRemoved = true;
        bubbleCount += storage[i].length;
        storage[i].push(currentIndex);
        storage[i].forEach(function(index){
          self.boxes[index] = null;
        });
      }
    }

    // update score by the correct amount depending on number of bubbles removed
    if(bubbleCount!==0){
      bubbleCount++; //add initial bubble to bubbles count
      score += scoreMap[bubbleCount];
    }

    return score;
  }


  // ------- HELPER METHODS --------

  function colorPicker(){
    var colors=["#06AED5", "#086788", "#F0C808", "#FFF1D0", "#DD1C1A", "#253031","#E9724C"];
    return colors[Math.floor(Math.random()*colors.length)];
  }

  var scoreMap = (function(){
    var add = 2;
    result = [];
    result[5] = 10;
    // score formula reverse engineered from original game
    for(var i=6; i<=13; i++){
      result[i] = add + result[i-1];
    }
    return result;
  })();

  // directions hard-coded since for loop wouldn't give the exact order needed
  DIRECTIONS = [[0,-1],[0,1],[-1,0],[1,0],[-1,-1],[1,1],[-1,1],[1,-1]];

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
    return coordinates.map(function(coord){ return toIndex(coord) });
  }

  // get index of neighbours of a box excl. the diagonal ones and empty elements
  function neighbours(i){
    return allNeighbours(i).splice(0,4).filter(function(i){ return !!i });
  }

  function toCoordinate(index){
    return [parseInt(index/9), index%9]
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
  
  return Game;
}
