angular.module('fiveApp')
  .factory('Score', ScoreFactory);

ScoreFactory.$inject = ['$firebaseArray', 'FIREBASE_URL'];

function ScoreFactory($firebaseArray, FIREBASE_URL) {
  var Score = {};
  var ref = new Firebase(FIREBASE_URL);
  var scores = $firebaseArray(ref.child('scores'));

  Score.all = scores;

  Score.create = function create(score) {
    return scores.$add(score);
  };

  Score.delete = function remove(score) {
    return scores.$remove(score);
  };

  return Score;
}
