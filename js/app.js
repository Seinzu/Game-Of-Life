
(function ($){
    $(document).ready(function (){
        $("#game-of-life").gameOfLife({updateInterval: 400, liveColour: '#2244FF', deadColour: '#FFFFFF'});
    })
})(jQuery);