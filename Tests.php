<?php
/**
 * Created by PhpStorm.
 * User: Vlad
 * Date: 16/11/2016
 * Time: 10:15
 */


echo " Valeur du GPIO 4, tuyau d'arrosage A : ";
exec('sudo /home/pi/goutte/pulsecheck 4', $output, $myvar);
var_dump($myvar);

echo ". Allumage du tuyau A";

exec('sudo /home/pi/goutte/pulseallume 4 1',$output, $myvar2 );
echo ". Le tuyau A (GPIO 4) a la valeur : ";
var_dump($myvar2);



exec('sudo /home/pi/goutte/pulsecheck 0',$output, $myvar3 );
echo ". La lampe A (GPIO 0) a la valeur : ";
var_dump($myvar3);

echo ". Changement d'état de l'Eclairage A ";
exec('sudo /home/pi/goutte/pulseallume 0 2',$output, $myvar4 );

exec('sudo /home/pi/goutte/pulsecheck 0',$output, $myvar5 );
echo ". La lampe A (GPIO 0) a la valeur : ";
var_dump($myvar5);





exec('sudo /home/pi/goutte/pulsecheck 5',$output, $myvar8 );
echo ". La pompe B (GPIO 5) a la valeur : ";
var_dump($myvar8);



exec('sudo /home/pi/goutte/pulsecheck 3',$output, $myvar9 );
echo ". Le capteur de bas niveau (GPIO 3) a la valeur : ";
var_dump($myvar9);

exec('sudo /home/pi/goutte/pulsewater 6 5 3',$output, $myvar10 );
echo ". Allumage de l'arrosage C pendant 10 secondes. ";
var_dump($myvar10);
