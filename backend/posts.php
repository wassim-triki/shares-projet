<?php

include_once "./db.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

// function getPosts($connection){
//   $searchTerm=file_get_contents('php://input');
//   echo($searchTerm);
//   $result =mysqli_query($connection,"SELECT * from posts WHERE text LIKE '%$searchTerm'%' OR username LIKE '%$searchTerm%' ORDER BY createdAt DESC");
//   $posts=array();
//   $i=0;
//   while($row=mysqli_fetch_assoc($result)){
//     $posts[$i]=$row ;
//     $i+=1;
//   }
//   echo json_encode($posts);
// }
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
if($_SERVER["REQUEST_METHOD"]=="GET"){
}
if($_SERVER["REQUEST_METHOD"]=="POST"){

  deletePost($connection);
  updatePost($connection);
}