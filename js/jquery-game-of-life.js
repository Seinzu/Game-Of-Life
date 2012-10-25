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

        return Cell;

    })();

    CellView = (function () {

        function CellView(context, size, margin, liveColour, deadColour, hasGrid) {
            this.context = context;
            this.size = size;
            this.margin = margin;
            this.liveColour = liveColour;
            this.deadColour = deadColour;
            this.hasGrid = hasGrid;
            this.model = null;
        }

        CellView.prototype.setModel = function (model) {
            this.model = model;
        };

        CellView.prototype.render = function () {
            var chartRow, chartColumn;
            chartRow = this.model.row - 1;
            chartColumn = this.model.column - 1;
            this.context.fillStyle = this.model.isLiving() ? this.liveColour : this.deadColour;
            if (this.hasGrid) {
                this.context.strokeRect(this.margin + chartColumn * (this.size + this.margin),
                    this.margin + chartRow * (this.size + this.margin), this.size, this.size);
            }
            this.context.fillRect(this.margin + chartColumn * (this.size + this.margin),
                this.margin + chartRow * (this.size + this.margin), this.size, this.size);
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
            if (!$(this.canvas)[0].getContext) {
                $("<p>").addClass("error").html("Sorry, your browser does not support the Game of Life.").appendTo(this.el);
            }
        };

        /**
         * Sets up the initial board as an HTML table.
         */
        BoardView.prototype.renderBoard = function () {
            var context, self = this, cellView;
            if (this.canvas[0].getContext) {
                // Let's do this context style
                context = this.canvas[0].getContext("2d");
                context.strokeStyle = "#333333";
                cellView = new CellView(context, this.settings.dimension, this.settings.margin, this.settings.liveColour, this.settings.deadColour, this.settings.hasGrid);
                this.model.cells.each(function (idx, value) {
                    cellView.setModel(value);
                    cellView.render();
                }, this)
            }
        };
        return BoardView;
    })();

    /**
     * For a given DOM element, generate a Game Of Life.
     * @param options An object containing various options, described in the README.md file.
     */
    $.fn.gameOfLife = function (options) {
        var settings;
        settings = $.extend({
                width:30, height:30, updateInterval:800, dimension:20, margin:1, liveColour:"#FFFFFF", deadColour:"#000000", hasGrid:true},
            options);
        this.each(function (idx, value) {
            var startStopBtn, board, interval;
            board = new Board(value, settings);
            startStopBtn = new $(value).StartStopButton({callback: function () {
                this.toggleState();
                this.render();
                if (this.getState() === "started") {
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
            }});


        });
    };

})(jQuery);