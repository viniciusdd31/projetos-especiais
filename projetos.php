<?php
// arquivo: projetos.php
require 'db.php';

if (!isset($_GET['unidade_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Unidade não informada']);
    exit;
}

$unidadeId = $_GET['unidade_id'];

try {
    $query = "SELECT id, nome_projeto FROM projetos WHERE unidade = :unidade";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':unidade', $unidadeId);
    $stmt->execute();

    $projetos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($projetos);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao carregar projetos']);
}
?>
