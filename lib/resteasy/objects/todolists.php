<?php

class Rest extends RestEasy {

	public $table = 'todolist';
	public $idField = 'id';

	public function __construct() {
		$this->add('id', 'number', true);
		$this->add('created', 'number', true);
	}
}
?>