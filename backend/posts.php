<?php

include_once "./db.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

function getPosts($connection){
  $result =mysqli_query($connection,"SELECT * FROM posts,users WHERE posts.username=users.username ORDER BY createdAt DESC");
  $posts=array();
  $i=0;
  while($row=mysqli_fetch_assoc($result)){
    $posts[$i]=$row ;
    $i+=1;
    // var_dump($row);
  }
  // var_dump($posts);
  echo json_encode($posts);
  // var_dump($result);
  // if($result->num_rows===1){
  //   while($r=mysqli_fetch_assoc($result)){
  //     $rows[]=$r;
  //   }
  //   print(json_encode($rows[0]));
  // }else{
  //   header('HTTP/1.1 300 Internal Server Error');
  //     header('Content-Type: application/json; charset=UTF-8');
  //     die(json_encode(array('message' => 'Wrong user information', 'code' => 1337)));
  // }
}
if($_SERVER["REQUEST_METHOD"]=="GET"){
  getPosts($connection);
}