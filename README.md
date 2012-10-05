## Game of Life

A version of Conway's Game of Life written in JavaScript.

### Usage

The implementation of the game of life is as a jquery plugin. To use the game you should run the gameOfLife method
on an element as below

    $("#some-element").gameOfLife();

There are a number of options that you can specify:

* width (default = 10) the number of columns for the board.
* height (default = 10) the number of rows for the board.
* selectionClass (default = "coloured") the css class used to indicate that a cell is alive.
* cssID (default = "board") the id of the board created by the function.
* updateInterval (default = 800) the time elapsed in milliseconds before the next turn of the game is performed.

Obviously you should also include the JavaScript file (and jQuery):

    <script type='text/javascript' src='jquery-game-of-life.js' />
    
Finally, you'll need some CSS, here is an example:

    #board .cell {
        width: 20px;
        height:20px;
        border: 1px dotted black;
    }

    #board .row {
        clear: both;
        float: left;
        display: inline-block; 
    }

    #board .coloured {
        background-color: black;   
    }

You may want to style the start/stop button. This has a class of "btn".