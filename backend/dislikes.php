<?php

include_once "./db.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

function removeDislike($connection){
  $data=json_decode(file_get_contents('php://input'));
  var_dump( $data);

}
if($_SERVER["REQUEST_METHOD"]=="POST"){
  removeDislike($connection);
}


