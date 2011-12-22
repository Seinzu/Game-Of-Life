## Game of Life

A version of Conway's Game of Life written in JavaScript.

### Usage

To use the game, you must provide a table with id "board" and two buttons with id 'startButton' and 'stopButton' respectively. The table will be used to construct the grid and the buttons will be used to start and stop the running of the game. Here is an example segment of HTML that will work with the JavaScript provided:

    <table id='board'>
    
    </table>

    <a id='startButton' href='#'>Start</a>
    <a id='stopButton' href='#'>Stop</a>

Obviously you should also include the JavaScript file:

    <script type='text/javascript' src='gol.js' />