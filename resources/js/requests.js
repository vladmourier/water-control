/**
 * Created by Vlad on 06/11/2016.
 */

/** *******************************************************************************************************************
 *
 *      CONSTANTES & PARAMETRES
 * *******************************************************************************************************************/
var ICON_OK = "<span class='glyphicon glyphicon-ok-circle'></span>";
var ICON_REMOVE = "<span class='glyphicon glyphicon-remove-circle'></span>";
var ICON_OK_BIG = "<span class='glyphicon glyphicon-ok-circle icon-big'></span>";
var ICON_REMOVE_BIG = "<span class='glyphicon glyphicon-remove-circle icon-big'></span>";
var ICON_COG = '<img class="loader loader-big" src="resources/img/gear.svg"> En cours d\'utilisation';

var IRRIGATION_FACTOR = 2;


var iFrequency = 1000; // expressed in miliseconds
var myInterval = 0;

var destURLDistant = "http://192.168.20.104/biteau_mourier/waterControl.php";
var destURLLocal = "http://localhost/water-control/waterControl.php";

var irrigation_destURLDistant = "http://192.168.20.104/biteau_mourier/IrrigationControl.php";
var irrigation_destURLLocal = "http://localhost/water-control/IrrigationControl.php";

var method = "GET";

/** *******************************************************************************************************************
 *
 *      Fonctions
 * *******************************************************************************************************************/

var err_handling = function (resultat, statut, erreur) {
    alert("Une erreur est survenue");
    console.log("ERREUR");
    console.log(resultat);
    console.log(statut);
    console.log(erreur);
    console.log("/ERREUR");
};


function getIrrigationTime(quantity) {
    return quantity * IRRIGATION_FACTOR;
}

// STARTS and Resets the loop if any
function startLoop() {
    if (myInterval > 0) clearInterval(myInterval);  // stop
    myInterval = setInterval("refresh_button()", iFrequency);  // run
}

var i = 0;
function refresh_button() {
    // (do something here)
    var buttons = $('.btn-refresh');
    buttons.eq(i).trigger('click');
    if (i === 3) {
        i += 3;
    }
    if (i === buttons.length - 1) {
        i = 0;
        clearInterval(myInterval);//Stop
    }
    i++;
}

/** *******************************************************************************************************************
 *
 *      Listeners
 * *******************************************************************************************************************/

var listenToSwap = function () {
    var button_clicked = $(this);
    var parent = button_clicked.parent();


    var node = parent.children('h2');

    params = {//Paramètres de la requête AJAX
        entityType: parent.parent().attr('data-entity-type'),//Type : éclairage
        entityId: parent.parent().attr('data-entity-id'),//Entity id doit être dans {A, B, C]
        dataAction: $(this).attr('data-action')// swap => changer d'état
    };

    node.children().remove();
    node.append('<img class="loader" src="resources/img/default.svg">');//Loader


    $.ajax({
        url: destURLLocal,
        type: method,
        dataType: 'jsonp',
        data: params,
        success: function (code, status) {
            node.children().remove();
            if (code.isOn === true) {
                node.append(ICON_OK);
            } else {
                node.append(ICON_REMOVE);
            }
        },

        error: err_handling
    });

};

var listenToTurnonTurnoff = function () {
    var button_clicked = $(this);
    var grandparent = button_clicked.parent().parent();

    params = {//Paramètres de la requête AJAX
        entityType: grandparent.attr('data-entity-type'),//élcairage => "light"
        entityId: grandparent.attr('data-entity-id'),// {A, B, C}
        dataAction: $(this).attr('data-action')//turnon ou turnoff
    };

    var node = grandparent.children('div:nth-child(3)').children('h2');

    node.children().remove();
    node.append('<img class="loader" src="resources/img/default.svg">');//Loader

    $.ajax({
        url: destURLLocal,
        type: method,
        dataType: 'jsonp',
        data: params,
        success: function (code, statut) {
            node.children().remove();

            if (code.isOn === true) {
                node.append(ICON_OK);
            } else {
                node.append(ICON_REMOVE);
            }
        },

        error: err_handling
    });

};

var listenToIrrigate = function () {
    var button_clicked = $(this);
    var grandparent = button_clicked.parent().parent();

    var form = $(this).parent().children('div:nth-child(2)').children('.irrigation-input');
    if (!button_clicked.hasClass('button-on')) {

        params = {//Paramètres de la requête AJAX
            entityType: grandparent.attr('data-entity-type'),//type : "zone"
            entityId: grandparent.attr('data-entity-id'),// {A, B, C}
            dataAction: $(this).attr('data-action'),// action => irrigate
            quantity: form.val()// Liters to send
        };

        if (form.val()) {
            var node = grandparent.children('div:nth-child(3)');
            node = node.children('.container-fluid').children('div');

            var buttons = $('#2a  .arrosage  .button-off');
            buttons.removeClass('button-off').addClass('button-on').css('cursor', 'not-allowed');
            node.empty();
            node.append(ICON_COG);//Traitement en cours

            $.ajax({
                url: irrigation_destURLLocal,
                type: method,
                dataType: 'jsonp',
                data: params,
                success: function (code, statut) {
                    //Réindique l'état
                    buttons.removeClass('button-on').addClass('button-off').css('cursor', 'pointer');
                    node.empty();
                    if (code.code > 1) {
                        node.append(ICON_REMOVE + "L'irrigation a rencontré un problème. Contrôlez le réservoir d'eau");
                    } else {
                        // "prêt" lorsque l'irrigation est terminée
                        node.append(ICON_OK);
                    }

                },

                error: err_handling
            });
        } else {
            alert("Veuillez indiquer une valeur")
        }
    }
};

var listenToRefresh = function () {
    var self = this;
    var button_clicked = $(this);
    var grandparent = button_clicked.parent().parent();


    params = {
        entityType: grandparent.attr('data-entity-type'),
        entityId: grandparent.attr('data-entity-id'),
        dataAction: 'getStatus'
    };

    var node;
    if (params.entityType === "light") {
        node = grandparent.children('div:nth-child(3)');
        node = node.children('h2');
    } else if (params.entityType === "zone") {
        node = grandparent.children('div:nth-child(3)');
        node = node.children('.container-fluid').children('div');
    } else if (params.entityType === "equipment") {
        node = grandparent.children('div:nth-child(2)').children('div');
    }


    $.ajax({
        url: destURLLocal,
        type: method,
        dataType: 'jsonp',
        data: params,
        success: function (code, statut) {
            console.log(params);

            if (params.entityType != "light")
                node.empty();
            else node.children().remove();

            if (params.entityType === "light") {
                if (code.status === 1)
                    node.append(ICON_OK);//Lumière allumée
                else
                    node.append(ICON_REMOVE);//Lumière éteinte
            } else if (params.entityType === "zone") {
                if (code.status === 4) {
                    $('div.arrosage:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2)').append(ICON_COG);
                    $('div.arrosage:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2)').empty().append(ICON_OK);
                    $('div.arrosage:nth-child(3) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2)').empty().append(ICON_OK);
                    $('div.container:nth-child(1) > div:nth-child(2) > div:nth-child(2)').empty().append(ICON_COG);
                } else if (code.status === 5) {
                    $('div.arrosage:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2)').empty().append(ICON_OK);
                    $('div.arrosage:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2)').append(ICON_COG);
                    $('div.arrosage:nth-child(3) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2)').empty().append(ICON_OK);
                    $('div.container:nth-child(1) > div:nth-child(2) > div:nth-child(2)').empty().append(ICON_COG);
                } else if (code.status === 6) {
                    $('div.arrosage:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2)').empty().append(ICON_OK);
                    $('div.arrosage:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2)').empty().append(ICON_OK);
                    $('div.arrosage:nth-child(3) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2)').append(ICON_COG);
                    $('div.container:nth-child(1) > div:nth-child(2) > div:nth-child(2)').empty().append(ICON_COG);
                }
                else {
                    $('div.arrosage:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2)').empty().append(ICON_OK);
                    $('div.arrosage:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2)').empty().append(ICON_OK);
                    $('div.arrosage:nth-child(3) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2)').empty().append(ICON_OK);
                    $('div.container:nth-child(1) > div:nth-child(2) > div:nth-child(2)').empty().append(ICON_OK_BIG);
                }
            } else if (params.entityType === "equipment") {
                if (params.entityId === "tank") {
                    if (code.status === 1)
                        node.append(ICON_REMOVE_BIG + " Cuve vide");
                    else
                        node.append(ICON_OK_BIG + " Cuve prête");
                } else {
                    if (code.status === 1)
                        node.append(ICON_COG);
                    else
                        node.append(ICON_OK + " Prêt");
                }
            }
        },

        error: err_handling
    });
};

/**
 * Gère les boutons "Changer état" pour les éclairages
 */
$('.button[data-action="swap"]').click(listenToSwap);

/**
 * Gère les boutons allumer/éteindre pour les éclairages
 */
$('.button-switch[data-action="turnon"], .button-switch[data-action="turnoff"]').click(listenToTurnonTurnoff);

/**
 * Gère l'irrigation des trois zones
 */
$('.button[data-action="irrigate"]').click(listenToIrrigate);

$('.btn-refresh').click(listenToRefresh);


/** *******************************************************************************************************************
 *
 *      ENTRY POINT
 * *******************************************************************************************************************/

startLoop();