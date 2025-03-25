<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "projetos_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$projeto_id = $_GET['projeto'];

$sql = "SELECT f.id, f.nome_fase, f.descricao_fase, f.prazo, a.status, coalesce(a.comentario,'') as comentario
        FROM fases f
        LEFT JOIN andamento a ON f.id = a.fase_id
        WHERE f.projeto_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $projeto_id);
$stmt->execute();

$result = $stmt->get_result();
$fases = [];
while ($row = $result->fetch_assoc()) {
    $fases[] = $row;
}

echo json_encode($fases);

$conn->close();
?>
