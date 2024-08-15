<?php

// Include required modules
require_once "./modules/get.php";
require_once "./modules/post.php";
require_once "./config/database.php";

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    }

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    }

    http_response_code(200);
    exit(0);
}

$con = new Database();
$pdo = $con->getConnection();

// Initialize Get and Post objects
$get = new Get($pdo);
$post = new Post($pdo);

// Check if 'request' parameter is set in the request
if (isset($_REQUEST['request'])) {
    // Split the request into an array based on '/'
    $request = explode('/', $_REQUEST['request']);
} else {
    // If 'request' parameter is not set, return a 404 response
    echo "Not Found";
    http_response_code(404);
    exit();
}

// Handle requests based on HTTP method
switch ($_SERVER['REQUEST_METHOD']) {
        // Handle GET requests
    case 'GET':
        switch ($request[0]) {
            case 'posts':
                if (count($request) > 1) {
                    echo json_encode($get->get_posts($request[1]));
                } else {
                    echo json_encode($get->get_posts());
                }
                break;
            case 'comments':
                if (count($request) > 1) {
                    echo json_encode($get->get_comments($request[1]));
                } else {
                    echo json_encode($get->get_comments());
                }
                break;
            case 'search':
                if (count($request) > 1) {
                    error_log("Searching posts with name: " . $request[1]);
                    $response = $get->search_posts($request[1]);
                        error_log("Search response: " . json_encode($response));
                        echo json_encode($response);
                    } else {
                    error_log("Search request with no name provided");
                    echo json_encode([]);
                }
                break;
            case 'get_posts_by_user':
                if (count($request) > 1) {
                    $postedBy = $request[1];
                    echo json_encode($get->get_posts_by_user($postedBy));
                } else {
                    echo json_encode([]);
                }
                break;
            case 'get_user_details':
                if (isset($_GET['username'])) {
                    $username = $_GET['username'];
                    $response = $get->get_user_details($username);
                    header('Content-Type: application/json');
                    echo json_encode($response);
                } else {
                    echo json_encode(array("code" => 400, "errmsg" => "Username not provided"));
                }
                break;
            default:
                // Return a 404 response for unsupported requests
                echo "Not Found";
                http_response_code(404);
                break;
        }
        break;

        // Handle POST requests
    case 'POST':
        switch ($request[0]) {
            case 'add_post':
                $data = json_decode(file_get_contents("php://input"));
                echo json_encode($post->add_post($data));
                break;
            case 'add_comment':
                $data = json_decode(file_get_contents("php://input"));
                echo json_encode($post->add_comment($data));
                break;
            case 'register':
                $data = json_decode(file_get_contents("php://input"));
                echo json_encode($post->register($data));
                break;
            case 'login':
                $data = json_decode(file_get_contents("php://input"));
                $response = $post->login($data);
                header('Content-Type: application/json');
                echo json_encode($response);
                break;
            case 'upload_profile_picture':
                if (isset($_FILES['file']) && isset($_POST['username'])) {
                    $username = $_POST['username'];
                    $file = $_FILES['file'];
                    echo json_encode($post->upload_profile_picture($username, $file));
                } else {
                    echo json_encode(['status' => 'failed', 'message' => 'File or username not provided']);
                }
                break;
            case 'increment_views':
                if (count($request) > 1) {
                    $postId = $request[1];
                    echo json_encode($post->increment_views($postId));
                } else {
                    echo json_encode(['status' => 'failed', 'message' => 'Post ID is required']);
                }
                break;
            default:
                // Return a 403 response for unsupported requests
                echo "This is forbidden";
                http_response_code(403);
                break;
        }
        break;

    case 'PUT':
        switch ($request[0]) {
            case 'update_post':
                if (count($request) > 1) {
                    $postId = $request[1];
                    $data = json_decode(file_get_contents("php://input"));
                    echo json_encode($post->update_post($postId, $data));
                } else {
                    echo json_encode(['status' => 'failed', 'message' => 'Post ID is required']);
                }
                break;
            case 'update_user_details':
                $data = json_decode(file_get_contents("php://input"));
                echo json_encode($post->update_user_details($data));
                break;
            case 'change_password':
                $data = json_decode(file_get_contents("php://input"));
                echo json_encode($post->change_password($data));
                break;
            default:
                echo "This is forbidden";
                http_response_code(403);
                break;
        }
        break;

    case 'DELETE':
        switch ($request[0]) {
            case 'delete_post':
                if (count($request) > 1) {
                    $postId = $request[1];
                    echo json_encode($post->delete_post($postId));
                } else {
                    echo json_encode(['status' => 'failed', 'message' => 'Post ID is required']);
                }
                break;
            default:
                // Return a 404 response for unsupported requests
                echo "Not Found";
                http_response_code(404);
                break;
        }
        break;

    default:
        // Return a 404 response for unsupported HTTP methods
        echo "Method not available";
        http_response_code(404);
        break;
}