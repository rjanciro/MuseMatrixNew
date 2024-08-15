<?php
/**
 * Get Class
 *
 * This PHP class provides methods for retrieving data related to posts and comments.
 *
 * Usage:
 * 1. Include this class in your project.
 * 2. Create an instance of the class to access the provided methods.
 * 3. Call the appropriate method to retrieve the desired data.
 *
 * Example Usage:
 * ```
 * $get = new Get($pdo);
 * $postsData = $get->get_posts();
 * $commentsData = $get->get_comments();
 * ```
 *
 * Note: Customize the methods as needed to fetch data from your actual data source (e.g., database, API).
 */

require_once "global.php";

class Get extends GlobalMethods {
    private $pdo;

    public function __construct(\PDO $pdo) {
        $this->pdo = $pdo;
    }

    public function executeQuery($sql) {
        $data = array();
        $errmsg = "";
        $code = 0; 

        try {
            if ($result = $this->pdo->query($sql)->fetchAll()) {
                foreach ($result as $record) {
                    array_push($data, $record);
                }
                $code = 200;
                $result = null;
                return array("code" => $code, "data" => $data);
            } else {
                // if no record found, assign corresponding values to error messages/status
                $errmsg = "No records found";
                $code = 404;
            }
        } catch (\PDOException $e) {
            // PDO errors, mysql errors
            $errmsg = $e->getMessage();
            $code = 403;
        }
        return array("code" => $code, "errmsg" => $errmsg);
    }

    public function get_records($table, $condition = null) {
        $sqlString = "SELECT * FROM $table";
        if ($condition != null) {
            $sqlString .= " WHERE " . $condition;
        }

        // Debugging: Log the SQL query
        error_log("SQL Query: " . $sqlString);

        $result = $this->executeQuery($sqlString);

        if ($result['code'] == 200) {
            // Clean up the data to remove numeric keys
            $cleanedData = array_map(function($record) {
                return array_filter($record, function($key) {
                    return !is_numeric($key);
                }, ARRAY_FILTER_USE_KEY);
            }, $result['data']);

            return $this->sendPayload($cleanedData, "success", "Successfully retrieved records.", $result['code']);
        }

        return $this->sendPayload(null, "failed", "Failed to retrieve records.", $result['code']);
    }

    public function get_posts($id = null) {
        $condition = null;
        if ($id != null) {
            $condition = "id=$id";
        }

        return $this->get_records("posts", $condition);
    }

    public function get_comments($postId = null) {
        $condition = null;
        if ($postId != null) {
            $condition = "postId=$postId";
        }

        return $this->get_records("comments", $condition);
    }

    public function search_posts($name) {
        $condition = "name LIKE '%$name%' OR tags LIKE '%$name%'";
        return $this->get_records("posts", $condition);
    }

    public function get_posts_by_user($username) {
        $condition = "postedBy='$username' AND (visibility='public' OR visibility='private')";
        return $this->get_records("posts", $condition);
    }

    public function get_user_details($username) {
        $condition = "username='$username'";
        return $this->get_records("users", $condition);
    }
}
?>