<?php
$time = time();
$sec = 60 * 60 * 24;
$todaySec = $time % $sec;
$today = $time - $todaySec;
echo $today;
?>