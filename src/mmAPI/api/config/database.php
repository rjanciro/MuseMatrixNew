<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

class Database {
    private $host = "localhost";
    private $db_name = "db_mm";
    private $username = "root";
    private $password = "ABC12abc";
    public $conn;

public function getConnection(){
    $this->conn = null;

    try{
        $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
        $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }catch(PDOException $e){
        echo "Connection error: " . $e->getMessage();
    }
    return $this->conn;
    }
}

