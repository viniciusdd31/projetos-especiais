document.addEventListener('DOMContentLoaded', function() {
    fetch('../php/kanban.php?action=getUnidades')
        .then(response => response.json())
        .then(data => {
            const unidadeSelect = document.getElementById('unidadeSelect');
            data.forEach(unidade => {
                const option = document.createElement('option');
                option.value = unidade.unidade;
                option.textContent = unidade.unidade;
                unidadeSelect.appendChild(option);
            });
        });

    document.getElementById('unidadeSelect').addEventListener('change', function() {
        const unidade = this.value;
        const projetoSelect = document.getElementById('projetoSelect');
        projetoSelect.disabled = true;
        projetoSelect.innerHTML = '<option value="">Selecione o Projeto</option>';

        if (unidade) {
            fetch(`../php/kanban.php?action=getProjetosByUnidade&unidade=${unidade}`)
                .then(response => response.json())
                .then(data => {
                    data.forEach(projeto => {
                        const option = document.createElement('option');
                        option.value = projeto.id;
                        option.textContent = projeto.nome_projeto;
                        projetoSelect.appendChild(option);
                    });
                    projetoSelect.disabled = false;
                });
        }
    });

    document.getElementById('projetoSelect').addEventListener('change', function() {
        const projetoId = this.value;
        if (projetoId) {
            fetch(`../php/kanban.php?action=getFasesByProjeto&projetoId=${projetoId}`)
                .then(response => response.json())
                .then(data => {
                    const statuses = {
                        'Pendente': 'pendente',
                        'Em Progresso': 'em-progresso',
                        'Concluído': 'concluido',
                        'Em Andamento': 'em-progresso',
                        'Iniciar': 'pendente'
                    };
                    Object.keys(statuses).forEach(status => {
                        const column = document.getElementById(statuses[status]);
                        if (column) {
                            column.innerHTML = '';
                        }
                    });

                    data.forEach(fase => {
                        const card = document.createElement('div');
                        card.className = 'kanban-card';
                        card.draggable = true;
                        card.dataset.id = fase.id;
                        card.dataset.status = fase.status;
                        card.innerHTML = `
                            <h3>${fase.nome_fase}</h3>
                            <p>${fase.descricao_fase}</p>
                            <p><strong>Prazo:</strong> ${new Date(fase.prazo).toLocaleDateString('pt-BR')}</p>
                        `;
                        const column = document.getElementById(statuses[fase.status]);
                        if (column) {
                            column.appendChild(card);
                        }

                        card.addEventListener('dragstart', dragStart);
                    });
                });
        }
    });

    function dragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.dataset.id);
    }

    document.querySelectorAll('.kanban-cards').forEach(column => {
        column.addEventListener('dragover', event => event.preventDefault());
        column.addEventListener('drop', function(event) {
            event.preventDefault();
            const id = event.dataTransfer.getData('text/plain');
            const card = document.querySelector(`[data-id='${id}']`);
            const newStatus = this.parentElement.dataset.status;

            if (card && newStatus) {
                card.dataset.status = newStatus;
                this.appendChild(card);

                fetch('../php/kanban.php?action=updateStatus', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id, status: newStatus })
                })
                .then(response => response.json())
                .then(result => console.log(result));
            }
        });
    });
});
