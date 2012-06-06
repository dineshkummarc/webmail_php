<?php

class afterlogic_DAV_Locks_Backend_PDO extends Sabre_DAV_Locks_Backend_PDO {

    /**
     * Constructor 
     * 
     * @param PDO $pdo
     * @param string $tableName 
     */
    public function __construct(PDO $pdo, $dBPrefix = '', 
			$tableName = afterlogic_DAV_Server::Tbl_Locks) {

        $this->pdo = $pdo;
        $this->tableName = $dBPrefix.$tableName;

    }
}
