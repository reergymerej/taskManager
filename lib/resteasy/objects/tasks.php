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
		$params = array();

		if (isset($p['from']) && $val = $p['from']) {
			array_push($params, "start >= " . $this->valueForField($val, 'start'));
		}

		if (isset($p['to']) && $val = $p['to']) {
			array_push($params, "start <= " . $this->valueForField($val, 'end'));
		}

		if (isset($p['inProgress'])) {
			$val = $this->valueForField($p['inProgress'], 'inProgress');

			if ($val) {
				array_push($params, "inProgress = $val");
			}
		}

		// Either show all from today or show those that are in progress.
		if (isset($p['today'])) {
			$val = $p['today'] === 'true';

			if ($val) {
				$time = time();	// seconds
				$sec = 60 * 60 * 24;
				$todaySec = $time % $sec;
				$today = $time - $todaySec;
				$today *= 1000; // time is stored in ms
				array_push($params, "start >= " . $today);
			}
		}

		return implode(' AND ', $params);
	}
}
?>