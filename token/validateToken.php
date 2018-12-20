<?php

$token=$_POST["token"];

function OpenCon()
 {
 $dbhost = "db4free.net";
 $dbuser = "votingdapp";
 $dbpass = "votingdapp";
 $db = "votingdapp";
 
 
 $conn = new mysqli($dbhost, $dbuser, $dbpass,$db) or die("Connect failed: %s\n". $conn -> error);
 
 
 return $conn;
 }
 
function CloseCon($conn)
 {
 $conn -> close();
 }

function alert($msg) {
    echo "<script type='text/javascript'>alert('$msg');</script>";
}


 $conn=OpenCon();

 $result = $conn->query("SELECT * FROM `tokens` WHERE `token`='".$token."'");
 if($result->num_rows == 0) {
    alert("Token was incorrect, try again!");
    echo "<script type='text/javascript'>window.location.replace('http://localhost:80/dashboard/');</script>";
 } else {
     echo "true";
     

     $sql = "DELETE FROM `tokens` WHERE `token`='".$token."'";

    if ($conn->query($sql) === TRUE) {
        echo "<script type='text/javascript'>window.location.replace('http://localhost:3000/');</script>";
    } else {
      alert("Delete of used token didn't work");
    }




 }
 $conn->close();


?>