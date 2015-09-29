(function(){
  'use strict';

  angular.module("fiveApp")
  .controller("GameController",GameController);

  GameController.$inject = ["Game", "$scope", "ngDialog"];

  function GameController(Game,$scope, ngDialog){
    var self = this;
    self.score = 0;
    self.activeBubble = null;
    self.boxes = Game.boxes;
    self.preview = Game.preview;
    self.message = "";

    $scope.$watch(function(){
      if(Game.stopGame) {
        ngDialog.open({
          template: '<p>Template test</p>',
          plain: true
        });
      }
    });

    self.select = function(index){
      self.message = "";
      self.activeBubble = index;
    };

    self.move = function(index){
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
        self.score += Game.getScore(targetPosition);
      });
    };

    self.boxReachable = function(targetId){
      if(self.activeBubble === null) return false;
      return Game.pathPossible(self.activeBubble, targetId);
    };
  }
})();