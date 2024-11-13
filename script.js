// fazer referencias aos elementos HTML
const input_nome = document.getElementById("nome-tarefa");
const btn_prioridade = document.getElementById("alterar-prioridade");
const items_dropdown = document.querySelectorAll(".dropdown-item");
const div_lista = document.getElementById("list");
const btn_adicionar = document.getElementById("btn-adicionar");
const btn_cancelar_edicao = document.getElementById("btn-cancelar-edicao");
const btn_atualizar = document.getElementById("btn-atualizar");
const input_pesquisar = document.getElementById("pesquisar");

// criar eventos
btn_adicionar.addEventListener("click", adicionarTarefa);
btn_atualizar.addEventListener("click", () => {
    if (id_tarefa === -1) {
        alert("Selecione uma tarefa primeiro.");
        return;
    }

    const nome = input_nome.value;
    const prioridade = btn_prioridade.textContent;
    lista_tarefas[id_tarefa].nome = nome;
    lista_tarefas[id_tarefa].prioridade = prioridade;
    id_tarefa = -1;
    input_nome.value = "";
    btn_adicionar.style.display = "";
    btn_cancelar_edicao.style.display = "none";
    exibirTarefas(lista_tarefas);
});
btn_cancelar_edicao.style.display = "none";
btn_cancelar_edicao.addEventListener("click", () => {
    id_tarefa = -1;
    input_nome.value = "";
    btn_prioridade.textContent = "Prioridade";
    btn_adicionar.style.display = "";
    btn_cancelar_edicao.style.display = "none";
});
input_pesquisar.addEventListener("input", pesquisarTarefas);

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
exibirTarefas(lista_tarefas);

// adicionar uma nova tarefa
function adicionarTarefa(e) {
    e.preventDefault();

    const nome = input_nome.value;
    const prioridade = btn_prioridade.textContent.trim();
    const tarefa = { nome, prioridade, concluida: false };

    // verifica se o usuário preencheu o nome
    if (!nome) {
        alert("Preencha o nome!");
        return;
    }

    // verifica se o usuário preencheu a prioridade
    if (prioridade == "Prioridade") {
        alert("Selecione um prioridade!");
        return;
    }

    // verifica se já existe
    if (lista_tarefas.some(t => t.nome.toLowerCase() == nome.toLowerCase())) {
        alert("Tarefa já existe!");
        return;
    }

    // adiciona a tarefa na lista e salva no local storage
    lista_tarefas.push(tarefa);
    localStorage.setItem("lista_tarefas", JSON.stringify(lista_tarefas));
    input_nome.value = "";
    btn_prioridade.textContent = "Prioridade";
    exibirTarefas(lista_tarefas);
}

// editar tarefa
function carregarDadosProInput(id) {
    btn_adicionar.style.display = "none";
    btn_cancelar_edicao.style.display = "";

    let tarefa = lista_tarefas[id];
    id_tarefa = id;
    input_nome.value = tarefa.nome;
    btn_prioridade.textContent = tarefa.prioridade;
}

// excluir uma tarefa
function excluirTarefa(id) {
    if (confirm(`Tem certeza que deseja excluir tarefa "${lista_tarefas[id].nome}"`))
        lista_tarefas.splice(id, 1);
    localStorage.setItem("lista_tarefas", JSON.stringify(lista_tarefas));
    exibirTarefas(lista_tarefas);
}

// concluir tarefa
function concluirTarefa(id) {
    lista_tarefas[id].concluida = !lista_tarefas[id].concluida;
    localStorage.setItem("lista_tarefas", JSON.stringify(lista_tarefas));
    exibirTarefas(lista_tarefas);
}

// pesquisar tarefa
function pesquisarTarefas(e) {
    const nome = e.target.value;
    const tarefas_filtradas = lista_tarefas.filter(t => t.nome.toLowerCase().includes(nome.toLowerCase()));
    localStorage.setItem("lista_tarefas", JSON.stringify(lista_tarefas));
    exibirTarefas(tarefas_filtradas);
}

// exibir lista de tarefas
function exibirTarefas(lista) {
    div_lista.innerHTML = "";

    if (lista.length == 0) {
        div_lista.innerHTML = "<h3 class='text-center text-light'>Nenhuma tarefa cadastrada.</h3>";
    } else {

        lista.forEach((tarefa, index) => {
            // ícone com base no prioridade da tarefa
            const icon = tarefa.concluida
                ? '<i data-feather="check-square" class="me-2 text-success"></i>'
                : '<i data-feather="square" class="me-2 text-light"></i>';

            const li_elem = `<li class="list-group-item bg-transparent border-0 d-flex align-items-center justify-content-between">
                        <h3 class="text-light fs-4">${icon} ${tarefa.nome} - ${tarefa.prioridade}</h3>
                        <div class="d-flex align-items-center gap-2">
                            <button class="btn btn-warning" type="button" onclick="carregarDadosProInput(${index})"><i data-feather="edit" class="mb-1"></i>
                                Editar
                            </button>
                            <button class="btn btn-danger" type="button" onclick="excluirTarefa(${index})"><i data-feather="trash-2" class="mb-1"></i>
                                Cancelar
                            </button>
                            <button class="btn btn-success" type="button" onclick="concluirTarefa(${index})"><i data-feather="check-square" class="mb-1"></i>
                                ${tarefa.concluida ? 'Desmarcar' : 'Completar'}
                            </button>
                        </div>
                    </li>`;

            div_lista.innerHTML += li_elem;
        });

        feather.replace();
    }
}
