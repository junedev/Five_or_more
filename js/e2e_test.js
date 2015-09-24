var chai = require("./vendor/chai.js")
var chaiAsPromised = require("./vendor/chai-as-promised.js");
chai.use(chaiAsPromised);
var expect = chai.expect;

describe("Simple Game Play", function() {
  before(function() {
    browser.get('http://localhost:8000/home.html');
  });

  describe("fresh board", function() {
    it("has 81 boxes", function(){
      var e = element.all(by.tagName("li"));
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

  describe("moving a bubble", function(){

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
      var e = element.all(by.css(".bubble")).first();
      var box = element.all(by.css(".box")).get(boxId);
      e.click();
      box.click();
      expect(box.all(by.css(".bubble")).count()).to.eventually.equal(1);
    });

    it("adds 3 bubbles after the movement", function(){
      var e = element.all(by.css(".bubble")).last();
      var box = element.all(by.css(".box")).last();
      e.click();
      box.click();
      expect(element.all(by.css(".bubble")).count()).to.eventually.equal(countBefore+3);
    });
  });

});

function rand(max){
  return Math.floor(Math.random()*max);
}