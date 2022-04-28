<?php

include_once "./db.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

function deletePost($connection){
  $postId=file_get_contents('php://input');
  // var_dump($postId);
  $result=mysqli_query($connection,"DELETE FROM posts WHERE postId='$postId'");
}
function updatePost($connection){
  $data=json_decode(file_get_contents('php://input'));
  var_dump($data);
  $result=mysqli_query($connection,"UPDATE posts SET text='$data->text',imageURL='$data->imageURL' WHERE postId='$data->postId'");
}

if($_SERVER["REQUEST_METHOD"]=="POST"){

  deletePost($connection);
  updatePost($connection);
}