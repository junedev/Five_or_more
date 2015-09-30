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

    var countBefore, boxId;
    var bubble = element.all(by.css(".bubble")).first();

    beforeEach(function() {
      var emptyBoxes = element.all(by.css(".reachable"));

      element.all(by.css(".bubble")).count().then(function(result){
        countBefore = result;
      });

      bubble.click();
      emptyBoxes.count().then(function(result){
        emptyBoxes.get(rand(result)).getId().then(function(id){
          boxId = id.ELEMENT;
        });
      });

      // browser.driver.wait(function(){ if(countBefore && boxId) return true; }, 10000);

    });

    it("changes the place of the bubble", function(){
      var box = element.all(by.css(".box")).get(boxId);
      box.click();
      browser.driver.wait(protractor.until.elementLocated(By.xpath("//li[contains(@id, '" + boxId + "') and count(*)=1]")), 10000);
      expect(box.all(by.css(".bubble")).count()).to.eventually.equal(1);
    });

    it("adds 3 bubbles after the movement", function(){
      var box = element.all(by.css(".box")).get(boxId);
      box.click();
      browser.driver.wait(protractor.until.elementLocated(By.xpath("//li[contains(@id, '" + boxId + "') and count(*)=1]")), 10000);
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

      bubble.click().then(function(){
        var emptyBox = element.all(by.css(".reachable")).first();
        emptyBox.click();
      });
      expect(element.all(by.css(".bubble")).count()).to.eventually.equal(81);
    });
  });
});

function rand(max){
  return Math.floor(Math.random()*max);
}