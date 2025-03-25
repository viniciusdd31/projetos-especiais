<?php
$host = 'localhost'; // Altere conforme necessário
$dbname = 'projetos_db';
$username = 'root'; // Altere conforme necessário
$password = ''; // Altere conforme necessário

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $unidade = $_GET['unidade'];
    $stmt = $pdo->prepare("
        SELECT p.nome_projeto, p.descricao AS descricao_projeto, 
               f.nome_fase, f.descricao_fase, f.prazo, a.status, coalesce(a.comentario, '') as comentario
        FROM projetos p
        JOIN fases f ON p.id = f.projeto_id
        LEFT JOIN andamento a ON f.id = a.fase_id
        WHERE p.unidade = :unidade
        ORDER BY f.prazo, p.nome_projeto, f.nome_fase
    ");
    $stmt->execute(['unidade' => $unidade]);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($result);
} catch (PDOException $e) {
    echo 'Erro: ' . $e->getMessage();
}
?>
