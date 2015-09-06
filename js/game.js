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
  }

  Game.prototype.randomEmptyBox = function(){
    var indexOfEmptyBoxes = [];
    for(var i=0; i<this.boxes.length; i++){
      if(!this.boxes[i]) indexOfEmptyBoxes.push(i);
    }
    return indexOfEmptyBoxes[Math.floor(Math.random()*indexOfEmptyBoxes.length)];
  }

  return Game;

}

function colorPicker(){
  var colors=["#06AED5", "#086788", "#F0C808", "#FFF1D0", "#DD1C1A", "#253031","#E9724C"];
  return colors[Math.floor(Math.random()*colors.length)];
}