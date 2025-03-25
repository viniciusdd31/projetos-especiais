<?php
// arquivo: adicionar_fase.php

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$projeto_id = $data['projeto_id'];
$nome_fase = $data['nome_fase'];
$descricao = $data['descricao'];
$data_inicial = $data['data_inicial'];
$prazo = $data['prazo'];
$status = $data['status'];
$comentario = $data['comentario'];

// Conexão com o banco de dados
$conn = new mysqli('localhost', 'root', '', 'projetos_db');

if ($conn->connect_error) {
    die("Erro de conexão: " . $conn->connect_error);
}

// Inserir na tabela fases
$sql = "INSERT INTO fases (projeto_id, nome_fase, descricao_fase, data_inicial, prazo)
        VALUES (?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("issss", $projeto_id, $nome_fase, $descricao, $data_inicial, $prazo);

if ($stmt->execute()) {
    // Obter o ID da fase inserida
    $fase_id = $stmt->insert_id;

    // Atualizar a tabela andamento com o comentário e o status
    $sqlAndamento = "UPDATE andamento 
                     SET comentario = ?, status = ? 
                     WHERE fase_id = ?";

    $stmtAndamento = $conn->prepare($sqlAndamento);
    $stmtAndamento->bind_param("ssi", $comentario, $status, $fase_id);

    if ($stmtAndamento->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $stmtAndamento->error]);
    }

    $stmtAndamento->close();
} else {
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>