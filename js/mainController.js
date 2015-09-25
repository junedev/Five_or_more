angular.module("fiveApp")
.controller("MainController",MainController);

MainController.$inject = ["Score"];

function MainController(Score){
  var self = this;
  self.newScore = {};
  // self.scores = Score.all;

  // self.addScore = function(){
  //   Score.create(self.newScore).then(function(){
  //     self.newScore = {};
  //   })
  // }
}