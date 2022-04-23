<?php

include_once "./db.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

function likePost($connection){
  $data=json_decode(file_get_contents('php://input'));
  // var_dump( $data);
  $count=null;
  $result=mysqli_query($connection,"SELECT COUNT(*) FROM likes WHERE postId='$data->postId' AND username='$data->username'");
  while($row=mysqli_fetch_row($result)){
    $count=$row;
  }
  echo($count[0]);
}
function getLikes($connection){
  $result=mysqli_query($connection,"SELECT postId,COUNT(*) as likes FROM likes GROUP BY postId");
  $data=array();
  $i=0;
  while($row=mysqli_fetch_assoc($result)){
    $data[$i]=$row;
    $i+=1;
  }
  echo(json_encode($data));
}
if($_SERVER["REQUEST_METHOD"]=="POST"){
  likePost($connection);
}
if($_SERVER["REQUEST_METHOD"]=="GET"){
  getLikes($connection);
}

