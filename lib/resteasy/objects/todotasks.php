<?php

class Rest extends RestEasy {

	public $table = 'todotask';
	public $idField = 'id';

	public function __construct() {
		$this->add('id', 'number', true);
		$this->add('label', 'string', true);
		$this->add('notes');
		$this->add('created', 'number', true);
		$this->add('isComplete', 'boolean', true);
		$this->add('downstreamTaskId', 'number');
		$this->add('todoCollectionId', 'number', true);
	}

	public function getWhereParams () {
		$p = $this->request->params;
		$params = array();

		if (isset($p['todoCollectionId']) && $val = $p['todoCollectionId']) {
			array_push($params, "todoCollectionId = " . $this->valueForField($val, 'todoCollectionId'));
		}

		return implode(' AND ', $params);
	}
}
?>