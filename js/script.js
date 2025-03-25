document.addEventListener('DOMContentLoaded', function() {
    const unidadeSelect = document.getElementById('unidadeSelect');
    const projetoSelect = document.getElementById('projetoSelect');
    const searchButton = document.getElementById('searchButton');
    const fasesTableBody = document.getElementById('fasesTable').querySelector('tbody');

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    fetch('../php/fetch_unidades.php')
        .then(response => response.json())
        .then(data => {
            data.forEach(unidade => {
                const option = document.createElement('option');
                option.value = unidade.unidade;
                option.textContent = unidade.unidade;
                unidadeSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao carregar as unidades:', error));

    unidadeSelect.addEventListener('change', function() {
        const unidade = unidadeSelect.value;
        if (unidade) {
            fetch(`../php/fetch_projetos.php?unidade=${unidade}`)
                .then(response => response.json())
                .then(data => {
                    projetoSelect.innerHTML = '<option value="">Selecione o Projeto Especial</option>';
                    projetoSelect.disabled = false;
                    data.forEach(projeto => {
                        const option = document.createElement('option');
                        option.value = projeto.id;
                        option.textContent = projeto.nome_projeto;
                        projetoSelect.appendChild(option);
                    });
                })
                .catch(error => console.error('Erro ao carregar os projetos:', error));
        } else {
            projetoSelect.innerHTML = '<option value="">Selecione o Projeto Especial</option>';
            projetoSelect.disabled = true;
            searchButton.disabled = true;
        }
    });

    projetoSelect.addEventListener('change', function() {
        searchButton.disabled = !projetoSelect.value;
    });

    searchButton.addEventListener('click', function() {
        const projetoId = projetoSelect.value;
        if (projetoId) {
            fetch(`../php/fetch_fases.php?projeto=${projetoId}`)
                .then(response => response.json())
                .then(data => {
                    fasesTableBody.innerHTML = '';
                    data.forEach(fase => {
                        const tr = document.createElement('tr');
                        if (new Date(fase.prazo) < new Date()) {
                            tr.classList.add('atrasado');
                        }
                        if (fase.status === 'Concluído') {
                            tr.classList.add('concluido');
                        }
                        tr.innerHTML = `
                            <td>${fase.nome_fase}</td>
                            <td>${fase.descricao_fase}</td>
                            <td>${formatDate(fase.prazo)}</td>
                            <td>${fase.status}</td>
                            <td>${fase.comentario}</td>
                        `;
                        fasesTableBody.appendChild(tr);
                    });
                })
                .catch(error => console.error('Erro ao carregar as fases:', error));
        }
    });
});
