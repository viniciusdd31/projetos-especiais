<?php
$pdo = new PDO('mysql:host=localhost;dbname=projetos_db', 'root', '');

if ($_GET['action'] === 'getUnidades') {
    $stmt = $pdo->query("SELECT DISTINCT unidade FROM projetos");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}

if ($_GET['action'] === 'getProjetosByUnidade') {
    $unidade = $_GET['unidade'];
    $stmt = $pdo->prepare("SELECT id, nome_projeto FROM projetos WHERE unidade = :unidade");
    $stmt->execute(['unidade' => $unidade]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}

if ($_GET['action'] === 'getFasesByProjeto') {
    $projetoId = $_GET['projetoId'];
    $stmt = $pdo->prepare("
        SELECT f.id, f.nome_fase, f.descricao_fase, f.prazo, IFNULL(a.status, 'Pendente') AS status
        FROM fases f
        LEFT JOIN andamento a ON f.id = a.fase_id
        WHERE f.projeto_id = :projetoId
    ");
    $stmt->execute(['projetoId' => $projetoId]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}

if ($_GET['action'] === 'updateStatus') {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $pdo->prepare("
        INSERT INTO andamento (fase_id, status, comentario) 
        VALUES (:id, :status, :comentario)
        ON DUPLICATE KEY UPDATE status = :status, comentario = :comentario
    ");
    $stmt->execute([
        'id' => $data['id'], 
        'status' => $data['status'], 
        'comentario' => $data['comentario'] ?? '' // Comentário opcional
    ]);
    echo json_encode(['status' => 'success']);
}

?>
