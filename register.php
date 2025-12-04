<?php
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

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $fullname = $_POST['fullname'];
    $gender = $_POST['gender'];
    $age = intval($_POST['age']);
    $email = $_POST['email'];
    $username = $_POST['username'];
    $password = $_POST['password'];

    if ($age < 18) {
        echo "<script>alert('You must be 18 years or older to register'); window.location.href='signup.html';</script>";
        exit();
    }
    
    $check_username = "SELECT id FROM users WHERE username = ?";
    $stmt = $conn->prepare($check_username);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        echo "<script>alert('Username already exists'); window.location.href='signup.html';</script>";
        exit();
    }
    
    $check_email = "SELECT id FROM users WHERE email = ?";
    $stmt = $conn->prepare($check_email);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        echo "<script>alert('Email already registered'); window.location.href='signup.html';</script>";
        exit();
    }
    
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    $sql = "INSERT INTO users (fullname, gender, age, email, username, password, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssisss", $fullname, $gender, $age, $email, $username, $hashed_password);
    
    if ($stmt->execute()) {
        echo "<script>alert('Registration successful!'); window.location.href='login.html';</script>";
    } else {
        echo "<script>alert('Registration failed: " . $conn->error . "'); window.location.href='signup.html';</script>";
    }
    
    $stmt->close();
}

$conn->close();
?>