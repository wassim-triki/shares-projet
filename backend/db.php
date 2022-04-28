<?php
$host="localhost:3306";
$db="testdb";
$username="root";
$password="140111";



$connection=new mysqli($host,$username,$password,$db,'3306');

if($connection->connect_errno){
  http_response_code(400);
  header('Content-Type:application/json');
  echo $connection->connect_error;
  exit();
}