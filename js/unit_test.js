var expect = chai.expect;

describe("GameController", function() {
  beforeEach(module('fiveApp'));
  var $controller;
  beforeEach(inject(function(_$controller_){
    $controller = _$controller_;
  }));

  describe("setup field", function() {
    var controller;
    beforeEach(function() {
      game = $controller('GameController');
    });

    it("has 81 boxes", function() {
      expect(game.boxes.length).to.equal(81);
    });

    it("has 3 bubbles in preview", function(){
      expect(game.preview.length).to.equal(3);
    });

    it("has 3 bubbles on the field", function(){
      var counter = 0;
      for(var i=0; i<game.boxes.length; i++){
        if(game.boxes[i]) counter++;
      }
      expect(counter).to.equal(3);
    });

    it("has no bubble selected", function(){
      expect(game.activeBubble).to.not.exist;
    })
  });

});