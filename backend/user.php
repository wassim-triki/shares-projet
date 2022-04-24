<?php

include_once "./db.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

function getUser($connection){
  $username= file_get_contents('php://input');
  // echo($data);
  $result =mysqli_query($connection,"SELECT * FROM users WHERE username='$username'");
  // var_dump($result);
  $result2=mysqli_query($connection,"SELECT COUNT(*) AS likes FROM likes,posts WHERE likes.postId=posts.postId AND posts.username='$username'");
  $likes=null;
  while($r2=mysqli_fetch_row($result2)){
    $likes=$r2[0];
  }

  while($r=mysqli_fetch_assoc($result)){
    $rows[]=$r;
  }
  $user=(object)$rows[0];
  $user->likes=$likes;
  print(json_encode($user));
}
if($_SERVER["REQUEST_METHOD"]=="POST"){
  getUser($connection);
}