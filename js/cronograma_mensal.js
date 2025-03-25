document.addEventListener('DOMContentLoaded', function () {
    // Carregar unidades
    fetch('../php/fetch_unidades.php')
        .then(response => response.json())
        .then(data => {
            const unidadeSelect = document.getElementById('unidadeSelect');
            data.forEach(function (unidade) {
                const option = document.createElement('option');
                option.value = unidade.unidade;
                option.textContent = unidade.unidade;
                unidadeSelect.appendChild(option);
            });
            unidadeSelect.disabled = false;
        })
        .catch(error => console.error('Erro ao carregar unidades:', error));

    // Atualizar projetos quando uma unidade for selecionada
    document.getElementById('unidadeSelect').addEventListener('change', function () {
        const unidade = this.value;
        const projetoSelect = document.getElementById('projetoSelect');
        projetoSelect.innerHTML = '<option value="">Selecione</option>'; // Limpar projetos anteriores

        if (unidade) {
            // Buscar projetos da unidade selecionada
            fetch(`../php/fetch_projetos.php?unidade=${unidade}`)
                .then(response => response.json())
                .then(projetos => {
                    projetos.forEach(function (projeto) {
                        const option = document.createElement('option');
                        option.value = projeto.id;
                        option.textContent = projeto.nome_projeto;
                        projetoSelect.appendChild(option);
                    });
                    projetoSelect.disabled = false;
                })
                .catch(error => console.error('Erro ao carregar projetos:', error));
        } else {
            projetoSelect.disabled = true; // Desabilitar o select de projeto se nenhuma unidade for selecionada
        }

        // Ativar o botão de busca
        document.getElementById('searchButton').disabled = !this.value;
    });

    // Ativar botão de busca ao selecionar um projeto
    document.getElementById('projetoSelect').addEventListener('change', function () {
        document.getElementById('searchButton').disabled = !(this.value && document.getElementById('unidadeSelect').value);
    });

    // Buscar e exibir dados ao clicar no botão
    document.getElementById('searchButton').addEventListener('click', function () {
        const unidade = document.getElementById('unidadeSelect').value;
        const projeto = document.getElementById('projetoSelect').value;
        const ano = document.getElementById('anoSelect').value;

        fetch(`../php/cronograma_mensal.php?action=getProjetosByUnidade&unidade=${unidade}&projeto=${projeto}&ano=${ano}`)
            .then(response => response.json())
            .then(data => {
                const tbody = document.getElementById('cronogramaTable').querySelector('tbody');
                tbody.innerHTML = '';

                // Adicionar cabeçalho de meses
                const monthsHeader = document.createElement('tr');
                monthsHeader.innerHTML = `
                    <th>Projeto Especial</th>
                    <th>Fase</th>
                `;
                for (let mes = 0; mes < 12; mes++) {
                    const date = new Date(ano, mes, 1);
                    const monthName = date.toLocaleString('pt-BR', { month: 'short' });
                    const th = document.createElement('th');
                    th.className = 'mes';
                    th.textContent = `${monthName}`;
                    monthsHeader.appendChild(th);
                }
                document.querySelector('#cronogramaTable thead').innerHTML = '';
                document.querySelector('#cronogramaTable thead').appendChild(monthsHeader);

                // Preencher a tabela
                data.forEach(function (projeto) {
                    projeto.fases.forEach(function (fase) {
                        const tr = document.createElement('tr');
                        const dataInicio = new Date(fase.data_inicial);
                        const prazo = new Date(fase.prazo);
                        const hoje = new Date();

                        tr.innerHTML = `
                            <td>${projeto.nome_projeto}</td>
                            <td>${fase.nome_fase}</td>
                        `;

                        for (let mes = 0; mes < 12; mes++) {
                            const td = document.createElement('td');
                            const dataColunaInicio = new Date(ano, mes, 1); // Primeiro dia do mês
                            const dataColunaFim = new Date(ano, mes + 1, 0); // Último dia do mês

                            // Verificar status da fase
                            if (
                                (dataInicio >= dataColunaInicio && dataInicio <= dataColunaFim) || // Começa no mês
                                (prazo >= dataColunaInicio && prazo <= dataColunaFim) || // Termina no mês
                                (dataInicio <= dataColunaInicio && prazo >= dataColunaFim) // Abrange todo o mês
                            ) {
                                if (fase.status === 'Concluído') {
                                    // Concluído: verde claro para o intervalo
                                    td.style.backgroundColor = '#CCFFCC'; // Verde claro
                                    if (
                                        dataInicio.getTime() === dataColunaInicio.getTime() ||
                                        prazo.getTime() === dataColunaFim.getTime()
                                    ) {
                                        td.style.backgroundColor = '#88FF88'; // Verde mais escuro
                                    }
                                } else if (hoje > prazo) {
                                    // Atrasado: vermelho claro para o intervalo
                                    td.style.backgroundColor = '#FFCCCC'; // Vermelho claro
                                    if (
                                        dataInicio.getTime() === dataColunaInicio.getTime() ||
                                        prazo.getTime() === dataColunaFim.getTime()
                                    ) {
                                        td.style.backgroundColor = '#FF8888'; // Vermelho mais escuro
                                    }
                                } else {
                                    // Dentro do prazo (não atrasado): amarelo claro
                                    td.style.backgroundColor = '#FFFFCC'; // Amarelo claro
                                    if (
                                        dataInicio.getTime() === dataColunaInicio.getTime() ||
                                        prazo.getTime() === dataColunaFim.getTime()
                                    ) {
                                        td.style.backgroundColor = '#FFEE88'; // Amarelo mais escuro
                                    }
                                }
                            }

                            // Adicionar a célula à linha
                            tr.appendChild(td);
                        }
                        tbody.appendChild(tr);
                    });
                });
            })
            .catch(error => console.error('Erro ao carregar cronograma:', error));
    });
});
