<?php

// Give helpful errors.
$GLOBALS['dev_mode'] = true;

if ($GLOBALS['dev_mode']) {
	error_reporting(E_ALL);
	ini_set("log_errors", 1);
	ini_set("error_log", "/tmp/php-error.log");
} 

// The directory your REST object class definitions are in.
$GLOBALS['objects_dir'] = 'objects';

// database info
$GLOBALS['server'] = 'localhost';
$GLOBALS['db'] = 'wordtoth_a2b';
$GLOBALS['user'] = 'wordtoth_visitor';
$GLOBALS['password'] = 'visitor';

?>
