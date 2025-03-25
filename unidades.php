<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-cache, must-revalidate");

require 'db.php';

try {
    $query = "SELECT DISTINCT unidade as id, unidade as nome FROM projetos ORDER BY unidade";
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    
    $unidades = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($unidades)) {
        http_response_code(404);
        echo json_encode([
            'status' => 'success',
            'message' => 'Nenhuma unidade encontrada',
            'data' => []
        ]);
        exit;
    }
    
    http_response_code(200);
    echo json_encode($unidades, JSON_UNESCAPED_UNICODE);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Erro no servidor',
        'debug' => $e->getMessage()
    ]);
}
?>