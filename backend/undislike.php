<?php

include_once "./db.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");


function unlike($connection){
  $data=json_decode(file_get_contents('php://input'));
  $result=mysqli_query($connection,"DELETE FROM dislikes WHERE postId='$data->postId' AND username='$data->username'");

}
if($_SERVER["REQUEST_METHOD"]=="POST"){
  unlike($connection);
}

