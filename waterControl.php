<?php
/**
 * Created by PhpStorm.
 * User: Vlad
 * Date: 04/11/2016
 * Time: 14:56
 */

require_once 'Utils.php';

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
    //Todo : identifier l'entité, l'action, et effectuer l'opération requise
    switch ($params[Utils::key_entity_type]) {
        case Utils::ENTITY_TYPE_EQUIPMENT://Si l'action concerne un équipement (pompe, cuve)
            if (strcmp($params['dataAction'], "getStatus") == 0) {//S'il s'agit de vérifier son état
                echo Utils::getStatus(Utils::ENTITY_TYPE_EQUIPMENT, $params['entityId']);
            }
            break;
        case  Utils::ENTITY_TYPE_LIGHT://Si l'action concerne un éclairage (A, B, C)
            if (strcmp($params['dataAction'], "turnon") == 0) {//S'il s'agit d'allumer une lampe
                echo Utils::eclairage_allumer($params['entityId']);
            } else if (strcmp($params['dataAction'], "turnoff") == 0) {//S'il s'agit d'éteindre une lampe
                echo Utils::eclairage_eteindre($params['entityId']);
            } else if (strcmp($params['dataAction'], "swap") == 0) {//S'il s'agit de changer l'état d'une lampe
                echo Utils::eclairage_changerEtat($params['entityId']);
            } else if (strcmp($params['dataAction'], "getStatus") == 0) {//S'il s'agit d'obtenir l'état d'une lampe
                echo Utils::getStatus(Utils::ENTITY_TYPE_LIGHT, $params['entityId']);
            }
            break;
    }
}
echo ');';
?>
