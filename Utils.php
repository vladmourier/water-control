<?php

/**
 * Created by PhpStorm.
 * User: Vlad
 * Date: 19/11/2016
 * Time: 17:40
 */
class Utils
{

    /**
     * CONSTANTES
     */
    const key_entity_type = "entityType";
    const key_entity_id = "entityId";
    const ENTITY_TYPE_LIGHT = "light";
    const ENTITY_TYPE_ZONE = "zone";
    const ENTITY_TYPE_EQUIPMENT = "equipment";


    /**
     * Renvoie le port GPIO de l'entité désignée par le coupe (type, id)
     * @param $entityType
     * @param $entityId
     * @return int|null
     */
    public static function getGPIOPort($entityType, $entityId)
    {
        if ($entityType === "light") {
            if ($entityId === "A")
                return 0;
            if ($entityId === "B")
                return 1;
            if ($entityId === "C")
                return 2;
        } else if ($entityType === "zone") {
            if ($entityId === "A")
                return 4;
            if ($entityId === "B")
                return 5;
            if ($entityId === "C")
                return 6;
        } else if ($entityType === "equipment") {
            if ($entityId === "tank")
                return 3;
        }
        return null;
    }

    /**
     * Récupère le statut de l'entité concernée (ex : allumée si c'est une lampe)
     * @param $entityType
     * @param $entityId
     */
    public static function getStatus($entityType, $entityId)
    {
        if ($entityId === "pump" || $entityType === "zone") {

            exec("sudo /home/pi/goutte/pulsecheckwater", $output, $myvar1);

            return json_encode(
                [
                    Utils::key_entity_type => Utils::ENTITY_TYPE_EQUIPMENT,
                    Utils::key_entity_id => $entityId,
                    'status' => $myvar1
                ]
            );
        } else  {
            //fonction qui indique l'état de l'élément courant (Zone, Eclairage, pompe, compteur d'eau
            $port = Utils::getGPIOPort($entityType, $entityId);
            exec("sudo /home/pi/goutte/pulsecheck $port", $output, $myvar);
            return json_encode(
                [Utils::key_entity_type => Utils::ENTITY_TYPE_LIGHT,
                    Utils::key_entity_id => $entityId,
                    'status' => $myvar]
            );

        }
    }


    /**
     * Allume l'éclairage désigné
     * @param $entityId
     * @return string représentation JSON De l'objet mis à jour
     */
    public
    static function eclairage_allumer($entityId)
    {
        //Todo: allumer l'éclairage concerné
        $port = Utils::getGPIOPort(Utils::ENTITY_TYPE_LIGHT, $entityId);
        exec("sudo /home/pi/goutte/pulseallume $port 1", $output, $myvar);
        return json_encode(
            [
                Utils::key_entity_type => Utils::ENTITY_TYPE_LIGHT,
                Utils::key_entity_id => $entityId,
                'isOn' => $myvar
            ]
        );
    }

    /**
     * Eteins l'éclairage désigné
     * @param $entityId
     * @return string représentation JSON de l'objet mis à jour
     */
    public
    static function eclairage_eteindre($entityId)
    {
        //Todo : eteindre l'éclairage concerné
        $port = Utils::getGPIOPort(Utils::ENTITY_TYPE_LIGHT, $entityId);
        exec("sudo /home/pi/goutte/pulseallume $port 0", $output, $myvar);
        return json_encode(
            [
                Utils::key_entity_type => Utils::ENTITY_TYPE_LIGHT,
                Utils::key_entity_id => $entityId,
                'isOn' => $myvar
            ]
        );
    }

    /**
     * Change l'état de l'éclairage désigné
     * @param $entityId
     */
    public
    static function eclairage_changerEtat($entityId)
    {
        //Todo : Affecter un nouvel état à l'éclairage concerné
        $port = Utils::getGPIOPort(Utils::ENTITY_TYPE_LIGHT, $entityId);
        exec("sudo /home/pi/goutte/pulseallume $port 2", $output, $myvar);
        return json_encode(
            [
                Utils::key_entity_type => Utils::ENTITY_TYPE_LIGHT,
                Utils::key_entity_id => $entityId,
                'isOn' => $myvar
            ]
        );
    }

    /**
     * Ordonne au système embarqué d'irriguer la zone désignée avec la quantité paramétrée
     * @param $Zone
     * @param $Quantite
     * @return string
     */
    public
    static function arroser($Zone, $Quantite)
    {
        //Todo : ordonner au serveur d'arroser Zone avec Quantité d'eau
        $port_zone = Utils::getGPIOPort(Utils::ENTITY_TYPE_ZONE, $Zone);
        $port_tank = Utils::getGPIOPort(Utils::ENTITY_TYPE_EQUIPMENT, 'tank');
        exec("sudo /home/pi/goutte/pulsewater $port_zone  $Quantite $port_tank", $output, $myvar);
        return json_encode(
            [
                Utils::key_entity_type => Utils::ENTITY_TYPE_ZONE,
                Utils::key_entity_id => $Zone,
                'code' => $myvar
            ]
        );
    }

}