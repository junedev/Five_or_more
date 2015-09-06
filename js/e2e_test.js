var chai = require("./vendor/chai.js")
var expect = chai.expect;

describe("GameController", function() {
  browser.get('http://localhost:8000/home.html');
  // beforeEach(module('fiveApp'));
  // var $controller;
  // beforeEach(inject(function(_$controller_){
  //   $controller = _$controller_;
  // }));

  describe("setup field", function() {
    // var scope, controller;
    // beforeEach(function() {
    //   scope = {};
    //   controller = $controller('GameController as game', { $scope: scope });
    // });

    it("has 81 boxes", function() {
      expect(game.boxes.length).to.equal(81);
    });

    it("has 3 bubbles in preview", function(){
      expect(game.preview.length).to.equal(3);
    });

    it("has 3 bubbles on the field", function(){
      var counter = 0;
      for(var i=0; i<scope.game.boxes.length; i++){
        if(scope.game.boxes[i]) counter++;
      }
      expect(counter).to.equal(3);
    });

  });

  describe("simple actions on field", function() {
    var scope, controller, spy;
    beforeEach(function() {
      // scope = {};
      // controller = $controller('GameController as game', { $scope: scope });
      spy = sinon.spy(scope.game, "move");
    });

    it("has no bubble selected before a click", function(){
      expect(scope.game.activeBubble).to.not.exist;
    })

    it("empty boxes are not clickable before there is a bubble selected", function(done){
      console.log(scope.game.boxes);
      $("li#1").click();
      expect(spy.called).to.equal(false);
      done();
    })

    it("has a bubble selected after click on bubble", function(){
      //$("div#"+box).click();
      expect(scope.game.activeBubble).to.exist;
    })

  })
});