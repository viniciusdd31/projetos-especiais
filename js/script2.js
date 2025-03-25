document.addEventListener('DOMContentLoaded', function() {
    const projetosContainer = document.getElementById('projetosContainer');

    // Função para calcular o progresso
    function calcularProgresso(statuses) {
        const totalFases = statuses.length;
        const fasesConcluidas = statuses.filter(status => status === 'Concluído').length;

        return (fasesConcluidas / totalFases) * 100;
    }

    // Função para formatar a data
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    // Buscar os dados dos projetos e fases
    fetch('../php/fetch_projetos_com_barra.php')
        .then(response => response.json())
        .then(data => {
            if (!Array.isArray(data)) {
                console.error('Erro: A resposta do servidor não é um array válido.');
                return;
            }

            const projetos = {};

            // Organizar os dados por projeto
            data.forEach(item => {
                if (!item.projeto_id || !item.nome_projeto || !item.unidade || !item.fase_id || !item.status) {
                    console.error('Erro: Dados incompletos', item);
                    return;
                }

                if (!projetos[item.projeto_id]) {
                    projetos[item.projeto_id] = {
                        nome_projeto: item.nome_projeto,
                        unidade: item.unidade,
                        descricao: item.descricao, // Capturando a descrição do projeto
                        fases: [],
                        status: []
                    };
                }

                projetos[item.projeto_id].fases.push({
                    nome_fase: item.nome_fase,
                    prazo: item.prazo,
                    status: item.status
                });

                projetos[item.projeto_id].status.push(item.status);
            });

            // Exibir os projetos e suas barras de progresso
            for (const projetoId in projetos) {
                const projeto = projetos[projetoId];

                const progress = calcularProgresso(projeto.status);

                // Criando o HTML para exibição do projeto
                const projectDiv = document.createElement('div');
                projectDiv.classList.add('project');
                projectDiv.innerHTML = `
                    <div class="project-header">
                        ${projeto.nome_projeto} - ${projeto.unidade}
                        <p class="project-description">${projeto.descricao || 'Sem descrição disponível'}</p> <!-- Exibindo a descrição -->
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${progress}%; background-color: ${getColorForProgress(progress)};">
                            ${Math.round(progress)}%
                        </div>
                    </div>
                    <div class="status">
                        <span>Status: ${projeto.status[projeto.status.length - 1]}</span>
                        <span>Prazo Final: ${formatDate(projeto.fases[projeto.fases.length - 1].prazo)}</span>
                    </div>
                `;

                projetosContainer.appendChild(projectDiv);
            }
        })
        .catch(error => console.error('Erro ao carregar os projetos:', error));

    // Função para determinar a cor da barra de progresso
    function getColorForProgress(progress) {
        if (progress === 100) {
            return '#4CAF50'; // Verde para concluído
        } else if (progress > 0) {
            return '#FFA500'; // Laranja para em andamento
        } else {
            return '#FF6347'; // Vermelho para atrasado
        }
    }
});
