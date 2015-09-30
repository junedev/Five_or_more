var chai = require("../js/vendor/chai.js")
var chaiAsPromised = require("../js/vendor/chai-as-promised.js");
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

  var countArray = Array.apply(null, {length: 4}).map(Number.call, Number);

  before(function() {
    browser.get('http://localhost:8000/home.html');
  });

  describe("Full board", function(){

    xit("has 81 bubbles", function(){
      var bubble = element.all(by.css(".bubble")).first();
      bubble.click();
      var emptyBox = element.all(by.css(".reachable")).first();

      emptyBox.getAttribute("id").then(function(boxId){
        emptyBox.click();
        browser.driver.wait(protractor.until.elementLocated(By.id("bubble"+boxId)), 10000);
      });

      expect(element.all(by.css(".bubble")).count()).to.eventually.equal(81);
    });
  });
});

function rand(max){
  return Math.floor(Math.random()*max);
}