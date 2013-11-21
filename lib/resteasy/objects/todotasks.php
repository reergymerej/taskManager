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
		$params = [];

		if (isset($p['from']) && $val = $p['from']) {
			array_push($params, "start >= " . $this->valueForField($val, 'start'));
		}

		if (isset($p['to']) && $val = $p['to']) {
			array_push($params, "end <= " . $this->valueForField($val, 'end'));
		}

		return implode(' AND ', $params);
	}
}
?>