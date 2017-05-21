(function main() {
  'use strict';

  angular.module('fiveApp')
    .controller('GameController', GameController);

  GameController.$inject = ['Game', 'Score', '$scope', '$window'];

  function GameController(Game, Score, $scope, $window) {
    var self = this;
    self.scores = Score.all;
    self.score = Game.score;
    self.activeBubble = null;
    self.boxes = Game.boxes;
    self.preview = Game.preview;
    self.message = '';
    self.stopGame = Game.stopGame;
    self.newScore = { score: 0, name: '' };

    $scope.$watch(function update() {
      self.boxes = Game.boxes;
      self.stopGame = Game.stopGame;
      self.score = Game.score;
    });

    self.select = function select(index) {
      self.message = '';
      self.activeBubble = index;
    };

    self.cancel = function cancel() {
      $window.location.reload();
    };

    self.submit = function submit() {
      self.newScore.score = self.score;
      Score.create(self.newScore).then(function afterSave() {
        self.cancel();
      });
    };

    self.boxReachable = function boxReachable(targetId) {
      if (self.activeBubble === null) return false;
      return Game.pathPossible(self.activeBubble, targetId);
    };

    self.move = function move(index) {
      if (self.activeBubble === null) return false;
      if (Game.fillPath(self.activeBubble, index)) {
        self.activeBubble = null;
        self.message = '';
        self.animate();
        return true;
      }
      self.message = "This bubble can't move there.";
      return false;
    };

    self.animate = function animate() {
      var bubble = angular.element('#bubble' + Game.finalPath[0]);
      var boxSize = 51;
      var currentId;
      var nextId;
      var options;
      var i;

      for (i = 0; i < Game.finalPath.length - 1; i++) {
        currentId = Game.finalPath[i];
        nextId = Game.finalPath[i + 1];
        options = {};

        switch (currentId - nextId) {
          case 1:
            options = { left: '-=' + boxSize };
            break;
          case -1:
            options = { left: '+=' + boxSize };
            break;
          case 9:
            options = { top: '-=' + boxSize };
            break;
          case -9:
            options = { top: '+=' + boxSize };
            break;
          default:
            throw new Error('Invalid move.');
        }
        bubble.animate(options, 100);
      }

      bubble.promise().done(function doMove() {
        var targetPosition = Game.finalPath[Game.finalPath.length - 1];
        Game.moveBubble(Game.finalPath[0], targetPosition);
        $scope.$apply();
      });
    };
  }
})();
