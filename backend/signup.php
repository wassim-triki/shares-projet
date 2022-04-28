<?php

include_once "./db.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

function signup($connection){
  $data=json_decode(file_get_contents('php://input'));
  echo $data->username;
  echo $data->password;
  echo $data->profilePicURL;
  $result =mysqli_query($connection,"SELECT * FROM users WHERE username='$data->username'");
  if($result->num_rows<1){
    $result=mysqli_query($connection,"INSERT INTO users (username, password, profilePicURL) VALUES ('$data->username','$data->password','$data->profilePicURL')");
  }else{
    header('HTTP/1.1 300 Internal Server Error');
      header('Content-Type: application/json; charset=UTF-8');
      die(json_encode(array('message' => 'Username taken', 'code' => 1337)));
  }
}
if($_SERVER["REQUEST_METHOD"]=="POST"){
  signup($connection);
}

