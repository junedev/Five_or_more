# Five_or_more
WDI 14 LND - Project 1

### Where to find it

Live on the web: **[Five or more](https://sensationnel-saucisson-1393.herokuapp.com/)**

https://sensationnel-saucisson-1393.herokuapp.com/

---

### How it works

* Threre are 6 different colors for bubbles and it's starts out with an empty 9x9 grid.
* There are three colored bubbles on the grid at the start.
* The player can click on one of the bubbles and click on a square where you want the bubble to go.
* The bubble can only move there if there is a free path (bubbles can't move on diagonals).
* After every player move the computer places 3 more random colored bubbles to random empty places on the board.
* If the player manages to get 5 or more bubbles of the same color in a row/column/diagonal they are removed from the field and the player earns points depending on how many there were removed.
* After the player managed to get bubbles removed he can move a bubble again without the PC adding more bubbles beforehand.
* If the whole board is full the game ends and the score is displayed and the player is ranked (e.g. bronze, silver, gold).

---

### Techniques used

Every box on the grid has a consecutive id and before the game starts arrays mapping the neighbours of each node are created.
To check whether a move is possible a recursive algorithm is used to fill an array with all empty boxes connected to the target box.
Also to check whether there are 5 or more bubbles connected an recursive algorithm checks along each possible direction for bubbles of the same color. Please see comments inside the code for more details.

Animate.css for used for having a pulse effect for the selected bubble. FadeOut is used before removing bubbles from the board.

See app.Path3.js for version of the code with pathfinding algorithm included.