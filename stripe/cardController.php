<?php
require_once '../Rest/authController.php';
class userControllerClass {
	private function establishConnection(){
		$db = new databaseControllerClass();
		return $db->establishConnection();
	}
	private function executeSqlQuery($sql,$dbconn){
		$result = $dbconn->query($sql);
		return $result;
	}
	
	
}