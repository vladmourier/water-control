/**
 * Created by Vlad on 06/11/2016.
 */

var ORANGE = "#ff9a00";
var DARKRED = "#c72412";

$('li:nth-child(1)').click(function () {
    removeBackgroundsButNth(1);
    $('.tab-content.clearfix').css('background-color',ORANGE);
    $("li:nth-child(1) a").css('background-color', ORANGE);
});

$('li:nth-child(2)').click(function () {
    removeBackgroundsButNth(2);
    $("li:nth-child(3) a").css('background-color', '');
    $('.tab-content.clearfix').css('background-color','#428bca');
});

$('li:nth-child(3)').click(function () {
    removeBackgroundsButNth(3);
    $("li:nth-child(3) a").css('background-color', DARKRED);
    $('.tab-content.clearfix').css('background-color',DARKRED);
});


function removeBackgroundsButNth(n){
    if(n != 1)     $("li:nth-child(1) a").css('background-color', '');
    if(n != 2)     $("li:nth-child(2) a").css('background-color', '');
    if(n != 3)     $("li:nth-child(3) a").css('background-color', '');
}