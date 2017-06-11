(function main() {
  'use strict';

  var scoreMap = (function scoreMap() {
    var add = 2;
    var result = [];
    var i;
    result[5] = 10;
    // score formula reverse engineered from original game
    for (i = 6; i <= 13; i++) {
      result[i] = add + result[i - 1];
      add += 4;
    }
    return result;
  })();

  var DIRECTIONS = [[0, -1], [0, 1], [-1, 0], [1, 0], [-1, -1], [1, 1], [-1, 1], [1, -1]];

  angular.module('fiveApp')
    .service('Game', Game);

  function Game() {
    this.boxes = new Array(9 * 9).fill(null);
    this.score = 0;
    this.preview = [];
    this.distanceArray = [];
    this.finalPath = [];
    this.stopGame = false;

    this.fillPreview();
    this.placeBubbles();
  }

  Game.prototype.fillPreview = function fillPreview() {
    var i;
    for (i = 0; i < 3 && this.preview.length < 3; i++) {
      this.preview.push(getRandomColor());
    }
  };

  Game.prototype.placeBubbles = function placeBubbles() {
    var i;
    var boxIndex;
    var color;
    for (i = 0; i < 3; i++) {
      boxIndex = this.randomEmptyBox();
      if (boxIndex === null) {
        this.stopGame = true;
        return;
      }
      color = this.preview.shift();
      this.boxes[boxIndex] = color;
      this.score += this.getScore(boxIndex);
    }
    // Check whether here is actually space to move a bubble after placing all 3 bubbles
    if (this.randomEmptyBox() === null) this.stopGame = true;
    this.fillPreview();
  };

  Game.prototype.randomEmptyBox = function randomEmptyBox() {
    var emptyIndexes = [];
    var i;
    for (i = 0; i < this.boxes.length; i++) {
      if (this.boxes[i] === null) emptyIndexes.push(i);
    }
    if (!emptyIndexes.length) return null;
    return emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
  };

  Game.prototype.moveBubble = function moveBubble(fromIndex, toIndex) {
    var scoreUpdate;
    this.boxes[toIndex] = this.boxes[fromIndex];
    this.boxes[fromIndex] = null;
    scoreUpdate = this.getScore(toIndex);
    this.score += scoreUpdate;
    if (!scoreUpdate) this.placeBubbles();
  };

  Game.prototype.getScore = function getScore(currentIndex) {
    var color = this.boxes[currentIndex];
    var score = 0;
    var currentNeighbours = allNeighbours(currentIndex);
    var bubbleCount = 0;
    var i;

    // the four dimensions storage correspond to the four possible
    // directions to get 5 or more
    var storage = [[], [], [], []];

    function checkForSameColor(dim, curIndex, neighbour) {
      var next;
      if (neighbour !== null && color === this.boxes[neighbour]) {
        storage[dim].push(neighbour);
        // continue checking in the same direction for more bubbles of the same color
        // if the next candidate is a valid neighbour
        next = neighbour + (neighbour - curIndex);
        if (allNeighbours(neighbour).indexOf(next) > -1) {
          checkForSameColor.call(this, dim, neighbour, next);
        }
      }
    }
    // for each of the 4 dimensions check for bubbles of same color as start bubble
    // check both possible directions (e.g. up and down) for each dimension
    for (i = 0; i < storage.length; i++) {
      checkForSameColor.call(this, i, currentIndex, currentNeighbours[i * 2]);
      checkForSameColor.call(this, i, currentIndex, currentNeighbours[i * 2 + 1]);
    }

    // remove bubbles if 4 or more neighbours were found
    for (i = 0; i < storage.length; i++) {
      if (storage[i].length >= 4) {
        bubbleCount += storage[i].length;
        storage[i].push(currentIndex);
        storage[i].forEach(function setNull(index) { this.boxes[index] = null; }, this);
      }
    }

    // update score by the correct amount depending on number of bubbles removed
    if (bubbleCount) {
      bubbleCount++; // add initial bubble to bubbles count
      score += scoreMap[bubbleCount];
    }

    return score;
  };

  Game.prototype.fillPath = function fillPath(bubbleId, targetId) {
    this.finalPath = [];
    if (this.pathPossible(bubbleId, targetId)) {
      this.fillPathArray(targetId);
      this.finalPath.unshift(targetId);
      this.finalPath.push(bubbleId);
      this.finalPath.reverse();
      return true;
    }
    return false;
  };

  Game.prototype.pathPossible = function pathPossible(bubbleId, targetId) {
    var i;
    var j;
    var addToDistanceArray;
    var currentNeighbours;
    var currentDistance;
    var self = this;
    self.distanceArray = [[bubbleId, 0]];
    function checkNeighbourDistances(neighbour) {
      if (!self.boxes[neighbour] && !self.distanceArray.some(neighbourIncluded)) addToDistanceArray.push(neighbour);
      function neighbourIncluded(element) {
        return element[0] === neighbour && element[1] <= currentDistance;
      }
    }

    // Path-finding using Dijkstra's algorithm (see https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm)
    // Has to be done with for-loops as forEach can't work on arrays that change size
    for (i = 0; i < self.distanceArray.length; i++) {
      currentNeighbours = neighbours(self.distanceArray[i][0]);
      addToDistanceArray = [];
      currentDistance = self.distanceArray[i][1] + 1;

      currentNeighbours.forEach(checkNeighbourDistances);

      for (j = 0; j < addToDistanceArray.length; j++) {
        if (addToDistanceArray[j] === targetId) {
          return true;
        }
        self.distanceArray.push([addToDistanceArray[j], currentDistance]);
      }
    }
    return false;
  };

  // Start from targetId and go through distanceArray and find the best path by
  // always going to the neighbour that is closest to the bubble
  // stop if you reach the element with length 0 (bubble position)
  Game.prototype.fillPathArray = function fillPathArray(currentId) {
    var currentNeighbours = neighbours(currentId);
    var distance = 1000;
    var closestNeighbour;
    var i;
    var j;
    for (i = 0; i < currentNeighbours.length; i++) {
      for (j = 0; j < this.distanceArray.length; j++) {
        if (currentNeighbours[i] === this.distanceArray[j][0] && this.distanceArray[j][1] < distance) {
          distance = this.distanceArray[j][1];
          closestNeighbour = currentNeighbours[i];
        }
      }
    }
    if (distance === 0) {
      return true;
    }
    this.finalPath.push(closestNeighbour);
    this.fillPathArray(closestNeighbour);
  };

  // ------- INDEPENDENT HELPER METHODS --------

  function getRandomColor() {
    var colors = ['#06AED5', '#086788', '#F0C808', '#FFF1D0', '#DD1C1A', '#253031', '#E9724C'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // get index of neighbours of a box incl. the diagonal ones
  // fixed order of direction, includes null if no neighbour exists
  function allNeighbours(i) {
    var x = toCoordinate(i)[0];
    var y = toCoordinate(i)[1];
    var coordinates = [];
    DIRECTIONS.forEach(function onGrid(direction) {
      var newCoord = [x + direction[0], y + direction[1]];
      if (isOnGrid(newCoord)) {
        coordinates.push(newCoord);
      } else {
        coordinates.push(null);
      }
    });
    return coordinates.map(function toIndex(coord) { return coordToIndex(coord); });
  }

  // get index of neighbours of a box excl. the diagonal ones and empty elements
  function neighbours(i) {
    return allNeighbours(i).splice(0, 4).filter(function notNull(e) { return e !== null; });
  }

  function toCoordinate(index) {
    return [parseInt(index / 9, 10), index % 9];
  }

  function coordToIndex(coordinate) {
    if (!coordinate) return null;
    return coordinate[0] * 9 + coordinate[1];
  }

  function isOnGrid(coord) {
    var x = coord[0];
    var y = coord[1];
    return (x >= 0 && y >= 0) && (x < 9 && y < 9);
  }
})();
