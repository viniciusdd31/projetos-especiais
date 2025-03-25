<?php
// arquivo: fases.php
require 'db.php';

if (!isset($_GET['projeto_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Projeto não informado']);
    exit;
}

$projetoId = $_GET['projeto_id'];

try {
    $query = "
        SELECT 
            f.id, 
            f.nome_fase, 
            f.descricao_fase, 
            f.data_inicial, 
            f.prazo, 
            a.status, 
            coalesce(a.comentario, '') as comentario
        FROM fases f
        LEFT JOIN andamento a ON f.id = a.fase_id
        WHERE f.projeto_id = :projeto_id
    ";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':projeto_id', $projetoId);
    $stmt->execute();

    $fases = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($fases);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao carregar fases']);
}
?>
