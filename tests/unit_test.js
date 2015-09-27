var expect = chai.expect;

describe("Game Controller", function() {
  var $controller, gameCtrl;
  beforeEach(function(){
    module('fiveApp');
    inject(function(_$controller_){
      $controller = _$controller_;
    });
    gameCtrl = $controller('GameController');
  });

  describe("Inital board", function() {

    it("has 81 boxes", function() {
      expect(gameCtrl.boxes.length).to.equal(81);
    });

    it("has 3 bubbles in preview", function(){
      expect(gameCtrl.preview.length).to.equal(3);
    });

    it("has 3 bubbles on the field", function(){
      var counter = 0;
      for(var i=0; i<gameCtrl.boxes.length; i++){
        if(gameCtrl.boxes[i]) counter++;
      }
      expect(counter).to.equal(3);
    });

    it("has no bubble selected", function(){
      expect(gameCtrl.activeBubble).to.not.exist;
    });
  });

  describe("Bubble", function(){

    var i, bubble, emptyBox;
    beforeEach(function(){
      bubble = null;
      emptyBox = null;
      for(i=0; i<gameCtrl.boxes.length; i++){
        if(!emptyBox && !gameCtrl.boxes[i]) emptyBox = i;
        if(gameCtrl.boxes[i]) bubble = i;
        if(bubble && emptyBox) break;
      }
    });

    it("can be selected", function(){
      gameCtrl.select(bubble);
      expect(bubble).to.exist;
      expect(gameCtrl.activeBubble).to.equal(bubble);
    });

    it("can change position", function(){
      var color = gameCtrl.boxes[bubble];
      var targetPosition = emptyBox;
      gameCtrl.select(bubble);
      gameCtrl.move(targetPosition);
      expect(gameCtrl.boxes[targetPosition]).to.equal(color);
      expect(gameCtrl.boxes[bubble]).to.not.exist;
    });

  });

});


describe("Game Service", function(){
  var gameObj;
  beforeEach(function(){
    module('fiveApp');
    inject( function(_Game_){
      gameObj = _Game_;
    });
  });

  describe("Initial board", function(){

    it("has 81 boxes", function() {
      expect(gameObj.boxes.length).to.equal(81);
    });

    it("has 3 bubbles in preview", function(){
      expect(gameObj.preview.length).to.equal(3);
    });

    it("has 3 bubbles on the board", function(){
      var counter = 0;
      for(var i=0; i<gameObj.boxes.length; i++){
        if(gameObj.boxes[i]) counter++;
      }
      expect(counter).to.equal(3);
    });
    
  });

  describe("Scoring", function(){

    var color = "#06AED5";
    beforeEach(function(){
      // remove all bubbles to make sure scoring can be checked under controlled conditions
      gameObj.boxes = new Array(9*9);
    });

    it("removes 5 bubbles in a row and gives 10 points", function(){
      for (var i = 0; i < 4; i++) {
          gameObj.boxes[i] = color;
          expect(gameObj.getScore(i)).to.equal(0);
      }
      gameObj.boxes[4] = color;
      expect(gameObj.getScore(4)).to.equal(10);
    });

    it("removes 7 bubbles in a column and gives 18 points", function(){
      for (var i = 0; i < 7*9; i++) {
        if(i%9===0 && i!=36){
          gameObj.boxes[i] = color;
          expect(gameObj.getScore(i)).to.equal(0);
        }
      }
      gameObj.boxes[36] = color;
      expect(gameObj.getScore(36)).to.equal(18);
    });

    it("removes bubbles in row and diagonal at the same time and scores for both", function(){
      var bubbles = [0, 10, 18, 19, 21, 22, 30, 40];
      bubbles.forEach(function(index){
        gameObj.boxes[index] = color;
        expect(gameObj.getScore(index)).to.equal(0);
      });
      gameObj.boxes[20] = color;
      expect(gameObj.getScore(20)).to.equal(42);
    });

  });

  describe("Bubble path", function(){
    var color = "#06AED5";
    beforeEach(function(){
      // remove all bubbles to make sure scoring can be checked under controlled conditions
      gameObj.boxes = new Array(9*9);
    });

    it("cannot enter enclosed area", function(){
      var bubbles = [0, 1, 10, 18];
      bubbles.forEach(function(index){
        gameObj.boxes[index] = color;
      });
      gameObj.moveBubble(1,9);
      expect(gameObj.boxes[9]).to.not.exist;
    });

  });
  
});