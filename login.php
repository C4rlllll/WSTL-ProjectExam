<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();

// Database configuration
$servername = "localhost";
$port = 3307;
$db_username = "root";
$db_password = "";
$dbname = "bidsmart_db";

$conn = new mysqli($servername, $db_username, $db_password, $dbname, $port);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$error = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST['username']);
    $password = $_POST['password'];
    
    echo "Debugging Info:<br>";
    echo "Username entered: '" . htmlspecialchars($username) . "'<br>";
    echo "Password length: " . strlen($password) . " characters<br><br>";
    
    if (empty($username) || empty($password)) {
        $error = "All fields are required";
    } else {
        $sql = "SELECT id, fullname, username, password FROM users WHERE username = ?";
        $stmt = $conn->prepare($sql);
        
        if (!$stmt) {
            die("Prepare failed: " . $conn->error);
        }
        
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            
            echo "User found in database: '" . htmlspecialchars($user['username']) . "'<br>";
            echo "Password hash from DB starts with: " . substr($user['password'], 0, 10) . "...<br>";
            
            // Test password verification
            $verify_result = password_verify($password, $user['password']);
            echo "Password verification result: " . ($verify_result ? "<span style='color:green;'>SUCCESS ✓</span>" : "<span style='color:red;'>FAILED ✗</span>") . "<br><br>";
            
            if ($verify_result) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['fullname'] = $user['fullname'];
                
                echo "<strong style='color:green;'>Login successful! Redirecting...</strong><br>";
                echo "<a href='logInMenu.html'>Click here if not redirected</a>";
                
                header("Location: logInMenu.html");
                exit();
            } else {
                $error = "Invalid password - Please make sure you're entering the correct password";
            }
        } else {
            $error = "Username not found";
        }
        
        $stmt->close();
    }
}

$conn->close();
?>