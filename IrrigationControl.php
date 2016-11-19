<?php
/**
 * Created by PhpStorm.
 * User: Vlad
 * Date: 19/11/2016
 * Time: 17:39
 */

require_once 'Utils.php';

/**
 * CONSTANTES
 */


/**
 * ENTRY POINT
 */
$method = $_SERVER['REQUEST_METHOD'];
$params = $_GET;

/**
 * On renvoie un appel à une fonction Javascript avec en paramètre un objet javascript
 * Le nom de la fonction se trouve dans le paramètre GET "callback"
 * Ce mécanisme est nécessaire afin de gérer le problème de l'origine des requêtes qui ne viennent pas nécessairement du meme serveur.
 */
echo $_REQUEST['callback'] . '(';

if ($method == "GET") {
    switch ($params[Utils::key_entity_type]) {
        case Utils::ENTITY_TYPE_ZONE://Si l'action concerne une zone à irriguer (A, B, C)
            if (strcmp($params['dataAction'], "irrigate") == 0) {//S'il s'agit d'arroser la zone
                echo Utils::arroser($params['entityId'], $params['quantity']);
            } else if (strcmp($params['dataAction'], "getStatus") == 0) {//S'il s'agit d'obtenir l'état de la zone (en arrosage/disponible)
                echo Utils::getStatus(Utils::ENTITY_TYPE_ZONE, $params['entityId']);
            }
            break;
    }
}
echo ');';
?>