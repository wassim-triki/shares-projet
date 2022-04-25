<?php

include_once "./db.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

function getPosts($connection){
  $searchTerm=file_get_contents('php://input');
  $query="SELECT * from posts,users WHERE users.username=posts.username AND (posts.text LIKE '%$searchTerm%' OR posts.username LIKE '%$searchTerm%') ORDER BY createdAt DESC";
  $result =mysqli_query($connection,$query);
  
  $posts=array();
  $i=0;
  while($row=mysqli_fetch_assoc($result)){
    $posts[$i]=$row ;
    $i+=1;
  }
  echo json_encode($posts);
}


if($_SERVER["REQUEST_METHOD"]=="POST"){
  getPosts($connection);
}