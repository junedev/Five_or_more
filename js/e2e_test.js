var chai = require("./vendor/chai.js")
var chaiAsPromised = require("./vendor/chai-as-promised.js");
chai.use(chaiAsPromised);
var expect = chai.expect;

describe("Game Play", function() {
  before(function() {
    browser.get('http://localhost:8000/home.html');
  });

  describe("working field", function() {
    it("has 81 boxes", function(){
      var e = element.all(by.tagName("li"));
      expect(e.count()).to.eventually.equal(81);
    })

    it("has 3 bubbles", function(){
      var e = element.all(by.css(".bubble"));
      expect(e.count()).to.eventually.equal(3);
    })

    it("can activate a bubble by clicking on it", function(){
      var e = element.all(by.css(".bubble")).first();
      e.click();
      expect(e.getAttribute("class")).to.eventually.equal("bubble animated infinite ng-scope pulse");
    })
  });

  describe("moving a bubble", function(){
    var countBefore;
    beforeEach(function() {
      element.all(by.css(".bubble")).count().then(function(result){
        countBefore = result;
      })
    });

    //doesn't work if this comes as second test ...
    it("adds 3 bubbles after moving one around", function(){
      var e = element.all(by.css(".bubble")).first();
      var box = element.all(by.css(".box")).last();
      e.click();
      box.click();
      expect(element.all(by.css(".bubble")).count()).to.eventually.equal(countBefore+3);
    });

    it("changes the place", function(){
      var e = element.all(by.css(".bubble")).first();
      var box = element.all(by.css(".box")).last();
      e.click();
      box.click();
      expect(box.all(by.css(".bubble")).count()).to.eventually.equal(1);
    });

  });

});