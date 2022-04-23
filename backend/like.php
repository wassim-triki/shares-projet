<?php

include_once "./db.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");


function like($connection){
  $data=json_decode(file_get_contents('php://input'));
  // var_dump($data);
  $result=mysqli_query($connection,"INSERT INTO likes (postId,username) VALUES ('$data->postId','$data->username')");

}
if($_SERVER["REQUEST_METHOD"]=="POST"){
  like($connection);
}

