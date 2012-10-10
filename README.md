## Game of Life

A version of Conway's Game of Life written in JavaScript and HTML5 (using the canvas).

### Usage

The implementation of the game of life is as a jquery plugin. To use the game you should run the gameOfLife method
on an element as below

    $("#some-element").gameOfLife();

There are a number of options that you can specify:

* width (default = 30) the number of columns for the board.
* height (default = 30) the number of rows for the board.
* updateInterval (default = 800) the time elapsed in milliseconds before the next turn of the game is performed.
* dimension (default = 20)
* margin (default = 1) Margin between squares
* liveColour (default = #000000) The colour of squares that are alive
* deadColour (default = #FFFFFF) The colour of squares that are dead

Obviously you should also include the JavaScript file (and jQuery):

    <script type='text/javascript' src='jquery-game-of-life.js' />
    
Finally, you'll need some CSS for the button.
