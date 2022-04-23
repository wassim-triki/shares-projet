<?php

include_once "./db.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

function login($connection){
  $data=json_decode( file_get_contents('php://input'));
  $result =mysqli_query($connection,"SELECT username,profilePicURL,joinedAt,fame FROM users WHERE username='$data->username' AND password='$data->password'");
  // var_dump($result);
  if($result->num_rows===1){
    while($r=mysqli_fetch_assoc($result)){
      $rows[]=$r;
    }
    print(json_encode($rows[0]));
  }else{
    header('HTTP/1.1 300 Internal Server Error');
      header('Content-Type: application/json; charset=UTF-8');
      die(json_encode(array('message' => 'Wrong user information', 'code' => 1337)));
  }
}
if($_SERVER["REQUEST_METHOD"]=="POST"){
  login($connection);
}