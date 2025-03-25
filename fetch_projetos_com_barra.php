<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "projetos_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Buscando todos os projetos com suas respectivas fases e status
$sql = "SELECT p.id AS projeto_id, p.nome_projeto, p.unidade, p.descricao,
               f.id AS fase_id, f.nome_fase, f.prazo, a.status
        FROM projetos p
        LEFT JOIN fases f ON p.id = f.projeto_id
        LEFT JOIN andamento a ON f.id = a.fase_id
        ORDER BY p.id, f.id";

$result = $conn->query($sql);

$projetos = [];

while ($row = $result->fetch_assoc()) {
    $projetos[] = $row;
}

echo json_encode($projetos);

$conn->close();
?>
