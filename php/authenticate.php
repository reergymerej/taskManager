<?php

session_start();

$_SESSION['uid'] = 1;

// "remember me"
$COOKIE_DAYS = 30;

$userId = 1;

$token = getToken();

saveTokenToDb($token, $userId);

$expiration = time() + 60 * 60 * 24 * $COOKIE_DAYS;

// TODO Add a series and counter so we can detect hijacked cookies.
setcookie('token', $token, $expiration);
setcookie('uid', $userId, $expiration);

/**
* Gets random string of integers.
* @return {String}
*/
function getToken () {
	$length = 23;
	$token = '';

	while ($length > 0) {
		$token .= rand(0, 9);
		$length--;
	}

	return $token;
}

/**
* @param {String} $token
* @return {Boolean} success
*/
function saveTokenToDb ($token, $userId) {
	require '../lib/resteasy/config.php';
	require '../lib/resteasy/connect.php';
	$con = connect();

	$sql = "INSERT INTO token (token, user_id) VALUES ('$token', $userId)";
	return mysql_query($sql);
}

?>