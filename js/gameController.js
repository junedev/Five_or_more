angular.module("fiveApp")
.controller("GameController",GameController);

GameController.$inject = ["Game"];

function GameController(Game){
  var self = this;
  var game = new Game();
  self.score = 0;
  self.activeBubble = null;
  self.boxes = game.boxes;
  self.preview = game.preview;

  self.select = function(index){
    self.activeBubble = index;
  }

  self.move = function(index){
    game.moveBubble(self.activeBubble, index);
    self.score += game.getScore(index);
    self.activeBubble = null;
  }
}