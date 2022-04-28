<?php

include_once "./db.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");


function getReactions($connection){
  $result=mysqli_query($connection,"SELECT p.postId,(SELECT count(*) FROM likes AS l WHERE l.postId=p.postId) AS likes
  ,(SELECT count(*) FROM dislikes AS d WHERE d.postId=p.postId) AS dislikes FROM posts AS p ORDER BY p.createdAt DESC");
  $data=array();
  $i=0;
  while($row=mysqli_fetch_assoc($result)){
    $data[$i]=$row;
    $i+=1;
  }
  echo(json_encode($data));
}

if($_SERVER["REQUEST_METHOD"]=="GET"){
  getReactions($connection);
}

