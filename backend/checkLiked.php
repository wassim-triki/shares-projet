<?php

include_once "./db.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

function checkIfLiked($connection){
  $data=json_decode(file_get_contents('php://input'));
  // var_dump( $data);
  $count=null;
  $result=mysqli_query($connection,"SELECT COUNT(*) FROM likes WHERE postId='$data->postId' AND username='$data->username'");
  while($row=mysqli_fetch_row($result)){
    $count=$row;
  }
  echo($count[0]);
}


if($_SERVER["REQUEST_METHOD"]=="POST"){
  checkIfLiked($connection);
}


