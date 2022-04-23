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
  }
  echo json_encode($posts);
}
function deletePost($connection){
  $postId=file_get_contents('php://input');
  // var_dump($postId);
  $result=mysqli_query($connection,"DELETE FROM posts WHERE postId='$postId'");
}
if($_SERVER["REQUEST_METHOD"]=="GET"){
  getPosts($connection);
}
if($_SERVER["REQUEST_METHOD"]=="POST"){
  deletePost($connection);
}