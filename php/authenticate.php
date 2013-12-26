<?php

/*
* Log in user with provided credentials.
* If successful, the session's uid variable will be set.
*/

require '../lib/resteasy/config.php';
require '../lib/resteasy/connect.php';
require 'util.php';

session_start();

// "remember me"
$COOKIE_DAYS = 30;

$con = connect();

// What is the user POSTing to us?
$email = mysql_real_escape_string($_GET['email']);
$password = mysql_real_escape_string($_GET['password']);

// Check password
$sql = "SELECT id
	FROM user
	WHERE email = '$email'
	AND md5(CONCAT('$password', salt)) = password";

if ($result = mysql_query($sql)) {

	if (mysql_num_rows($result) > 0) {

		// Set up session
		$row = mysql_fetch_assoc($result);
		$userId = $row['id'];
		$_SESSION['uid'] = $userId;

		$token = getRandString(23);

		saveTokenToDb($token, $userId);

		$expiration = time() + 60 * 60 * 24 * $COOKIE_DAYS;

		// TODO Add a series and counter so we can detect hijacked cookies.
		setcookie('token', $token, $expiration);
		setcookie('uid', $userId, $expiration);

	} else {
		header('HTTP/1.0 401 Unauthorized');
	}
}



$userId = 1;


/**
* @param {String} $token
* @return {Boolean} success
*/
function saveTokenToDb ($token, $userId) {
	
	// TODO Delete previous tokens.  We need to NOT invalidate
	// remembered logins on other machines.

	$sql = "INSERT INTO token (token, user_id) VALUES ('$token', $userId)";
	return mysql_query($sql);
}

?>