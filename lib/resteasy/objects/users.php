<?php

class Rest extends RestEasy {

	public $table = 'user';
	public $idField = 'id';

	public function __construct() {
		$this->add('email', 'string', true);
		$this->add('password', 'string', true);
	}

	public function getCustomSql () {
		$sql = '';
		
		if ($this->request->verb === 'PUT' || $this->request->verb === 'POST') {

			require '../../php/util.php';

			$email = $this->request->payload->email;
			$password = $this->request->payload->password;
			$salt = getRandString(23);

			// TODO Use something stronger than md5.
			$password = md5($password . $salt);

			$sql .= "INSERT INTO $this->table (email, password, salt) ";
			$sql .= "VALUES ('$email', '$password', '$salt')";
		}

		return $sql;
	}
}
?>