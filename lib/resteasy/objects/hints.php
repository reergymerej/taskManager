<?php

class Rest extends RestEasy {

	public function __construct() {
		// This is needed for encoding the response in the proper format.
		$this->add('text');
	}

	public function getCustomSql () {
		$sql = '';
		$fieldName = 'text';

		if ($this->request->verb === 'GET') {
			$sql = "SELECT * FROM (";
			$sql .= "SELECT DISTINCT category $fieldName FROM task";
			$sql .= " UNION ";
			$sql .= "SELECT DISTINCT description $fieldName FROM task";
			$sql .= " UNION ";
			$sql .= "SELECT DISTINCT label $fieldName FROM todotask";
			$sql .= ") AS t ORDER BY t.text";
		}

		return $sql;
	}
}
?>