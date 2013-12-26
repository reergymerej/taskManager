<?php

/**
* Gets random string.
* @param {Number} $length
* @return {String}
*/
function getRandString ($length) {
	$str = '';
	$alpha = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

	while ($length > 0) {
		$str .= $alpha[mt_rand(0, strlen($alpha) - 1)];
		$length--;
	}

	return $str;
}

?>