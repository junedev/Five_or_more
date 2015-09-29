var chai = require("../js/vendor/chai.js")
var chaiAsPromised = require("../js/vendor/chai-as-promised.js");
chai.use(chaiAsPromised);
var expect = chai.expect;

describe("Simple Game Play", function() {
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

    var countBefore;
    var boxId;

    beforeEach(function() {
      element.all(by.css(".bubble")).count().then(function(result){
        countBefore = result;
      });

      var emptyBoxes = element.all(by.xpath("//li[contains(@class, 'box') and count(*)=0]"));
      emptyBoxes.count().then(function(result){
        emptyBoxes.get(rand(result)).getId().then(function(id){
          boxId = id.ELEMENT;
        });
      });
    });

    it("changes the place of the bubble", function(){
      var bubble = element.all(by.css(".bubble")).first();
      var box = element.all(by.css(".box")).get(boxId);
      bubble.click();
      box.click();
      browser.driver.wait(protractor.until.elementLocated(By.xpath("//li[contains(@id, '" + boxId + "') and count(*)=1]")), 10000);
      expect(box.all(by.css(".bubble")).count()).to.eventually.equal(1);
    });

    it("adds 3 bubbles after the movement", function(){
      var bubble = element.all(by.css(".bubble")).last();
      var box = element.all(by.css(".box")).get(boxId);
      bubble.click();
      box.click();
      browser.driver.wait(protractor.until.elementLocated(By.xpath("//li[contains(@id, '" + boxId + "') and count(*)=1]")), 10000);
      expect(element.all(by.css(".bubble")).count()).to.eventually.equal(countBefore+3);
    });
  });

});

function rand(max){
  return Math.floor(Math.random()*max);
}