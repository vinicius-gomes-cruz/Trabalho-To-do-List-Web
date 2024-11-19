// fazer referencias aos elementos HTML
const input_nome = document.getElementById("nome-tarefa");
const btn_prioridade = document.getElementById("alterar-prioridade");
const items_dropdown = document.querySelectorAll(".dropdown-item");
const div_lista = document.getElementById("list");
const btn_adicionar = document.getElementById("btn-adicionar");
const input_pesquisar = document.getElementById("pesquisar");

// criar eventos
btn_adicionar.addEventListener("click", adicionar_tarefa);

input_pesquisar.addEventListener("input", pesquisar_tarefas);

// alterar o prioridade e exibir
items_dropdown.forEach(item => {
    item.addEventListener("click", () => {
        btn_prioridade.textContent = item.textContent;
    });
});

// variaveis
let id_tarefa = -1;

// buscar lista ou inicializar uma nova
let lista_tarefas = JSON.parse(localStorage.getItem("lista_tarefas")) || [];

// exibir lista
exibir_tarefas(lista_tarefas);

// adicionar uma nova tarefa
function adicionar_tarefa(e) {
    e.preventDefault();

    const nome = input_nome.value;
    const prioridade = btn_prioridade.textContent.trim();
    const tarefa = { nome, prioridade};

    // verifica se o usuário preencheu o nome
    if (!nome) {
        alert("Preencha o nome!"); // modal
        return;
    }

    // verifica se já existe
    if (lista_tarefas.some(t => t.nome.toLowerCase() == nome.toLowerCase())) {
        alert("Tarefa já existe!"); // modal
        return;
    }

    // adiciona a tarefa na lista e salva no local storage
    lista_tarefas.push(tarefa);
    salvar_lista()
    input_nome.value = "";
    btn_prioridade.textContent = "Alta";
    exibir_tarefas(lista_tarefas);
}

// salvar lista no local storage
function salvar_lista() {
    localStorage.setItem("lista_tarefas", JSON.stringify(lista_tarefas));
}

// editar tarefa
function atualizar_tarefa(id) {
    const nome = document.querySelector("#nome-edit").value;
    if (nome) {
        const prioridade = document.querySelector("#prioridade-edit").textContent;
        lista_tarefas[id] = { nome, prioridade };
        salvar_lista();
        exibir_tarefas(lista_tarefas);
    } else {
        alert("Preencha o nome!"); // modal
    }
}

// excluir uma tarefa
function excluir_tarefa(id) {
    lista_tarefas.splice(id, 1);
    salvar_lista()
    exibir_tarefas(lista_tarefas);
}

// concluir tarefa
function concluir_tarefa(id) {
    lista_tarefas.splice(id, 1);
    salvar_lista()
    exibir_tarefas(lista_tarefas);
}

// pesquisar tarefa
function pesquisar_tarefas(e) {
    const nome = e.target.value;
    const tarefas_filtradas = lista_tarefas.filter(t => t.nome.toLowerCase().includes(nome.toLowerCase()));
    salvar_lista()
    exibir_tarefas(tarefas_filtradas);
}

// exibir lista de tarefas
function exibir_tarefas(lista) {
    div_lista.innerHTML = "";

    if (lista.length == 0) {
        div_lista.innerHTML = "<h3 class='text-center text-light'>Nenhuma tarefa cadastrada.</h3>";
    } else {

        lista.forEach((tarefa, index) => {
            console.log(tarefa.nome);
            const li_elem = `<li class="list-group-item bg-transparent border-0 d-flex align-items-center justify-content-between">
                            <h3 class="text-light fs-4">${tarefa.nome} - ${tarefa.prioridade}</h3>
                            <div class="d-flex align-items-center gap-2 p-2">
                                <button type="button" class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#edit-${index}">
                                    <i data-feather="edit" class="mb-1"></i> Editar
                                </button>
            
                                <div class="modal fade" id="edit-${index}" tabindex="-1" aria-labelledby="exampleModalLabel"
                                    aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="exampleModalLabel">Editar Tarefa</h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                    aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body">
                                                <form class="d-flex">
                                                    <input type="text" class="form-control" placeholder="Nome da Tarefa" aria-describedby="basic-addon1"
                                                    value="${tarefa.nome}">
                                                    <div class="dropdown ms-4">
                                                        <button id="prioridade-edit" class="btn btn-success dropdown-toggle" type="button"
                                                            data-bs-toggle="dropdown" aria-expanded="false">
                                                            ${tarefa.prioridade}
                                                        </button>
                                                        <ul class="dropdown-menu">
                                                            <li><a class="dropdown-item" href="#">Alta</a></li>
                                                            <li><a class="dropdown-item" href="#">Media</a></li>
                                                            <li><a class="dropdown-item" href="#">Baixa</a></li>
                                                        </ul>
                                                    </div>
                                                </form>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                                                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="atualizar_tarefa(${index})">Salvar</button>
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
