// arquivo: scripts.js


document.addEventListener("DOMContentLoaded", () => {
    const unidadeSelect = document.getElementById("unidade");
    const projetoSelect = document.getElementById("projeto");
    const tabelaFasesBody = document.querySelector("table tbody");
    const modal = document.getElementById("modal-editar");
    const modalAdicionar = document.getElementById("modal-adicionar");
    const formEditar = document.getElementById("form-editar");
    const formAdicionar = document.getElementById("form-adicionar");
    const cancelarEditarBtn = document.getElementById("cancelar-editar");
    const cancelarAdicionarBtn = document.getElementById("cancelar-adicionar");
    const addFaseBtn = document.getElementById("add-fase");

    let fases = []; // Cache para armazenar as fases do projeto atual.
    let faseSelecionada = null; // Fase sendo editada.

    // Função para abrir o modal de adição de fase
    function abrirModalAdicionar() {
        modalAdicionar.classList.add("show");
    }

    // Função para fechar o modal de adição de fase
    function fecharModalAdicionar() {
        modalAdicionar.classList.remove("show");
    }

    // Função para adicionar uma nova fase
    async function adicionarFase(event) {
        event.preventDefault();

        const projetoId = projetoSelect.value;
        if (!projetoId) {
            alert("Selecione um projeto antes de adicionar uma fase.");
            return;
        }

        const novaFase = {
            projeto_id: projetoId,
            nome_fase: formAdicionar["nome-fase"].value,
            descricao: formAdicionar["descricao"].value,
            data_inicial: formAdicionar["data-inicial"].value,
            prazo: formAdicionar["prazo"].value,
            status: formAdicionar["status"].value,
            comentario: formAdicionar["comentario"].value
        };

        try {
            const response = await fetch("../php/adicionar_fase.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novaFase)
            });

            if (response.ok) {
                fecharModalAdicionar();
                carregarFases(projetoId); // Recarrega as fases na tabela
            } else {
                console.error("Erro ao adicionar a fase.");
            }
        } catch (error) {
            console.error("Erro ao adicionar fase:", error);
        }
    }


        async function carregarUnidades() {
            try {
                console.log('Iniciando carregamento de unidades...');
                
                const response = await fetch('../php/unidades.php?_=' + new Date().getTime());
                
                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
                
                const unidades = await response.json();
                
                // Mantém a opção padrão e adiciona as novas
                unidadeSelect.innerHTML = '<option value="">Selecione a unidade</option>';
                
                unidades.forEach(unidade => {
                    const option = new Option(unidade.nome, unidade.id);
                    unidadeSelect.add(option);
                });
                
                console.log('Unidades carregadas com sucesso!');
                
            } catch (error) {
                console.error('Erro ao carregar unidades:', error);
                unidadeSelect.innerHTML = '<option value="">Erro ao carregar unidades</option>';
            }
        }


// Função para carregar projetos com base na unidade selecionada
async function carregarProjetos(unidadeId) {
    try {
        const response = await fetch(`../php/projetos.php?unidade_id=${unidadeId}`);
        const projetos = await response.json();


        projetoSelect.innerHTML = '<option value="">Selecione o projeto</option>';
        projetoSelect.disabled = false;


        projetos.forEach(projeto => {
            projetoSelect.innerHTML += `<option value="${projeto.id}">${projeto.nome_projeto}</option>`;
        });
    } catch (error) {
        console.error("Erro ao carregar projetos:", error);
    }
}


// Função para carregar fases de um projeto
async function carregarFases(projetoId) {
    try {
        const response = await fetch(`../php/fases.php?projeto_id=${projetoId}`);
        fases = await response.json();


        tabelaFasesBody.innerHTML = "";
        fases.forEach(fase => {
            const atrasado = verificarAtraso(fase.prazo, fase.status);
            tabelaFasesBody.innerHTML += `
                <tr data-id="${fase.id}">
                    <td>${fase.nome_fase}</td>
                    <td>${fase.descricao_fase}</td>
                    <td>${fase.data_inicial}</td>
                    <td>${fase.prazo}</td>
                    <td>${fase.status}</td>
                    <td>${fase.comentario}</td>
                    <td class="${atrasado ? 'atrasado' : ''}">${atrasado ? "Sim" : "Não"}</td>
                    <td><button class="edit">Editar</button></td>
                    <td><button class="delete">Remover</button></td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Erro ao carregar fases:", error);
    }
}


// Verificar se a fase está atrasada
function verificarAtraso(prazo, status) {
    const hoje = new Date().toISOString().split("T")[0];
    return prazo < hoje && status !== "Concluído";
}


// Abrir modal de edição
function abrirModal(fase) {
    modal.classList.add("show");
    faseSelecionada = fase;


    formEditar["nome-fase"].value = fase.nome_fase;
    formEditar["descricao"].value = fase.descricao_fase;
    formEditar["data-inicial"].value = fase.data_inicial;
    formEditar["prazo"].value = fase.prazo;
    formEditar["status"].value = fase.status;
    formEditar["comentario"].value = fase.comentario;
}


// Fechar modal
function fecharModal() {
    modal.classList.remove("show");
    faseSelecionada = null;
}


// Salvar alterações na fase
async function salvarEdicao(event) {
    event.preventDefault();

    try {
        const dadosAtualizados = {
            id: faseSelecionada.id,
            nome_fase: formEditar["nome-fase"].value,
            descricao: formEditar["descricao"].value,
            data_inicial: formEditar["data-inicial"].value,
            prazo: formEditar["prazo"].value,
            status: formEditar["status"].value,
            comentario: formEditar["comentario"].value
        };

        const response = await fetch("../php/editar_fase.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosAtualizados)
        });

        if (response.ok) {
            fecharModal();
            carregarFases(projetoSelect.value); // Recarrega as fases na tabela
        } else {
            console.error("Erro ao editar a fase.");
        }
    } catch (error) {
        console.error("Erro ao salvar a edição:", error);
    }
}

// Remover fase
async function removerFase(faseId) {
    try {
        const response = await fetch(`../php/remover_fase.php?id=${faseId}`, { method: "DELETE" });


        if (response.ok) {
            carregarFases(projetoSelect.value);
        } else {
            console.error("Erro ao remover a fase.");
        }
    } catch (error) {
        console.error("Erro ao remover fase:", error);
    }
}


// Eventos
unidadeSelect.addEventListener("change", () => {
    const unidadeId = unidadeSelect.value;
    if (unidadeId) carregarProjetos(unidadeId);
});


projetoSelect.addEventListener("change", () => {
    const projetoId = projetoSelect.value;
    if (projetoId) carregarFases(projetoId);
});


tabelaFasesBody.addEventListener("click", (event) => {
    const btn = event.target;
    const linha = btn.closest("tr");
    const faseId = linha.dataset.id;
    const fase = fases.find(f => f.id === parseInt(faseId));


    if (btn.classList.contains("edit")) abrirModal(fase);
    if (btn.classList.contains("delete")) removerFase(faseId);
});


cancelarEditarBtn.addEventListener("click", fecharModal);
formEditar.addEventListener("submit", salvarEdicao);




    // Função para abrir o modal de adição de fase
    function abrirModalAdicionar() {
        modalAdicionar.classList.add("show");
    }

    // Função para fechar o modal de adição de fase
    function fecharModalAdicionar() {
        modalAdicionar.classList.remove("show");
    }

    // Função para adicionar uma nova fase
    async function adicionarFase(event) {
        event.preventDefault();

        const projetoId = projetoSelect.value;
        if (!projetoId) {
            alert("Selecione um projeto antes de adicionar uma fase.");
            return;
        }

        const novaFase = {
            projeto_id: projetoId,
            nome_fase: formAdicionar["nome-fase"].value,
            descricao: formAdicionar["descricao"].value,
            data_inicial: formAdicionar["data-inicial"].value,
            prazo: formAdicionar["prazo"].value,
            status: formAdicionar["status"].value,
            comentario: formAdicionar["comentario"].value
        };

        try {
            const response = await fetch("../php/adicionar_fase.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novaFase)
            });

            if (response.ok) {
                fecharModalAdicionar();
                carregarFases(projetoId); // Recarrega as fases na tabela
            } else {
                console.error("Erro ao adicionar a fase.");
            }
        } catch (error) {
            console.error("Erro ao adicionar fase:", error);
        }
    }

    // Evento para abrir o modal de adição de fase
    addFaseBtn.addEventListener("click", abrirModalAdicionar);

    // Evento para fechar o modal de adição de fase
    cancelarAdicionarBtn.addEventListener("click", fecharModalAdicionar);

    // Evento para submeter o formulário de adição de fase
    formAdicionar.addEventListener("submit", adicionarFase);







// Inicialização
carregarUnidades();

});
