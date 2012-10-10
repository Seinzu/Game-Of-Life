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

Obviously you should also include the JavaScript file (and jQuery):

    <script type='text/javascript' src='jquery-game-of-life.js' />
    
Finally, you'll need some CSS for the button, here is an example:

    .btn {
        display: inline-block;
        *display: inline;
        padding: 4px 14px;
        margin-bottom: 0;
        *margin-left: .3em;
        font-size: 14px;
        line-height: 20px;
        *line-height: 20px;
        color: #333333;
        text-align: center;
        text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75);
        vertical-align: middle;
        cursor: pointer;
        background-color: #f5f5f5;
        *background-color: #e6e6e6;
        background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#ffffff), to(#e6e6e6));
        background-image: -webkit-linear-gradient(top, #ffffff, #e6e6e6);
        background-image: -o-linear-gradient(top, #ffffff, #e6e6e6);
        background-image: linear-gradient(to bottom, #ffffff, #e6e6e6);
        background-image: -moz-linear-gradient(top, #ffffff, #e6e6e6);
        background-repeat: repeat-x;
        border: 1px solid #bbbbbb;
        *border: 0;
        border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);
        border-color: #e6e6e6 #e6e6e6 #bfbfbf;
        border-bottom-color: #a2a2a2;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        filter: progid:dximagetransform.microsoft.gradient(startColorstr='#ffffffff', endColorstr='#ffe6e6e6', GradientType=0);
        filter: progid:dximagetransform.microsoft.gradient(enabled=false);
        *zoom: 1;
        -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
        -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
    }