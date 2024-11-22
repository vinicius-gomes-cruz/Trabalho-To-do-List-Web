// criar referências aos elementos HTML
const input_nome = document.getElementById("nome-tarefa");
const btn_prioridade = document.getElementById("alterar-prioridade");
const items_dropdown = document.querySelectorAll(".dropdown-item");
const div_lista = document.getElementById("list");
const btn_adicionar = document.getElementById("btn-adicionar");
const input_pesquisar = document.getElementById("pesquisar");

// configurar os eventos de clique e input
btn_adicionar.addEventListener("click", adicionarTarefa);
input_pesquisar.addEventListener("input", pesquisarTarefas);

// atualizar o botão de prioridade ao clicar nos itens do dropdown
items_dropdown.forEach(item => {
    item.addEventListener("click", () => {
        btn_prioridade.textContent = item.textContent;
    });
});

// recuperar a lista de tarefas ou inicializar uma nova
let lista_tarefas = JSON.parse(localStorage.getItem("lista_tarefas")) || [];

// exibir a lista de tarefas
exibirTarefas(lista_tarefas);

// função para criar um modal
function criarModal(id, tipo, titulo, conteudo, botoes) {
    const modal_id = `${tipo}-${id}`;

    // verificar se o modal já existe e removê-lo
    const existe_este_modal = document.getElementById(modal_id);
    if (existe_este_modal) existe_este_modal.remove();

    // criar o modal
    const modal = document.createElement("div");
    modal.className = "modal fade";
    modal.id = modal_id;
    modal.tabIndex = "-1";
    modal.setAttribute("aria-labelledby", "exampleModalLabel");
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-center">${titulo}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-light">
                    ${conteudo}
                </div>
                <div class="modal-footer">
                    ${botoes}
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    return modal;
}

// função para abrir um modal
function abrirModal(modal) {
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
}

// função para adicionar uma nova tarefa
function adicionarTarefa(e) {
    e.preventDefault();

    const nome = input_nome.value;
    const prioridade = btn_prioridade.textContent.trim();
    const tarefa = { nome, prioridade };

    // verificar se o nome da tarefa está vazio
    if (!nome) {
        const modal = criarModal(
            0,
            "alert",
            "Atenção!",
            "Preencha o nome!",
            '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>'
        );
        abrirModal(modal);
        return;
    }

    // verificar se a tarefa já existe
    if (lista_tarefas.some(t => t.nome.toLowerCase() == nome.toLowerCase())) {
        const modal = criarModal(
            0,
            "alert",
            "Atenção!",
            "Tarefa já existe!",
            '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>'
        );
        abrirModal(modal);
        return;
    }

    // adicionar a tarefa à lista e salvar
    lista_tarefas.push(tarefa);
    salvarLista();

    // limpar o campo e exibir a lista
    input_nome.value = "";
    btn_prioridade.textContent = "Alta";
    exibirTarefas(lista_tarefas);
}

// função para salvar a lista de tarefas no localStorage
function salvarLista() {
    localStorage.setItem("lista_tarefas", JSON.stringify(lista_tarefas));
}

// função para editar uma tarefa
function editarTarefa(id) {
    const nome = document.querySelector(`#nome-edit-${id}`).value;
    if (nome) {
        const prioridade = document.querySelector(`#prioridade-edit-${id}`).textContent;
        lista_tarefas[id] = { nome, prioridade };
        salvarLista();
        exibirTarefas(lista_tarefas);
    } else {
        const modal = criarModal(
            0,
            "alert",
            "Atenção!",
            "Não pode atualizar para um nome vazio!",
            '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>'
        );
        abrirModal(modal);
    }
}

// função para carregar o nome do input de edição
function carregarNomeProInputEditar(id) {
    document.querySelector(`#nome-edit-${id}`).value = lista_tarefas[id].nome;
}

// função para atualizar a prioridade de uma tarefa
function atualizarPrioridade(id, prior) {
    document.querySelector(`#prioridade-edit-${id}`).textContent = prior;
}

// função para excluir uma tarefa
function retirarTarefaDaLista(id) {
    lista_tarefas.splice(id, 1);
    salvarLista();
    exibirTarefas(lista_tarefas);
}

// função para pesquisar tarefas
function pesquisarTarefas(e) {
    const nome = e.target.value;
    const tarefas_filtradas = lista_tarefas.filter(t => t.nome.toLowerCase().includes(nome.toLowerCase()));
    salvarLista();
    exibirTarefas(tarefas_filtradas);
}

// função para exibir a lista de tarefas
function exibirTarefas(lista) {
    div_lista.innerHTML = "";

    if (lista.length == 0) {
        div_lista.innerHTML = "<h3 class='text-center text-light'>Nenhuma tarefa cadastrada.</h3>";
    } else {
        lista.forEach((tarefa, index) => {
            // criar modais para editar, excluir e concluir a tarefa
            const modal_editar = criarModal(
                index,
                "edit",
                "Editar Tarefa",
                `<form class="d-flex">
                    <input type="text" class="form-control" placeholder="Nome da Tarefa" value="${tarefa.nome}" id="nome-edit-${index}">
                    <div class="dropdown ms-4">
                        <button id="prioridade-edit-${index}" class="btn btn-success dropdown-toggle" type="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            ${tarefa.prioridade}
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#" onclick="atualizarPrioridade(${index}, 'Alta')">Alta</a></li>
                            <li><a class="dropdown-item" href="#" onclick="atualizarPrioridade(${index}, 'Média')">Média</a></li>
                            <li><a class="dropdown-item" href="#" onclick="atualizarPrioridade(${index}, 'Baixa')">Baixa</a></li>
                        </ul>
                    </div>
                </form>`,
                `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="editarTarefa(${index})">Salvar</button>`
            );

            const modal_excluir = criarModal(
                index,
                "excluir",
                "Excluir Tarefa",
                `Tem certeza que deseja excluir <strong>${tarefa.nome}</strong>?`,
                `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onclick="retirarTarefaDaLista(${index})">Excluir</button>`
            );

            const modal_concluir = criarModal(
                index,
                "concluir",
                "Concluir Tarefa",
                `Tem certeza que deseja concluir <strong>${tarefa.nome}</strong>?`,
                `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                <button type="button" class="btn btn-success" data-bs-dismiss="modal" onclick="retirarTarefaDaLista(${index})">Concluir</button>`
            );

            // criar o elemento da tarefa com os botões de ação
            const li_elem = document.createElement('li');
            li_elem.className = 'list-group-item bg-transparent border-0 d-flex align-items-center justify-content-between';
            li_elem.innerHTML = `
                <h3 class="text-light fs-4">${tarefa.nome} - ${tarefa.prioridade}</h3>
                <div class="d-flex align-items-center gap-2 p-2">
                    <button id="btnEdit" type="button" class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#edit-${index}" onclick="carregarNomeProInputEditar(${index})">
                        <i data-feather="edit" class="mb-1"></i> Editar
                    </button>
                    <button type="button" class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#excluir-${index}">
                        <i data-feather="x-circle" class="mb-1"></i> Excluir
                    </button>
                    <button type="button" class="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#concluir-${index}">
                        <i data-feather="check-square" class="mb-1"></i> Concluir
                    </button>
                </div>
            `;

            // adicionar os modais à lista
            li_elem.appendChild(modal_editar);
            li_elem.appendChild(modal_excluir);
            li_elem.appendChild(modal_concluir);
            div_lista.appendChild(li_elem);
        });

        // atualizar os ícones
        feather.replace();
    }
}
