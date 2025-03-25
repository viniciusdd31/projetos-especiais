<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro de Projetos Especiais</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/menu.css">

    <style>
        body {
            font-family: 'Roboto', sans-serif;
            background-color: #f4f6f9;
            margin: 0;
            padding: 20px;
        }

        .container {
            max-width: 80%;
            margin: auto;
            background: #fff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        h1, h2 {
            text-align: center;
            margin-bottom: 20px;
            color: #333;
        }

        label {
            display: block;
            margin-top: 20px;
            font-weight: bold;
            color: #555;
        }

        input, textarea, select {
            width: calc(100% - 20px);
            padding: 10px;
            margin-top: 5px;
            border: 1px solid #ccc;
            border-radius: 4px;
            background: #f9f9f9;
            transition: border-color 0.3s ease;
            box-sizing: border-box;
        }

        select {
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
        }

        input:focus, textarea:focus, select:focus {
            border-color: #4CAF50;
        }

        button {
            padding: 10px 20px;
            margin-top: 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }

        .add-btn {
            background-color: #4CAF50;
            color: white;
            margin-top: 10px;
        }

        .add-btn:hover {
            background-color: #45a049;
        }

        .submit-btn {
            background-color: #2196F3;
            color: white;
            width: 100%;
        }

        .submit-btn:hover {
            background-color: #1976d2;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background: #fff;
            border-radius: 4px;
            overflow: hidden;
        }

        thead th {
            background-color: #8e8e8e;
            color: white;
            padding: 12px;
            text-align: center;
        }

        tbody td {
            padding: 12px;
            border-bottom: 1px solid #ddd;
            color: #333;
            text-align: center;
        }

        tbody tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        .removeBtn {
            background-color: #dc3545;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 14px;
            transition: background-color 0.3s ease;
        }

        .removeBtn:hover {
            background-color: #c82333;
        }

        .table-actions {
            text-align: center;
        }
    </style>
</head>
<body>
    <div id="menu-container"></div><br><br><br>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            fetch('menu.html')
                .then(response => response.text())
                .then(data => {
                    document.getElementById('menu-container').innerHTML = data;
                })
                .catch(error => console.error('Erro ao carregar o menu:', error));
        });
    </script>

    <h1>Cadastro de Projetos Especiais</h1>

    <div class="container">
        <form action="../php/salvar_projeto.php" method="POST">
            <div>
                <label for="nome_projeto">Nome do Projeto</label>
                <input type="text" id="nome_projeto" name="nome_projeto" required>
            </div>

            <div>
                <label for="descricao">Descrição do Projeto</label>
                <textarea id="descricao" name="descricao" required></textarea>
            </div>

            <div>
                <label for="unidade">Unidade</label>
                <select id="unidade" name="unidade" required>
                    <option value="">Selecione a Unidade</option>
                    <?php include '../php/buscar_unidades.php'; ?>
                </select>
            </div>
            
            <div>
                <label for="nome_servidor">Nome do Servidor</label>
                <input type="text" id="nome_servidor" name="nome_servidor" required>
            </div>

            <div>
                <label for="email_servidor">E-mail do Servidor</label>
                <input type="email" id="email_servidor" name="email_servidor" required>
            </div>

            <h2>Fases do Projeto</h2>

            <table id="fases_table">
                <thead>
                    <tr>
                        <th>Nome da Fase</th>
                        <th>Descrição da Fase</th>
                        <th>Data Inicial</th>
                        <th>Prazo</th>
                        <th>Ação</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><input type="text" name="fase_nome[]" required></td>
                        <td><textarea name="fase_descricao[]" required></textarea></td>
                        <td><input type="date" name="fase_data_inicial[]" required></td>
                        <td><input type="date" name="fase_prazo[]" required></td>
                        <td><button type="button" class="removeBtn" onclick="removerFase(this)">Remover</button></td>
                    </tr>
                </tbody>
            </table>

            <button type="button" class="add-btn" onclick="adicionarFase()">Adicionar Fase</button>

            <div>
                <button type="submit" class="submit-btn">Salvar Projeto</button>
            </div>
        </form>
    </div>

    <script>
        function adicionarFase() {
            const table = document.getElementById('fases_table').getElementsByTagName('tbody')[0];
            const newRow = table.insertRow();
            newRow.innerHTML = `
                <td><input type="text" name="fase_nome[]" required></td>
                <td><textarea name="fase_descricao[]" required></textarea></td>
                <td><input type="date" name="fase_data_inicial[]" required></td>
                <td><input type="date" name="fase_prazo[]" required></td>
                <td><button type="button" class="removeBtn" onclick="removerFase(this)">Remover</button></td>
            `;
        }

        function removerFase(button) {
            const row = button.parentElement.parentElement;
            row.remove();
        }
    </script>
</body>
</html>
