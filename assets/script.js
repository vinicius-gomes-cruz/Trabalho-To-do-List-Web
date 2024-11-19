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
    modal.innerHTML = `
        <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden=true>
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
        </div>
    `;

    document.body.appendChild(modal);

    // Inicializa o modal
    if (tipo == "alert") {
        const bootstrapModal = new bootstrap.Modal(document.getElementById(modalId));
        bootstrapModal.show();
    }
}


// adicionar uma nova tarefa
function adicionarTarefa(e) {
    e.preventDefault();

    const nome = input_nome.value;
    const prioridade = btn_prioridade.textContent.trim();
    const tarefa = { nome, prioridade };

    // verifica se o usuário preencheu o nome
    if (!nome) {
        criarModal(
            -1,
            "alert",
            "Atenção!",
            "Preencha o nome!",
            '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>'
        );
        return;
    }

    // verifica se já existe
    if (lista_tarefas.some(t => t.nome.toLowerCase() == nome.toLowerCase())) {
        criarModal(
            -1,
            "alert",
            "Atenção!",
            "Tarefa já existe!",
            '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>'
        );
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
function atualizarTarefa(id) {
    const nome = document.querySelector(`#nome-edit-${id}`).value;
    if (nome) {
        const prioridade = document.querySelector(`#prioridade-edit-${id}`).textContent;
        lista_tarefas[id] = { nome, prioridade };
        salvarLista();
        exibirTarefas(lista_tarefas);
    } else {
        criarModal(
            -1,
            "alert",
            "Atenção!",
            "Não pode atualizar para um nome vazio!",
            '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>'
        );
    }
}

// concluir/excluir uma tarefa
function excluirTarefa(id) {
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
            const li_elem = `<li class="list-group-item bg-transparent border-0 d-flex align-items-center justify-content-between">
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
            
                                <div class="modal fade" id="edit-${index}" tabindex="-1" aria-labelledby="exampleModalLabel"
                                    aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="exampleModalLabel">Editar Tarefa</h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                                </button>
                                            </div>
                                            <div class="modal-body">
                                                <form class="d-flex">
                                                    <input type="text" class="form-control" placeholder="Nome da Tarefa" aria-describedby="basic-addon1"
                                                    value="${tarefa.nome}" id="nome-edit-${index}">
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
                                                </form>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                                                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="atualizarTarefa(${index})">Salvar</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div class="modal fade" id="excluir-${index}" tabindex="-1" aria-labelledby="exampleModalLabel"
                                    aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="exampleModalLabel">Excluir Tarefa</h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body">
                                                Tem certeza que deseja excluir <strong>${tarefa.nome}</strong>?
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                                                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="excluirTarefa(${index})">Salvar</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div class="modal fade" id="concluir-${index}" tabindex="-1" aria-labelledby="exampleModalLabel"
                                    aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="exampleModalLabel">Excluir Tarefa</h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body">
                                                Concluir <strong>${tarefa.nome}</strong>?
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                                                <button type="button" class="btn btn-success" data-bs-dismiss="modal" onclick="excluirTarefa(${index})">Concluir</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>`;

            div_lista.innerHTML += li_elem;
        });

        feather.replace();
    }
}
