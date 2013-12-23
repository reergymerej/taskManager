<?php
session_start();

// TODO remove the token from the db
$expiration = time() - 1;
setcookie('token', '', $expiration);
setcookie('uid', '', $expiration);

session_unset();
?>