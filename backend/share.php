<?php

include_once "./db.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

function share($connection){
  $data=json_decode(file_get_contents('php://input'));
  var_dump($data);
  $result =mysqli_query($connection,"INSERT INTO posts (postId,username, text,imageURL) VALUES ('$data->postId','$data->username','$data->text','$data->imageURL')");
  $result=mysqli_query($connection,"UPDATE users SET points='$data->points' WHERE username='$data->username'");

}
if($_SERVER["REQUEST_METHOD"]=="POST"){
  share($connection);
}

