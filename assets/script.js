// fazer referencias aos elementos HTML
const input_nome = document.getElementById("nome-tarefa");
const btn_prioridade = document.getElementById("alterar-prioridade");
const items_dropdown = document.querySelectorAll(".dropdown-item");
const div_lista = document.getElementById("list");
const btn_adicionar = document.getElementById("btn-adicionar");
const input_pesquisar = document.getElementById("pesquisar");

// adicionar eventos aos elementos
btn_adicionar.addEventListener("click", adicionarTarefa);
input_pesquisar.addEventListener("input", pesquisarTarefas);

// alterar o prioridade e exibir
items_dropdown.forEach(item => {
    item.addEventListener("click", () => {
        btn_prioridade.textContent = item.textContent;
    });
});

// buscar lista ou inicializar uma nova
let lista_tarefas = JSON.parse(localStorage.getItem("lista_tarefas")) || [];

// exibir lista
exibirTarefas(lista_tarefas);

// criar modal
function criarModal(id, tipo, titulo, conteudo, botoes) {

    const modalId = `${tipo}-${id}`;

    // Verifica se um modal com o mesmo ID já existe no DOM
    const existingModal = document.getElementById(modalId);
    if (existingModal) existingModal.remove(); // Remove para evitar duplicação

    const modal = document.createElement("div");
    modal.className = "modal fade";
    modal.id = modalId;
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
                <div class="modal-body">
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

// abrir modal
function abrirModal(modal) {
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
}

// adicionar uma nova tarefa
function adicionarTarefa(e) {
    e.preventDefault();

    const nome = input_nome.value;
    const prioridade = btn_prioridade.textContent.trim();
    const tarefa = { nome, prioridade };

    // verifica se o usuário preencheu o nome
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

    // verifica se já existe
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

    // adiciona a tarefa na lista e salva no local storage
    lista_tarefas.push(tarefa);
    salvarLista();
    input_nome.value = "";
    btn_prioridade.textContent = "Alta";
    exibirTarefas(lista_tarefas);
}

// salvar lista no local storage
function salvarLista() {
    localStorage.setItem("lista_tarefas", JSON.stringify(lista_tarefas));
}

// editar tarefa
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

// concluir/excluir uma tarefa
function retirarTarefaDaLista(id) {
    lista_tarefas.splice(id, 1);
    salvarLista();
    exibirTarefas(lista_tarefas);
}

// pesquisar tarefa
function pesquisarTarefas(e) {
    const nome = e.target.value;
    const tarefas_filtradas = lista_tarefas.filter(t => t.nome.toLowerCase().includes(nome.toLowerCase()));
    salvarLista();
    exibirTarefas(tarefas_filtradas);
}

// exibir lista de tarefas
function exibirTarefas(lista) {
    div_lista.innerHTML = "";

    if (lista.length == 0) {
        div_lista.innerHTML = "<h3 class='text-center text-light'>Nenhuma tarefa cadastrada.</h3>";
    } else {
        lista.forEach((tarefa, index) => {
            const modal_editar = criarModal(
                index,
                "edit",
                "Editar Tarefa",
                `<form class="d-flex">
                    <input type="text" class="form-control" placeholder="Nome da Tarefa" aria-describedby="basic-addon1" value="${tarefa.nome}" id="nome-edit-${index}">
                    <div class="dropdown ms-4">
                        <button id="prioridade-edit-${index}" class="btn btn-success dropdown-toggle" type="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            ${tarefa.prioridade}
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#">Alta</a></li>
                            <li><a class="dropdown-item" href="#">Média</a></li>
                            <li><a class="dropdown-item" href="#">Baixa</a></li>
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
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="retirarTarefaDaLista(${index})">Salvar</button>`
            );

            const modal_concluir = criarModal(
                index,
                "concluir",
                "Concluir Tarefa",
                `Tem certeza que deseja concluir <strong>${tarefa.nome}</strong>?`,
                `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="retirarTarefaDaLista(${index})">Salvar</button>`
            );

            const li_elem = document.createElement('li');
            li_elem.className = 'list-group-item bg-transparent border-0 d-flex align-items-center justify-content-between';
            li_elem.innerHTML = `
                    <h3 class="text-light fs-4">${tarefa.nome} - ${tarefa.prioridade}</h3>
                    <div class="d-flex align-items-center gap-2 p-2">
                
                    <button type="button" class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#edit-${index}">
                        <i data-feather="edit" class="mb-1"></i> Editar
                    </button>

                    <button type="button" class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#excluir-${index}">
                        <i data-feather="x-circle" class="mb-1"></i> Excluir
                    </button>

                    <button type="button" class="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#concluir-${index}">
                        <i data-feather="check-square" class="mb-1"></i> Concluir
                    </button>
            `;

            li_elem.appendChild(modal_editar);
            li_elem.appendChild(modal_excluir);
            li_elem.appendChild(modal_concluir);
            div_lista.appendChild(li_elem);
        });

        feather.replace();
    }
}
