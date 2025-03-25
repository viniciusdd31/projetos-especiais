<?php
// arquivo: remover_fase.php
require 'db.php';

if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Fase não informada']);
    exit;
}

$faseId = $_GET['id'];

try {
    // Remover da tabela `andamento`
    $queryAndamento = "DELETE FROM andamento WHERE fase_id = :fase_id";
    $stmtAndamento = $pdo->prepare($queryAndamento);
    $stmtAndamento->bindParam(':fase_id', $faseId);
    $stmtAndamento->execute();

    // Remover da tabela `fases`
    $queryFase = "DELETE FROM fases WHERE id = :id";
    $stmtFase = $pdo->prepare($queryFase);
    $stmtFase->bindParam(':id', $faseId);
    $stmtFase->execute();

    echo json_encode(['success' => 'Fase removida com sucesso']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao remover fase']);
}
?>
