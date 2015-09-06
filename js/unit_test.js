var expect = chai.expect;

describe("GameController", function() {
  beforeEach(module('fiveApp'));
  var $controller;
  beforeEach(inject(function(_$controller_){
    $controller = _$controller_;
  }));

  describe("setup field", function() {
    var scope, controller;
    beforeEach(function() {
      scope = {};
      controller = $controller('GameController as game', { $scope: scope });
    });

    it("has 81 boxes", function() {
      expect(scope.game.boxes.length).to.equal(81);
    });

    it("has 3 bubbles in preview", function(){
      expect(scope.game.preview.length).to.equal(3);
    });

    it("has 3 bubbles on the field", function(){
      var counter = 0;
      for(var i=0; i<scope.game.boxes.length; i++){
        if(scope.game.boxes[i]) counter++;
      }
      expect(counter).to.equal(3);
    });

    it("has no bubble selected", function(){
      expect(scope.game.activeBubble).to.not.exist;
    })
  });

});