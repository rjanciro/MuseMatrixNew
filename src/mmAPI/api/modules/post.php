<?php

/**
 * Post Class
 *
 * This PHP class provides methods for adding and managing posts, comments, user authentication, and view counters.
 *
 * Usage:
 * 1. Include this class in your project.
 * 2. Create an instance of the class to access the provided methods.
 * 3. Call the appropriate method to add or manage posts, comments, authenticate users, or increment view counters with the provided data.
 *
 * Example Usage:
 * ```
 * $post = new Post($pdo);
 * $postData = ... // prepare post data as an associative array or object
 * $addedPost = $post->add_post($postData);
 *
 * $commentData = ... // prepare comment data as an associative array or object
 * $addedComment = $post->add_comment($commentData);
 *
 * $registerData = ... // prepare register data as an associative array or object
 * $registerResult = $post->register($registerData);
 *
 * $loginData = ... // prepare login data as an associative array or object
 * $loginResult = $post->login($loginData);
 *
 * $postId = ... // prepare post ID as an integer
 * $incrementViewsResult = $post->increment_views($postId);
 * ```
 *
 * Note: Customize the methods as needed to handle the addition of data to your actual data source (e.g., database, API).
 */

require_once "global.php"; 

class Post extends GlobalMethods {
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

    public function add_comment($data) {
        $sql = "INSERT INTO comments (postId, postedBy, content) VALUES (?, ?, ?)";
        try {
            $statement = $this->pdo->prepare($sql);
            $statement->execute([
                $data->postId,
                $data->postedBy,
                $data->content
            ]);
            return $this->sendPayload(null, "success", "Successfully created a new comment.", 200);
        } catch (\PDOException $e) {
            $errmsg = $e->getMessage();
            $code = 400;
            return $this->sendPayload(null, "failed", $errmsg, $code);
        }
    }

    public function add_post($data) {
        $sql = "INSERT INTO posts (name, content, postedBy, tags, img, visibility) VALUES (?, ?, ?, ?, ?, ?)";
        try {
            $statement = $this->pdo->prepare($sql);
            $statement->execute([
                $data->name,
                $data->content,
                $data->postedBy,
                json_encode($data->tags),
                $data->img,
                $data->visibility
            ]);
            return $this->sendPayload(null, "success", "Successfully created a new post.", 200);
        } catch (\PDOException $e) {
            $errmsg = $e->getMessage();
            $code = 400;
            return $this->sendPayload(null, "failed", $errmsg, $code);
        }
    }

    public function register($data) {
        // Check if username already exists
        $sql = "SELECT COUNT(*) FROM users WHERE username = ?";
        $statement = $this->pdo->prepare($sql);
        $statement->execute([$data->username]);
        $count = $statement->fetchColumn();

        if ($count > 0) {
            return $this->sendPayload(null, "failed", "Username already taken.", 400);
        }

        // Proceed with register if username is not taken
        $sql = "INSERT INTO users (first_name, last_name, username, password) VALUES (?, ?, ?, ?)";
        try {
            $statement = $this->pdo->prepare($sql);
            $hashedPassword = password_hash($data->password, PASSWORD_BCRYPT);
            $statement->execute([$data->firstName, $data->lastName, $data->username, $hashedPassword]);
            return $this->sendPayload(null, "success", "Successfully registered.", 200);
        } catch (\PDOException $e) {
            $errmsg = $e->getMessage();
            error_log("Registration error: " . $errmsg);
            $code = 400;
            return $this->sendPayload(null, "failed", $errmsg, $code);
        }
    }

    public function login($data) {
        $sql = "SELECT * FROM users WHERE username = ?";
        try {
            error_log("Login attempt for username: " . $data->username);
            error_log("Login data received: " . json_encode($data));
            $statement = $this->pdo->prepare($sql);
            $statement->execute([$data->username]);
            $user = $statement->fetch();
            if ($user && password_verify($data->password, $user['password'])) {
                error_log("Login successful for username: " . $data->username);
                header('Content-Type: application/json');
                return $this->sendPayload(null, "success", "Successfully logged in.", 200);
            } else {
                error_log("Invalid credentials for username: " . $data->username);
                header('Content-Type: application/json');
                return $this->sendPayload(null, "failed", "Invalid credentials.", 401);
            }
        } catch (\PDOException $e) {
            $errmsg = $e->getMessage();
            error_log("Database error during login: " . $errmsg);
            $code = 400;
            header('Content-Type: application/json');
            return $this->sendPayload(null, "failed", $errmsg, $code);
        }
    }

    public function update_post($postId, $data) {
        $sql = "UPDATE posts SET 
            name = ?, 
            content = ?, 
            tags = ?, 
            img = ?, 
            visibility = ? 
            WHERE id = ?";
            
        try {
            $statement = $this->pdo->prepare($sql);
            $statement->execute(
                [
                    $data->name,
                    $data->content,
                    json_encode($data->tags),
                    $data->img,
                    $data->visibility,
                    $postId
                ]
            );
            return $this->sendPayload(null, "success", "Successfully updated the post.", 200);
        } catch (\PDOException $e) {
            $errmsg = $e->getMessage();
            $code = 400;
            return $this->sendPayload(null, "error", $errmsg, $code);
        }
    }

    public function delete_post($postId) {
        $sqlDeleteComments = "DELETE FROM comments WHERE postId = ?";
        $sqlDeletePost = "DELETE FROM posts WHERE id = ?";
        try {
            $this->pdo->beginTransaction();

            // Delete comments associated with the post
            $statement = $this->pdo->prepare($sqlDeleteComments);
            $statement->execute([$postId]);

            // Delete the post
            $statement = $this->pdo->prepare($sqlDeletePost);
            $statement->execute([$postId]);

            $this->pdo->commit();
            return $this->sendPayload(null, "success", "Successfully deleted the post and its comments.", 200);
        } catch (\PDOException $e) {
            $this->pdo->rollBack();
            $errmsg = $e->getMessage();
            return $this->sendPayload(null, "failed", $errmsg, 400);
        }
    }

    public function get_user_details($username) {
        $condition = "username='$username'";
        return $this->get_records("users", $condition);
    }

    public function upload_profile_picture($username, $file) {
        $uploadDir = '../Uploads/Photos/';
        $uploadFile = $uploadDir . basename($file['name']);
        $fileType = strtolower(pathinfo($uploadFile, PATHINFO_EXTENSION));
    
        // Check if the directory exists, if not, create it
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
    
        // Check if the file is a PNG or JPG
        if ($fileType != 'jpg' && $fileType != 'jpeg' && $fileType != 'png') {
            error_log("Invalid file type: " . $fileType);
            return $this->sendPayload(null, "error", "Only JPG and PNG files are allowed.", 400);
        }
    
        if (move_uploaded_file($file['tmp_name'], $uploadFile)) {
            // Update the user's profile picture in the database
            $relativePath = 'Uploads/Photos/' . basename($file['name']);
            $sql = "UPDATE users SET profile_picture = ? WHERE username = ?";
            try {
                $statement = $this->pdo->prepare($sql);
                $statement->execute([$relativePath, $username]);
                error_log("Profile picture uploaded successfully for user: " . $username);
                return $this->sendPayload(['profile_picture' => $relativePath], "success", "Profile picture uploaded successfully.", 200);
            } catch (\PDOException $e) {
                $errmsg = $e->getMessage();
                error_log("Database error: " . $errmsg);
                return $this->sendPayload(null, "error", $errmsg, 400);
            }
        } else {
            error_log("Failed to move uploaded file.");
            return $this->sendPayload(null, "error", "Failed to upload profile picture.", 500);
        }
    }

    public function update_user_details($data) {
        $sql = "UPDATE users SET first_name = ?, last_name = ? WHERE username = ?";
        try {
            $statement = $this->pdo->prepare($sql);
            $statement->execute([$data->first_name, $data->last_name, $data->username]);
            return $this->sendPayload(null, "success", "User details updated successfully.", 200);
        } catch (\PDOException $e) {
            $errmsg = $e->getMessage();
            return $this->sendPayload(null, "failed", $errmsg, 400);
        }
    }

    public function change_password($data) {
        $sql = "SELECT * FROM users WHERE username = ?";
        try {
            $statement = $this->pdo->prepare($sql);
            $statement->execute([$data->username]);
            $user = $statement->fetch();
            if ($user && password_verify($data->currentPassword, $user['password'])) {
                $hashedPassword = password_hash($data->newPassword, PASSWORD_BCRYPT);
                $updateSql = "UPDATE users SET password = ? WHERE username = ?";
                $updateStatement = $this->pdo->prepare($updateSql);
                $updateStatement->execute([$hashedPassword, $data->username]);
                return $this->sendPayload(null, "success", "Password changed successfully.", 200);
            } else {
                return $this->sendPayload(null, "failed", "Current password is incorrect.", 400);
            }
        } catch (\PDOException $e) {
            $errmsg = $e->getMessage();
            return $this->sendPayload(null, "failed", $errmsg, 400);
        }
    }

    public function increment_views($postId) {
        $sql = "UPDATE posts SET views = views + 1 WHERE id = ?";
        try {
            $statement = $this->pdo->prepare($sql);
            $statement->execute([$postId]);
            return $this->sendPayload(null, "success", "Views incremented successfully.", 200);
        } catch (\PDOException $e) {
            $errmsg = $e->getMessage();
            return $this->sendPayload(null, "failed", $errmsg, 400);
        }
    }
}