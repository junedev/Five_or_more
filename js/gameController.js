'use strict';

angular.module("fiveApp")
.controller("GameController",GameController);

GameController.$inject = ["Game","$scope"];

function GameController(Game,$scope){
  var self = this;
  self.score = 0;
  self.activeBubble = null;
  self.boxes = Game.boxes;
  self.preview = Game.preview;
  self.message = "";

  self.select = function(index){
    self.activeBubble = index;
  }

  self.move = function(index){
    if(Game.getPath(self.activeBubble, index)){
      var currentBubble = self.activeBubble;
      self.message = "";
      self.activeBubble = null;
      //self.score += Game.getScore(index);
      self.animate();
    } else {
      self.message = "This bubble can't move here."
    }
  }

  self.animate = function(){
    var bubble = angular.element("#bubble"+Game.finalPath[0]);
    var boxSize = 51;

    for(var i=0; i<Game.finalPath.length-1; i++){
      var currentId = Game.finalPath[i];
      var nextId = Game.finalPath[i+1];

      switch(currentId - nextId){
        case 1: 
          bubble.animate({left:"-="+boxSize},100);
          break;
        case -1:
          bubble.animate({left:"+="+boxSize},100);
          break;
        case 9:
          bubble.animate({top:"-="+boxSize},100);
          break;
        case -9:
          bubble.animate({top:"+="+boxSize},100);
          break;
      }
    }
    bubble.promise().done(function(){
      Game.moveBubble(Game.finalPath[0], Game.finalPath[Game.finalPath.length-1]);
      $scope.$apply();
    });
  }
}