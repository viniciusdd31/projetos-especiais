<?php
include 'db.php';

if (isset($_GET['unidade'])) {
    $unidade = $_GET['unidade'];

    try {
        $stmt = $pdo->prepare("SELECT id, nome_projeto FROM projetos WHERE unidade = :unidade ORDER BY nome_projeto");
        $stmt->bindParam(':unidade', $unidade, PDO::PARAM_STR);
        $stmt->execute();
        $projetos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($projetos);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Unidade não fornecida']);
}
?>
