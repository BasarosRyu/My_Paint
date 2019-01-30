<?php

$data = $_POST['image'];
$image = explode('base64,',$data);
$name = $_POST['title'] . ".png";
$fic = fopen( $name, "wb");
fwrite($fic, base64_decode($image[1]));
fclose($fic);

echo "ok";