<?php

class Rest extends RestEasy {

	public $table = 'user';
	public $idField = 'id';

	public function __construct() {
		// $this->add('id', 'number');
		$this->add('email', 'string', true);
		$this->add('password', 'string', true);
	}
}
?>