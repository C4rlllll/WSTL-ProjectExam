<?php
// Database configuration
$servername = "localhost:3307";
$db_username = "root";
$db_password = "";
$dbname = "bidsmart_db";

$conn = new mysqli($servername, $db_username, $db_password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT id, username, password FROM users";
$result = $conn->query($sql);

echo "<h2>Password Check</h2>";
echo "<table border='1' cellpadding='10'>";
echo "<tr><th>ID</th><th>Username</th><th>Password Hash (first 30 chars)</th><th>Hash Length</th><th>Looks Valid?</th></tr>";

while($row = $result->fetch_assoc()) {
    $hash_length = strlen($row['password']);
    $looks_valid = ($hash_length == 60 && substr($row['password'], 0, 4) == '$2y$') ? "YES" : "NO - PROBLEM!";
    
    echo "<tr>";
    echo "<td>" . $row['id'] . "</td>";
    echo "<td>" . htmlspecialchars($row['username']) . "</td>";
    echo "<td>" . htmlspecialchars(substr($row['password'], 0, 30)) . "...</td>";
    echo "<td>" . $hash_length . "</td>";
    echo "<td style='color: " . ($looks_valid == "YES" ? "green" : "red") . ";'><strong>" . $looks_valid . "</strong></td>";
    echo "</tr>";
}

echo "</table>";

$conn->close();
?>