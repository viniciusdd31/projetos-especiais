<?php
$pdo = new PDO('mysql:host=localhost;dbname=projetos_db', 'root', '');

// Verifica se a ação foi passada via GET
if (isset($_GET['action']) && $_GET['action'] === 'getProjetosByUnidade') {
    $unidade = $_GET['unidade'];
    $projeto = $_GET['projeto']; // Adicionando a captura do parâmetro 'projeto'
    $ano = $_GET['ano'];

    // Prepara a consulta SQL
    $stmt = $pdo->prepare("
        SELECT p.id, p.nome_projeto, f.id AS fase_id, f.nome_fase, f.prazo, IFNULL(a.status, 'Iniciar') AS status, f.data_inicial 
        FROM projetos p 
        LEFT JOIN fases f ON p.id = f.projeto_id 
        LEFT JOIN andamento a ON f.id = a.fase_id 
        WHERE p.unidade = :unidade AND (YEAR(f.prazo) = :ano OR YEAR(f.data_inicial) = :ano OR a.status IN ('Iniciar', 'Andamento')) 
        AND p.id = :projeto
    ");

    // Executa a consulta com todos os parâmetros
    $stmt->execute([
        'unidade' => $unidade, 
        'ano' => $ano,
        'projeto' => $projeto // Passando o parâmetro 'projeto' para a consulta
    ]);

    $result = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $projetoId = $row['id'];
        if (!isset($result[$projetoId])) {
            $result[$projetoId] = [
                'nome_projeto' => $row['nome_projeto'],
                'fases' => []
            ];
        }
        // Adiciona as fases para cada projeto
        $result[$projetoId]['fases'][] = [
            'nome_fase' => $row['nome_fase'],
            'prazo' => $row['prazo'],
            'data_inicial' => $row['data_inicial'], // Incluindo a data_inicial
            'status' => $row['status']
        ];
    }

    // Retorna os dados no formato JSON
    echo json_encode(array_values($result));
}
?>
