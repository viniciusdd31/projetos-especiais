<?php
$host = "localhost";
$username = "root";
$password = "";
$dbname = "projetos_db";

// Conexão com o banco de dados
$conn = new mysqli($host, $username, $password, $dbname);

// Verificando a conexão
if ($conn->connect_error) {
    die("Falha na conexão com o banco de dados: " . $conn->connect_error);
}

// Buscando as unidades na tabela
$sql = "SELECT id, unidade FROM unidade ORDER BY unidade ASC";
$result = $conn->query($sql);

// Verificando se há resultados
if ($result->num_rows > 0) {
    // Gerando as opções do select
    while ($row = $result->fetch_assoc()) {
        echo "<option value='" . htmlspecialchars($row['unidade'], ENT_QUOTES, 'UTF-8') . "'>" . htmlspecialchars($row['unidade'], ENT_QUOTES, 'UTF-8') . "</option>";
    }
} else {
    echo "<option value=''>Nenhuma unidade encontrada</option>";
}

$conn->close();
?>
