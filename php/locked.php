<?php
// This script is to be included at the top of all 
// locked pages.  It checks authentication and, if
// not logged in, will login if a login token is
// present in the cookies.  If unable to login, a
// 401 request is returned.

session_start();

// Check for the presense of uid, which is set on authentication.
if (!$_SESSION['uid']) {

	if (!loginWithRememberMe()) {
		header('HTTP/1.0 401 Unauthorized');
		exit;
	}
}

/**
* Attempts to authenticate user with remember me.
* @return {Boolean}
*/
function loginWithRememberMe () {
	$success = false;
	$token = $_COOKIE['token'];

	if ($token) {
		require '../lib/resteasy/config.php';
		require '../lib/resteasy/connect.php';
		$con = connect();

		$sql = "SELECT user_id FROM token WHERE token = '$token'";
		$result = mysql_query($sql);

		if ($result && mysql_num_rows($result) === 1) {
			$row = mysql_fetch_assoc($result);
			$_SESSION['uid'] = $row['user_id'];
			$success = true;
		}
	}

	return $success;
}

?>