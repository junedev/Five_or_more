/*jshint expr: true*/

var chai = require("./vendor/chai.js");
var chaiAsPromised = require("./vendor/chai-as-promised.js");
chai.use(chaiAsPromised);
var expect = chai.expect;

describe("Game setup and simple actions:", function() {
  before(function() {
    browser.get('http://localhost:8000/home.html');
  });

  describe("Initial board", function() {
    it("has 81 boxes", function(){
      var e = element.all(by.className("box"));
      expect(e.count()).to.eventually.equal(81);
    });

    it("has 3 bubbles", function(){
      var e = element.all(by.css(".bubble"));
      expect(e.count()).to.eventually.equal(3);
    });

    it("has activated bubble after clicking on it", function(){
      var e = element.all(by.css(".bubble")).first();
      e.click();
      expect(e.getAttribute("class")).to.eventually.equal("bubble animated infinite ng-scope pulse");
    });
  });

  describe("Moving a bubble", function(){

    var countBefore, boxId, color;
    var bubble = element.all(by.css(".bubble")).first();

    beforeEach(function() {
      var emptyBoxes = element.all(by.css(".reachable"));

      element.all(by.css(".bubble")).count().then(function(result){
        countBefore = result;
      });

      bubble.getCssValue("background-color").then(function(result){
        color = result;
      });

      bubble.click();
      emptyBoxes.count().then(function(result){
        emptyBoxes.get(rand(result)).getAttribute("id").then(function(id){
          boxId = parseInt(id);
        });
      });

    });

    it("changes the place of the bubble", function(){
      var box = element.all(by.css(".box")).get(boxId);
      box.click();
      browser.driver.wait(protractor.until.elementLocated(By.id("bubble"+boxId)), 10000);
      expect(element(by.id("bubble"+boxId)).getCssValue("background-color")).to.eventually.equal(color);
    });

    it("adds 3 bubbles after the movement", function(){
      var box = element.all(by.css(".box")).get(boxId);
      box.click();
      browser.driver.wait(protractor.until.elementLocated(By.id("bubble"+boxId)), 10000);
      expect(element.all(by.css(".bubble")).count()).to.eventually.equal(countBefore+3);
    });
  });

});

describe("Game play until end of game:", function() {

  before(function() {
    browser.get('http://localhost:8000/home.html');
  });

  describe("Full board", function(){

    it("has 81 bubbles", function(){
      var bubbles = element.all(by.css(".bubble"));
      var boxes = element.all(by.css(".reachable"));

      // Select a random bubble, move it to the first reachable box
      // If the bubble can't move, select another one
      function makeMove(){
        bubbles.count().then(function(result){
          bubbles.get(rand(result)).click();
          boxes.count().then(function(numberOfBoxes){
            if(numberOfBoxes > 0){
              var box = boxes.first();
              box.getAttribute("id").then(function(boxId){
                box.click();
                browser.driver.wait(protractor.until.elementLocated(By.id("bubble"+boxId)), 10000);
              });
            } else {
              makeMove();
            }
          });
        });        
      }

      for (var i = 0; i < 26; i++) {
        makeMove();
      }

      expect(element.all(by.css(".bubble")).count()).to.eventually.equal(81);
    });

    it("shows dialog box", function(){
      expect(element(by.css("#inputField")).isDisplayed()).to.eventually.be.true;
    });

    it("dialog box shows error when name is missing", function(){
      expect(element.all(by.css(".error")).get(0).isDisplayed()).to.eventually.be.false;
      element(by.buttonText("Submit")).click();
      expect(element.all(by.css(".error")).get(0).isDisplayed()).to.eventually.be.true;
    });

    it("dialog box shows error when name is too long", function(){
      expect(element.all(by.css(".error")).get(1).isDisplayed()).to.eventually.be.false;
      element(by.css("input")).sendKeys("ThisIsTooLongForANameInThisApp");
      element(by.buttonText("Submit")).click();
      expect(element.all(by.css(".error")).get(1).isDisplayed()).to.eventually.be.true;
    });

    // // Only works if there are less than 15 high scores
    // xit("adds high score to database", function(){
    //   element.all(by.repeater("entry in game.scores")).count().then(function(countBefore){
    //     element(by.css("input")).sendKeys("Stupid_Robot");
    //     element(by.buttonText("Submit")).click();
    //     expect(element.all(by.repeater("entry in game.scores")).count()).to.eventually.equal(countBefore+1);
    //   });
    // });

    it("resets the game after a button in the dialog box was clicked", function(){ 
      element(by.buttonText("Cancel")).click();
      browser.waitForAngular();
      expect(element.all(by.css(".bubble")).count()).to.eventually.equal(3);
    });

  });

});

function rand(max){
  return Math.floor(Math.random()*max);
}