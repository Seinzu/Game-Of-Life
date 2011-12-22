$(document).ready(function() {
    var width, height, board, boardView, selectionClass, runGame, stopGame, refreshRate, Cell, cells;
    width = 6;
    height = 3;
    board = $('#board');
    selectionClass = "coloured";
    refreshRate = 500;

    Cell = (function() {

        function Cell(row, column, cell) {
            this.row = parseInt(row);
            this.column = parseInt(column);
            if (column == 0) {
                this.columnBefore = width - 1;
            } else {
                this.columnBefore = this.column - 1;
            }
            if (column == width - 1) {
                this.columnAfter = 0;
            } else {
                this.columnAfter = this.column + 1;
            }
            if (row == 0) {
                this.rowBefore = height - 1;
            } else {
                this.rowBefore = this.row - 1;
            }
            if (row == height - 1) {
                this.rowAfter = 0;
            } else {
                this.rowAfter = this.row + 1;
            }
            this.element = cell;
        }

        Cell.prototype.findNeighbours = function() {
            var a, b, c;
            this.neighbours = new Array();
            this.neighbours.push($("#" + this.columnBefore + "_" + this.row));
            this.neighbours.push($('#' + this.columnBefore + "_" + this.rowBefore));
            this.neighbours.push($('#' + this.columnBefore + "_" + this.rowAfter)); 
            this.neighbours.push($("#" + this.columnAfter + "_" + this.row));
            this.neighbours.push($('#' + this.columnAfter + "_" + this.rowBefore)); 
            this.neighbours.push($('#' + this.columnAfter + "_" + this.rowAfter)); 
            this.neighbours.push($("#" + this.column + "_" + this.rowBefore)); 
            this.neighbours.push($("#" + this.column + "_" + this.rowAfter));
            return true;
        };

        Cell.prototype.findLiveNeighbours = function() {
            var neighbour;
            this.liveNeighbours = 0;
            console.log("looking " + this.element.attr("id"));
            console.log(this.neighbours);
            for (var i = 0; i < this.neighbours.length; i++){
                neighbour = this.neighbours[i];
                console.log(neighbour);
                if (neighbour.hasClass(selectionClass)){
                    this.liveNeighbours++;    
                }
            }
        };

        Cell.prototype.isLiving = function() {
            if (this.element.hasClass(selectionClass)) {
                return true;
            }
            return false;
        };

        Cell.prototype.makeDead = function() {
            this.element.removeClass(selectionClass);
        };

        Cell.prototype.makeLive = function() {
            this.element.addClass(selectionClass);
        }

        return Cell;

    })();

    boardView = {
        selectCell: function(e) {
            var cell;
            cell = $(this);
            if (cell.hasClass(selectionClass)) {
                cell.removeClass(selectionClass);
            } else {
                cell.addClass(selectionClass);
            }
        },

        updateBoard: function() {
            $.each(cells, function(index, cell) {
                cell.findLiveNeighbours();
                if (cell.isLiving()) {
                    if (cell.liveNeighbours != 3 && cell.liveNeighbours != 2) {
                        cell.makeDead();
                    }
                } else {
                    if (cell.liveNeighbours == 3) {
                        cell.makeLive();
                    }
                }
            });
        },
        
        initialiseBoard: function() {
            cells = new Array();
            for (var i = 0; i < height; i++) {
                var rowElement;
                rowElement = $("<tr>").appendTo(board).addClass("row");
                for (var n = 0; n < width; n++) {
                    var cell;
                    cell = $("<td>").appendTo(rowElement).addClass("cell").attr("id", n + "_" + i).bind("click", boardView.selectCell);
                    cells.push(new Cell(i, n, cell));
                }
            }
            $.each(cells, function (i, value){value.findNeighbours()});
        }
    };


    runGame = function(e) {
        e.preventDefault();
        boardView.updateBoard();
        //interval = setInterval(boardView.updateBoard, refreshRate);
    };

    stopGame = function(e) {
        e.preventDefault();
        //clearInterval(interval);
    }
    $('#startButton').bind("click", runGame);
    $('#stopButton').bind("click", stopGame);
    
    boardView.initialiseBoard();
});