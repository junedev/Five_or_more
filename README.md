# Five or more/ Colorlines
<i>1-2 weeks project - started July 10, 2015</i>

https://color-lines.herokuapp.com

![Screenshot](./screenshot.png)

## Description
The game consists of a board of 9*9 sqaures and bubbles that come in 6 different colors.
At the start of the game 3 bubbles are already placed on the board.
You can click on one of the bubbles and click on an empty square where you want the bubble to go.
The bubble can only move there if there if the path is not blocked by other bubbles (the bubble can not move diagonally).
After every bubble movement the computer places 3 more random colored bubbles to random empty squares on the board.
A preview always shows the colors of the bubbles that will come up next.
If you manage to get 5 or more bubbles of the same color in a line (row/column/diagonal) they are removed from the field and you earn points. The more bubbles you remove at once, the more points you get.
After you managed to get points you can move another bubble without the PC adding more bubbles beforehand.
If the whole board is full the game ends and you can add your name and score to the high score list.

## Inspiration
This game was part of the GNOME game package shipped with older versions of my LINUX distribution <a href="http://www.ubuntu.com/" target="_blanck">Ubuntu</a>.
The game sounds a bit boring when you read the description but it can be quite fun once you started playing. You can also see that in the <a href="https://apps.ubuntu.com/cat/applications/precise/glines/" target="_blanck">comments</a> in the Ubuntu app directory where people complain that they were hooked on the game but now it is not supported any more.

## Methods and Algorithms

### Recursion
After every move (either by the player or via placement of a random bubble) the app has to check whether a line or even two lines of five or more bubbles were created. This is done via recursion starting with the bubble that was just moved to `currentIndex`.
Lines can be horizontal, vertical or one of the two diagonal directions. Let us walk through the case of looking for a horizonal line. We have to check whether the bubbles above or below `currentIndex` have the same color. `currentNeighbours` contains all neighbouring boxes for the current bubble in a defined order. If there is no box the element is null. So the box below the current bubble can be found in `currentNeighbours[0]`, the one above in `currentNeighbours[1]`. So we start by running `checkForSameColor` for those two and pass the current direction (horizontal, represented by 0) as an argument. In case a bubble with the same color is found we save the index in `storage` and contiue checking in the same direction by calling `checkForSameColor` again. Later we can remove all those bubbles where the storage array is long enough and score the appropriate points.

```javascript
var storage = [[],[],[],[]];
for(i=0; i<storage.length; i++){
  checkForSameColor(i,currentIndex,currentNeighbours[i*2]);
  checkForSameColor(i,currentIndex,currentNeighbours[i*2+1]);
}

function checkForSameColor(dim, currentIndex, neighbour){
  if(neighbour!==null && color==self.boxes[neighbour]){
    storage[dim].push(neighbour);
    // continue checking in the same direction if next is valid
    var next = neighbour + (neighbour - currentIndex);
    if(allNeighbours(neighbour).indexOf(next)>-1){
      checkForSameColor(dim, neighbour, next);
    }
  }
}
```

### Pathfinding
Although it would be quite an easy exercise to just check whether a bubble can reach a certain box, for a proper movement animation a sensible path from start to target box is necessary. I used an implementation of <a href="https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm" target="_blanck">Dijkstra's algorithm</a> for that purpose. The algorithm consists of two parts. First, an array `distanceArray` is recusivly filled with empty neighbouring squares and their distance from the starting point. Since `distanceArray` changes while going through its elements, JavaScript's `forEach` cannot be used for the implementation. That is why good old for loops have to step in, see code example. Once the target is included in the array the process stops. It is now clear that a path to the target is possible. In the second part of the algorithm the shortest possible path between start and end point can be extracted from `distanceArray`. This is done by checking which neighbour has the lowest distance value attached and always moving along those (see function `fillPathArray` in `Game.js` in the repository).

```javascript
Game.prototype.pathPossible = function(bubbleId, targetId){
  var i,j;
  var self = this;
  self.distanceArray = [[bubbleId,0]];

  function checkNeighbourDistances(neighbour){
    function neighbourIncluded(element){
      return element[0]===neighbour && element[1]<=currentDistance;
    }

    if( !self.boxes[neighbour] && !self.distanceArray.some(neighbourIncluded) ){
      addToDistanceArray.push(neighbour);
    }
  }

  for(i=0; i<self.distanceArray.length; i++){
    var currentNeighbours = neighbours(self.distanceArray[i][0]);
    var addToDistanceArray = [];
    var currentDistance = self.distanceArray[i][1]+1;

    currentNeighbours.forEach(checkNeighbourDistances);

    for(j=0; j<addToDistanceArray.length; j++){
      if(addToDistanceArray[j]===targetId){
        return true;
      } else {
        self.distanceArray.push([addToDistanceArray[j],currentDistance]);
      }
    }
  }
  return false;
};
```

## Front-end
### JavaScript code
This project is build with <a href="https://angularjs.org/" target="_blanck">AngularJS</a>. The `gameController` handles the user interaction. It has two other components injected. A factory called `Score` which represents the Score resource and provides the link the database. The other component is the `Game` service. It contains all the game logic and provides the board array, score and a trigger for the end of the game to the controller.
<br>
Additionally, I had to include jQuery. I could not find a good solution for creating the movement animation along the path array with ngAnimate hooks. I ended up using jQuery's convenient animate function instead.

### Markup
In terms of the HTML thanks to Angular the complete game board incl. bubbles is just a couple of (arguably not very pretty) lines. The list items for the squares are created by `ng-repeat`. The styling ensures that the board and the squares always have the correct size. If `box` has a truthy value (a color value) a div is added inside the square for the bubble. The color is then applied via inline styling. The IDs on the boxes and bubbles are not strictly neccessary for the functionality. I added them to ease implementation of the Protractor tests.

```html
<ul id="grid">
  <li ng-repeat="box in game.boxes track by $index" class="box" 
  id="{{$index}}" ng-click="!box && game.move($index)" 
  ng-class="{reachable: game.boxReachable($index)}">

    <div ng-if="box" class="bubble animated infinite" 
    ng-class="{pulse: (game.activeBubble===$index)}" 
    style="background-color:{{box}}" ng-click="game.select($index)" 
    id="bubble{{$index}}"></div>

  </li>
</ul>
```

### Styling
In the current version only plain CSS is used and the styling is not reponsive. 
<a href="https://daneden.github.io/animate.css/" target="_blanck">Animate.css</a> is used for the pulse effect on the selected bubble.

## Back-end
### Framework
None. &#9786; By adding a file called `index.php` with the single line `<?php include_once('home.html'); ?>` Heroku is tricked into setting up a PHP/Apache app to serve our single page `home.html`.

### Database
<a href="https://www.firebase.com/" target="_blanck">Firebase</a> is used to store the high scores. This is done very conveniently using <a href="https://www.firebase.com/docs/web/libraries/angular/" target="_blanck">Angular Fire</a>. Similar to "ngResource" it comes with "all/query", "add", "save" functionality. But on top it allows for 3-way data-binding for arrays and objects.

## Testing
### Unit tests
<a href="http://karma-runner.github.io/" target="_blanck">Karma</a> is used as a test-runner the unit tests as it is recommended by the Angular team. The unit test are run with <a href="https://mochajs.org" target="_blanck">Mocha</a> using it's BDD style interface.
Mocha is combined with <a href="http://chaijs.com/" target="_blanck">Chai</a> as assertion library, more specifically the `expect` version.

### E2E tests
As recommended E2E tests are done with <a href="https://angular.github.io/protractor/" target="_blanck">Protractor</a> as test-runner. It is based on Selenium Webdriver but extends the commands with some angular specific ones, e.g. for accessing ng-repeat elements via the repeater text. For the tests itself Mocha and Chai are used again in the same setup as described in the unit tests. Additonally, <a href="https://github.com/domenic/chai-as-promised/" target="_blanck">Chai-as-promised</a> allows to easily adapt the expect statements to work with the promises Protractor returns.

```javascript
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
```


## Miscellaneous
The GitHub repository also contains a branch with the <a href="https://github.com/junedev/Five_or_more/tree/jquery_version" target="_blanck">old version</a> of the game I made, which was done with pure jQuery. It's not particularly nice code as far to many actions are performed directly on the DOM and some functions could be refactored. But it works.