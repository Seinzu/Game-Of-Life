(function ($) {

    var BoardView, Cell, StartStopButton;
    /**
     * Cell is a model function that covers the state of a single entity in the game of life.
     * The code has some mixed in concerns with the view layer but that is largely to do with
     * accurately determining the state of the entity (because the entity's state depends on
     * the states of its neighbours we need to determine its position in the view).
     * @type {*}
     */
    Cell = (function () {

        function Cell(selectionClass, cell) {
            this.element = cell;
            this.selectionClass = selectionClass;
            this.row = this.element.closest("tr");
        }

        /**
         * Later in the process of running the game of life we will need each cell to interrogate its neighbours
         * and discover which of them are dead. This function is designed to find those neighbours for each cell.
         */
        Cell.prototype.findNeighbours = function () {
            var column, row, previousRows, futureRows, previousKids, nextKids;
            this.elementsBefore = this.element.prevAll();
            this.elementsAfter = this.element.nextAll();
            previousRows = this.row.prevAll();
            futureRows = this.row.nextAll();
            this.previousRow = (previousRows.length > 0) ? previousRows.first() : futureRows.last();
            this.nextRow = (futureRows.length > 0) ? futureRows.first() : previousRows.last();
            this.previousElement = (this.elementsBefore.length > 0)? this.elementsBefore.first() : this.previousRow.children().last();
            this.nextElement = (this.elementsAfter.length > 0) ? this.elementsAfter.first() : this.nextRow.children().first();

            // Now we want to use our data information to work out the elements above and below
            column = this.element.data("column");
            row = this.element.data("row");
            previousKids = this.previousRow.children();
            nextKids = this.nextRow.children();
            this.elementAbove = $(previousKids[column]);
            this.elementBelow = $(nextKids[column]);
            this.elementPreviousAbove = $(previousKids[this.previousElement.data("column")]);
            this.elementNextAbove = $(previousKids[this.nextElement.data("column")]);
            this.elementPreviousBelow = $(nextKids[this.previousElement.data("column")]);
            this.elementNextBelow = $(nextKids[this.nextElement.data("column")]);

            this.neighbours = [this.nextElement, this.previousElement, this.elementAbove, this.elementBelow,
            this.elementPreviousAbove, this.elementNextAbove, this.elementPreviousBelow, this.elementNextBelow];
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
                if (neighbour.data("status") === "living") {
                    self.liveNeighbours++;
                }
            });
        };

        Cell.prototype.isLiving = function () {
            return this.element.data("status") === "living";
        };
        /**
         * Effectively a setter for the property of living. This sets that property to false.
         */
        Cell.prototype.makeDead = function () {
            if (this.isLiving()) {
                this.element.removeClass(this.selectionClass);
                this.element.data("status", "dead");
            }
        };

        Cell.prototype.makeLive = function () {
            if (!this.isLiving()) {
                this.element.addClass(this.selectionClass);
                this.element.data("status", "living");
            }
        };

        return Cell;

    })();

    BoardView = (function () {

        function BoardView(el, settings) {
            this.el = el;
            this.settings = settings;
            this.initialiseBoard();
        }

        BoardView.prototype.selectCell = function (e, cellElement) {
            var cell;
            cell = $(cellElement);
            if (cell.hasClass(this.settings.selectionClass)) {
                cell.removeClass(this.settings.selectionClass);
                cell.data("status", "dead");
            } else {
                cell.addClass(this.settings.selectionClass);
                cell.data("status", "living");
            }
        };

        BoardView.prototype.updateBoard = function () {
            $.each(this.cells, function (index, cell) {
                cell.findLiveNeighbours();
            });
            // There's a race condition (cells can die before they are counted so we do this in another each
            // statement)
            $.each(this.cells, function (index, cell) {
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
        };
        /**
         * Sets up the initial board as an HTML table.
         */
        BoardView.prototype.initialiseBoard = function () {
            var self;
            self = this;
            this.board = $("<table>").attr("id", this.settings.cssID).appendTo($(this.el));
            this.cells = [];
            for (var i = 0; i < this.settings.height; i++) {
                var rowElement;
                rowElement = $("<tr>").data("row", i).attr("id", "row-" + i).appendTo(this.board).addClass("row");
                for (var n = 0; n < this.settings.width; n++) {
                    var cell;
                    cell = $("<td>")
                        .appendTo(rowElement)
                        .addClass("cell")
                        .data("column", n)
                        .on("click", function (e) {
                            self.selectCell.apply(self, [e, this])
                        });
                    this.cells.push(new Cell(this.settings.selectionClass, cell));
                }
            }
            $.each(this.cells, function (i, value) {
                value.findNeighbours()
            });
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
            this.el = $("<a>").addClass("btn").appendTo($(this.parent));
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
                width:10, height:10, selectionClass:"coloured", cssID:"board", updateInterval:800},
            options);
        this.each(function (idx, value) {
            var startStopBtn, boardView, interval;
            boardView = new BoardView(value, settings);
            startStopBtn = new StartStopButton(value);
            startStopBtn.setClickHandler(function () {
                startStopBtn.toggleState();
                startStopBtn.render();
                if (startStopBtn.getState() === "started") {
                    boardView.updateBoard.apply(boardView, []);
                    interval = setInterval(function (){
                        boardView.updateBoard.apply(boardView, []);
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