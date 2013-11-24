<?php

class Rest extends RestEasy {

	public $table = 'task';
	public $idField = 'id';

	public function __construct() {
		$this->add('id', 'number', true);
		$this->add('parentTaskId', 'number');
		$this->add('category');
		$this->add('description');
		$this->add('start', 'number');
		$this->add('end', 'number');
		$this->add('duration', 'number');
		$this->add('inProgress', 'boolean');
	}

	public function getWhereParams () {
		$p = $this->request->params;
		$params = [];

		if (isset($p['from']) && $val = $p['from']) {
			array_push($params, "start >= " . $this->valueForField($val, 'start'));
		}

		if (isset($p['to']) && $val = $p['to']) {
			array_push($params, "start <= " . $this->valueForField($val, 'end'));
		}

		return implode(' AND ', $params);
	}
}
?>