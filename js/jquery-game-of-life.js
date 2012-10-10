(function ($) {

    var BoardView, Board, Cell, CellCollection, CellView, StartStopButton;
    /**
     * Cell is a model function that covers the state of a single entity in the game of life.
     * The code has some mixed in concerns with the view layer but that is largely to do with
     * accurately determining the state of the entity (because the entity's state depends on
     * the states of its neighbours we need to determine its position in the view).
     * @type {*}
     */
    Cell = (function () {

        function Cell(column, row) {
            this.column = column;
            this.row = row;
            this.status = false;
            this.view = new CellView(this);
        }

        /**
         * Later in the process of running the game of life we will need each cell to interrogate its neighbours
         * and discover which of them are dead. This function is designed to find those neighbours for each cell.
         */
        Cell.prototype.findNeighbours = function (cellCollection) {
            this.neighbours = cellCollection.findNeighbours(this.row, this.column);
        };
        /**
         * To determine the status of our cell, we need to determine, at time t, which of the neighbouring
         * cells are alive and which are dead. This is specifically because the cell must be neither too crowded
         * or too isolated in order to come into being or to continue existing.
         */
        Cell.prototype.findLiveNeighbours = function () {
            var self;
            this.liveNeighbours = 0;
            self = this;
            $.each(this.neighbours, function (idx, neighbour) {
                if (neighbour.status) {
                    self.liveNeighbours++;
                }
            });
        };

        Cell.prototype.isLiving = function () {
            return this.status;
        };
        /**
         * Effectively a setter for the property of living. This sets that property to false.
         */
        Cell.prototype.makeDead = function () {
            this.status = false;
        };

        Cell.prototype.makeLive = function () {
            this.status = true;
        };

        Cell.prototype.render = function (context, size, margin) {
            context.fillStyle = this.isLiving() ? '#000000' : "#FFFFFF";
            context.strokeRect(margin + (this.column - 1) * (size + margin), margin + (this.row - 1) * (size + margin), size, size);
            context.fillRect(margin + (this.column - 1) * (size + margin), margin + (this.row - 1) * (size + margin), size, size);
        };

        return Cell;

    })();

    CellView = (function () {

        function CellView(model){
            this.model = model;
        }

        return CellView;

    })();

    CellCollection = (function () {

        function CellCollection(width, height) {
            this.settings = {width:width, height:height};
            this.cells = {};
            this.createCells();
        }

        CellCollection.prototype.getRows = function () {
            return this.cells;
        };

        CellCollection.prototype.createCells = function () {
            var self = this;
            for (var i = 1; i <= this.settings.height; i++) {
                this.cells["row-" + i] = {};
                for (var n = 1; n <= this.settings.width; n++) {
                    var cell;
                    this.cells['row-' + i]['column-' + n] = new Cell(n, i);
                }
            }
            this.each(function (idx, value) {
                if (typeof value.findNeighbours === "function") {
                    value.findNeighbours(self);
                }
            });
        };

        CellCollection.prototype.findNeighbours = function (row, column) {
            var sameRowPrev, sameRowNext, nextRowSame, nextRowPrev, nextRowNext, prevRowSame, prevRowPrev, prevRowNext,
                prevColumn, nextColumn, prevRow, nextRow;
            row = parseInt(row);
            column = parseInt(column);
            prevColumn = (column > 1) ? column - 1 : this.settings.width;
            nextColumn = (column < this.settings.width) ? column + 1 : 1;
            prevRow = (row > 1) ? row - 1 : this.settings.height;
            nextRow = (row < this.settings.height) ? row + 1 : 1;

            sameRowPrev = this.cells["row-" + row]["column-" + prevColumn];
            sameRowNext = this.cells['row-' + row]['column-' + nextColumn];
            prevRowPrev = this.cells['row-' + prevRow]["column-" + prevColumn];
            prevRowSame = this.cells['row-' + prevRow]["column-" + column];
            prevRowNext = this.cells['row-' + prevRow]["column-" + nextColumn];
            nextRowPrev = this.cells['row-' + nextRow]["column-" + prevColumn];
            nextRowSame = this.cells['row-' + nextRow]["column-" + column];
            nextRowNext = this.cells['row-' + nextRow]["column-" + nextColumn];

            return [sameRowPrev, sameRowNext, nextRowSame, nextRowPrev, nextRowNext, prevRowSame, prevRowPrev,
                prevRowNext];
        };

        CellCollection.prototype.each = function (callback, context) {
            $.each(this.cells, function (idx, value) {
                $.each(value, function (cellIdx, cell) {
                    callback.apply(context, [cellIdx, cell]);
                });
            });

        };

        CellCollection.prototype.getCell = function (row, column) {
            if (typeof this.cells["row-" + row] !== "undefined" && typeof this.cells["row-" + row]["column-" + column] !== "undefined") {
                return this.cells["row-" + row]["column-" + column];
            }
            return false;
        }

        return CellCollection;

    })();

    Board = (function () {

        function Board(el, settings) {
            this.cells = new CellCollection(settings.width, settings.height);
            this.view = new BoardView(el, settings, this);
            this.view.renderBoard();
        }

        Board.prototype.updateBoard = function () {
            this.cells.each(function (idx, value) {
                value.findLiveNeighbours();
            }, this);
            this.cells.each(function (index, cell) {
                if (cell.isLiving()) {
                    if (cell.liveNeighbours != 3 && cell.liveNeighbours != 2) {
                        cell.makeDead();
                    }
                } else {
                    if (cell.liveNeighbours == 3) {
                        cell.makeLive();
                    }
                }
            }, this);
            this.view.renderBoard();
        };

        Board.prototype.selectCell = function (row, column) {
            var cell;
            cell = this.cells.getCell(row, column);
            if (cell) {
                if (cell.isLiving()) {
                    cell.makeDead();
                }
                else {
                    cell.makeLive();
                }
                this.view.renderBoard();
            }
        };

        return Board;

    })();

    BoardView = (function () {

        function BoardView(el, settings, model) {
            this.el = $(el);
            this.settings = settings;
            this.model = model;
            this.initialise();
            this.renderBoard();
        }

        BoardView.prototype.initialise = function () {
            var self = this;

            this.canvas = $("<canvas>").attr("width", this.settings.width * (this.settings.dimension + this.settings.margin) + (this.settings.margin * 2))
                .attr('height', this.settings.height * (this.settings.dimension + this.settings.margin) + (this.settings.margin * 2)).appendTo(this.el);
                this.canvas.click(function (e) {
                var column, mouseLocation, row;
                mouseLocation = {x:e.pageX - e.target.offsetLeft, y:e.pageY - e.target.offsetTop};
                // +1 is because we are counting rows and columns from 1 rather than 0
                row = Math.floor(mouseLocation.y / (self.settings.dimension + self.settings.margin)) + 1;
                column = Math.floor(mouseLocation.x / (self.settings.dimension + self.settings.margin)) + 1;
                self.model.selectCell(row, column);
            });
        };

        /**
         * Sets up the initial board as an HTML table.
         */
        BoardView.prototype.renderBoard = function () {
            var context, self = this, rows;
            rows = this.model.cells.getRows();
            if (this.canvas[0].getContext) {
                // Let's do this context style
                context = this.canvas[0].getContext("2d");
                context.strokeStyle = "#000000";
                this.model.cells.each(function (idx, value) {
                    value.render(context, this.settings.dimension, this.settings.margin);
                }, this)
            }

        };

        return BoardView;
    })();

    StartStopButton = (function () {

        function StartStopButton(parent) {
            var self;
            this.parent = parent;
            this.state = this.STOPPED;
            this.createElement();
            this.render();
            self = this;
            this.clickHandler = function () {
                // do nothing by default other than toggle state
                self.toggleState();
            };
            this.el.on("click", function (e) {
                self.clickHandler.call([e, this]);
            });
        }

        StartStopButton.prototype.STOPPED = false;

        StartStopButton.prototype.STARTED = true;

        StartStopButton.prototype.createElement = function () {
            var ptag;
            ptag = $("<p>");
            this.el = $("<a>").addClass("btn").appendTo(ptag);
            ptag.appendTo($(this.parent));
        };

        StartStopButton.prototype.toggleState = function () {
            this.state = !this.state;
        };

        StartStopButton.prototype.render = function () {
            if (this.state !== this.STARTED) {
                this.el.html("Start");
            }
            else {
                this.el.html("Stop");
            }
        };

        StartStopButton.prototype.setClickHandler = function (callback) {
            this.clickHandler = callback;
        };

        StartStopButton.prototype.getState = function () {
            if (this.state === this.STARTED) {
                return "started";
            }
            return "stopped";
        };

        return StartStopButton;

    })();

    $.fn.gameOfLife = function (options) {
        var settings;
        settings = $.extend({
                width:30, height:30, updateInterval:800, dimension:20, margin:1},
            options);
        this.each(function (idx, value) {
            var startStopBtn, board, interval;
            board = new Board(value, settings);
            startStopBtn = new StartStopButton(value);
            startStopBtn.setClickHandler(function () {
                startStopBtn.toggleState();
                startStopBtn.render();
                if (startStopBtn.getState() === "started") {
                    board.updateBoard.apply(board, []);
                    interval = setInterval(function () {
                            board.updateBoard.apply(board, []);
                        }, settings.updateInterval
                    );
                }
                else {
                    if (typeof interval !== "undefined") {
                        clearInterval(interval);
                    }
                }
            });


        });
    };

})(jQuery);