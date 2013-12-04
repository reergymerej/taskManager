<?php

class Rest extends RestEasy {

	public $table = 'todolist';
	public $idField = 'id';

	public function __construct() {
		$this->add('id', 'number', true);
		$this->add('created', 'number', true);
		$this->add('name', 'string', true);
		$this->add('archived', 'boolean');
	}

	public function getWhereParams () {
		$p = $this->request->params;
		$params = array();

		if (isset($p['archived'])) {
			$val = $this->valueForField($p['archived'], 'archived');
			array_push($params, "archived = $val");
		}

		return implode(' AND ', $params);
	}
}
?>