'use strict';

angular.module("fiveApp")
.controller("GameController",GameController);

GameController.$inject = ["Game"];

function GameController(Game){
  var self = this;
  self.score = 0;
  self.activeBubble = null;
  self.boxes = Game.boxes;
  self.preview = Game.preview;

  self.select = function(index){
    self.activeBubble = index;
  }

  self.move = function(index){
    Game.moveBubble(self.activeBubble, index);
    self.score += Game.getScore(index);
    self.activeBubble = null;
  }
}