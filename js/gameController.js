(function(){
  'use strict';

  angular.module("fiveApp")
  .controller("GameController",GameController);

  GameController.$inject = ["Game", "Score", "$scope", "$window"];

  function GameController(Game, Score, $scope, $window){
    var self = this;
    self.scores = Score.all;
    self.score = Game.score;
    self.activeBubble = null;
    self.boxes = Game.boxes;
    self.preview = Game.preview;
    self.message = "";
    self.stopGame = Game.stopGame;
    self.newScore = { score: self.score, name: "" };
    
    $scope.$watch(function(){
      self.stopGame = Game.stopGame; 
      self.score = Game.score;
    });

    self.select = function(index){
      self.message = "";
      self.activeBubble = index;
    };

    self.cancel = function(){
      $window.location.reload();
    }

    self.submit = function(){
      Score.create(self.newScore).then(function(){
        self.newScore = { score: self.score, name: "" };
        self.cancel();
      });
    }

    self.boxReachable = function(targetId){
      if(self.activeBubble === null) return false;
      return Game.pathPossible(self.activeBubble, targetId);
    };

    self.move = function(index){
      if(self.activeBubble === null ) return false;
      if(Game.fillPath(self.activeBubble, index)){
        self.activeBubble = null;
        self.message = "";
        self.animate();
      } else {
        self.message = "This bubble can't move there.";
      }
    };

    self.animate = function(){
      var bubble = angular.element("#bubble"+Game.finalPath[0]);
      var boxSize = 51;

      for(var i=0; i<Game.finalPath.length-1; i++){
        var currentId = Game.finalPath[i];
        var nextId = Game.finalPath[i+1];
        var options = {};

        switch(currentId - nextId){
          case 1: 
            options = {left:"-="+boxSize};
            break;
          case -1:
            options = {left:"+="+boxSize};
            break;
          case 9:
            options = {top: "-="+boxSize};
            break;
          case -9:
            options = {top: "+="+boxSize};
            break;
        }
        bubble.animate(options, 100);
      }

      bubble.promise().done(function(){
        var targetPosition = Game.finalPath[Game.finalPath.length-1];
        Game.moveBubble(Game.finalPath[0], targetPosition);
        $scope.$apply();
      });
    };
  }
})();