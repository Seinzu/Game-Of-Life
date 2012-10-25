(function ($) {

    var StartStopButton;

    /**
     * This object just manages a simple start/stop button, creates the button and handles the button's state and will trigger a passed
     * call handler on click.
     * @type {*}
     */
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
                self.render();
            };
            this.el.on("click", function (e) {
                self.clickHandler.apply(self, [e, this]);
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

    /**
     * For a given DOM element, generate a Game Of Life.
     * @param options An object containing various options, described in the README.md file.
     */
    $.fn.StartStopButton = function (options) {
        var settings;
        settings = $.extend({
                callback: function () {

                }
            },
            options);
        this.each(function (idx, value) {
            var startStopBtn;
            startStopBtn = new StartStopButton(value);
            startStopBtn.setClickHandler(options.callback);


        });
    };

}(jQuery));