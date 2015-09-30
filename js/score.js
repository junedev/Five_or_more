angular.module("fiveApp")
.factory("Score", ScoreFactory);

ScoreFactory.$inject = ["$firebaseArray","FIREBASE_URL"];

function ScoreFactory($firebaseArray,FIREBASE_URL){
  var ref = new Firebase(FIREBASE_URL);
  var scores = $firebaseArray(ref.child("scores"));

  var Score = {};

  Score.all = scores;

  Score.create = function(score){
    return scores.$add(score);
  };

  // Score.get = function(id){
  //   return $firebase(ref.child("scores").child(id)).$asObject();
  // }

  Score.delete = function(score){
    return scores.$remove(score);
  };

  return Score;
}