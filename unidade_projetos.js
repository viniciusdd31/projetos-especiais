document.addEventListener('DOMContentLoaded', function() {
    // Carregar unidades
    fetch('../php/fetch_unidades.php')
        .then(response => response.json())
        .then(data => {
            const unidadeSelect = document.getElementById('unidadeSelect');
            data.forEach(function(unidade) {
                const option = document.createElement('option');
                option.value = unidade.unidade;
                option.textContent = unidade.unidade;
                unidadeSelect.appendChild(option);
            });
            unidadeSelect.disabled = false;
        })
        .catch(error => console.error('Erro ao carregar unidades:', error));

    // Buscar projetos e fases ao selecionar unidade
    document.getElementById('unidadeSelect').addEventListener('change', function() {
        const unidade = this.value;
        document.getElementById('searchButton').disabled = !unidade;
    });

    document.getElementById('searchButton').addEventListener('click', function() {
        const unidade = document.getElementById('unidadeSelect').value;
        fetch('../php/fetch_projetos_fases.php?unidade=' + unidade)
            .then(response => response.json())
            .then(data => {
                const tbody = document.getElementById('projetosTable').querySelector('tbody');
                tbody.innerHTML = '';
                data.forEach(function(item) {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${item.nome_projeto}</td>
                        <td>${item.descricao_projeto}</td>
                        <td>${item.nome_fase}</td>
                        <td>${item.descricao_fase}</td>
                        <td>${new Date(item.prazo).toLocaleDateString('pt-BR')}</td>
                        <td>${item.status}</td>
                        <td>${item.comentario}</td>
                    `;
                    if (item.status === 'Concluído') {
                        tr.style.backgroundColor = '#d4edda'; // Verde claro para Concluído
                    } else if (new Date(item.prazo) < new Date() && item.status !== 'Concluído') {
                        tr.style.backgroundColor = '#f8d7da'; // Vermelho claro para atrasado
                    } else {
                        tr.style.backgroundColor = ''; // Branco ou incolor para outros casos
                    }
                    tbody.appendChild(tr);
                });
            })
            .catch(error => console.error('Erro ao carregar projetos e fases:', error));
    });
});
