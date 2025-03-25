<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "projetos_db";

// Cria conexão
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica a conexão
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Busca unidades únicas
$sql = "SELECT DISTINCT unidade FROM projetos";
$result = $conn->query($sql);

$unidades = [];
while ($row = $result->fetch_assoc()) {
    $unidades[] = $row;
}

echo json_encode($unidades);

$conn->close();
?>
