<?php

include_once "./db.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

function getUser($connection){
  $username= file_get_contents('php://input');
  // echo($data);
  $result =mysqli_query($connection,"SELECT * FROM users WHERE username='$username'");
  // var_dump($result);
  $user=null;
    while($r=mysqli_fetch_assoc($result)){
      $user=$r;
    }
    // var_dump($user);
    echo json_encode($user);
}
if($_SERVER["REQUEST_METHOD"]=="POST"){
  getUser($connection);
}