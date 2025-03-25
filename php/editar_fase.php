<?php
// arquivo: editar_fase.php
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Dados inválidos']);
    exit;
}

try {
    // Atualizar tabela `fases`
    $queryFase = "
        UPDATE fases SET 
            nome_fase = :nome_fase, 
            descricao_fase = :descricao, 
            data_inicial = :data_inicial, 
            prazo = :prazo 
        WHERE id = :id
    ";
    $stmtFase = $pdo->prepare($queryFase);
    $stmtFase->execute([
        ':nome_fase' => $data['nome_fase'],
        ':descricao' => $data['descricao'],
        ':data_inicial' => $data['data_inicial'],
        ':prazo' => $data['prazo'],
        ':id' => $data['id']
    ]);

    // Atualizar tabela `andamento`
    $queryAndamento = "
        UPDATE andamento SET 
            status = :status, 
            comentario = :comentario 
        WHERE fase_id = :fase_id
    ";
    $stmtAndamento = $pdo->prepare($queryAndamento);
    $stmtAndamento->execute([
        ':status' => $data['status'],
        ':comentario' => $data['comentario'],
        ':fase_id' => $data['id']
    ]);

    echo json_encode(['success' => 'Fase editada com sucesso']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao editar fase']);
}
?>
