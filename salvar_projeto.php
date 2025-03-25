<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "projetos_db";

try {
    // Criando a conexão
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Verificando a conexão
    if ($conn->connect_error) {
        throw new Exception("Conexão falhou: " . $conn->connect_error);
    }

    // Verificando se os dados do formulário foram enviados
    if (
        isset($_POST['nome_projeto'], $_POST['descricao'], $_POST['unidade'], 
              $_POST['nome_servidor'], $_POST['email_servidor'])
    ) {
        $nome_projeto = $_POST['nome_projeto'];
        $descricao = $_POST['descricao'];
        $unidade = $_POST['unidade'];
        $nome_servidor = $_POST['nome_servidor'];
        $email_servidor = $_POST['email_servidor'];

        // Inserindo o projeto na tabela 'projetos'
        $stmtProjeto = $conn->prepare(
            "INSERT INTO projetos (nome_projeto, descricao, unidade, nome_servidor, email_servidor) 
             VALUES (?, ?, ?, ?, ?)"
        );
        $stmtProjeto->bind_param("sssss", $nome_projeto, $descricao, $unidade, $nome_servidor, $email_servidor);

        if ($stmtProjeto->execute()) {
            $projetoId = $stmtProjeto->insert_id; // Pegando o ID do projeto inserido

            // Inserindo as fases (se existirem)
            if (isset($_POST['fase_nome'], $_POST['fase_descricao'], $_POST['fase_prazo'], $_POST['fase_data_inicial'])) {
                $fase_nome = $_POST['fase_nome'];
                $fase_descricao = $_POST['fase_descricao'];
                $fase_prazo = $_POST['fase_prazo'];
                $fase_data_inicial = $_POST['fase_data_inicial'];

                $stmtFase = $conn->prepare(
                    "INSERT INTO fases (projeto_id, nome_fase, descricao_fase, prazo, data_inicial) 
                     VALUES (?, ?, ?, ?, ?)"
                );

                foreach ($fase_nome as $index => $nome_fase) {
                    $descricao_fase = $fase_descricao[$index];
                    $prazo_fase = $fase_prazo[$index];
                    $data_inicial_fase = $fase_data_inicial[$index];
                    $stmtFase->bind_param("issss", $projetoId, $nome_fase, $descricao_fase, $prazo_fase, $data_inicial_fase);
                    $stmtFase->execute();
                }
                $stmtFase->close();
            }

            echo "<script type='text/javascript'>
                alert('Salvo com sucesso!');
                window.location.href = 'http://localhost/projetos-especiais/';
              </script>";
        } else {
            throw new Exception("Erro ao salvar o projeto: " . $stmtProjeto->error);
        }

        $stmtProjeto->close();
    } else {
        throw new Exception("Dados do formulário estão incompletos.");
    }
} catch (Exception $e) {
    echo "Erro: " . $e->getMessage();
} finally {
    $conn->close();
}
?>
