//---------------------------------------2------------------------------------------------
//A tarefa criada não pode ir diretamente para o HTML.
//Ela precisa ser armazenada em um banco para então ser acessada pela função 'criarItem'
//Vamos usar local storage e criar uma variável para simular o banco e integrá-la com o 
//local storage
//O banco vai ser um array de objetos
// banco = []

//---------------------------------------1------------------------------------------------
//Ao invés de criar um label estático pelo HTML, usar uma função para criá-lo de forma 
//dinâmica
/* Forma estática:
<label class='todo__item'>
    <input type='checkbox'>
    <div>teste de item 1</div>
    <input type='button' value='X>
</label>
*/
//A função vai receber o argumento 'tarefa' e colocá-la no texto da div da label
//A função vai receber o argumento 'status' para determinar se a label está 'checked' ou não
//A função vai receber o argumento 'indice' para diferenciar as tarefas e assim, sabermos
//qual tarefa foi clicada
const criarItem = (tarefa, status, indice) => {
    //criação da label
    const item = document.createElement('label')
    //adicionando o label à classe 'todo__item'
    item.classList.add('todo__item')
    //adicionando as partes da label (igual seria no HTML)
    item.innerHTML = `
        <input type='checkbox' ${status} data-indice=${indice}>
        <div>${tarefa}</div>
        <input type='button' value='X' data-indice=${indice}>
    `
    //adicionando a label que acabamos de criar ao todoList
    document.getElementById('todoList').appendChild(item)
}

//----------------------------------------4------------------------------------------------
//Função para limpar as tarefas 
const limparTarefas = () => {
    //atribuindo uma variável ao elemento do HTML
    const todoList = document.getElementById('todoList')
    //Enquanto houver algum 'filho' do elemento todoList, ou seja, enquanto houver alguma 
    //tarefa, a função vai remover a última tarefa repetidamente até que a última seja a 
    //primeira.
    while(todoList.firstChild) {
        todoList.removeChild(todoList.lastChild)
    }
}

//----------------------------------------3------------------------------------------------
//Função que vai ler o banco de dados e chamar a função 'criarItem' para criar uma label 
//para cada elemento do array
const atualizarTela = () => {
    //Antes de atualizar a tela, é preciso limpar as tarefas que já estão no banco.
    //Senão, quando o atualizarTela() for executado, ele vai repetir as tarefas que já 
    //estavam na tela e não apenas acrescentar a nova tarefa
    limparTarefas()
    const banco = getBanco()
    //forEach é um método do array que percorre todo o array item a item
    //Se fizermos dessa forma:
    //banco.forEach(criarItem)
    //a função 'criarItem' vai apenas retornar um objeto ([object Object])
    //Por isso, para cada objeto no array, temos que pegar o item (label) e o índice e 
    //mandá-lo para a função criarItem com os argumentos desejados
    banco.forEach((item, indice) => criarItem(item.tarefa, item.status, indice))
}

//----------------------------------------5------------------------------------------------
//Atualizar o banco quando o usuário pressionar 'Enter' no input 'text' do HTML
const inserirTarefa = (evento) => {
    //Note que o argumento 'keypress' não atende nossa demanda. Queremos que seja adicionada 
    //uma nova tarefa no banco somente quando o 'Enter' for pressionado. Por isso, 
    //adicionamos o  argumento 'evento' do 'addEventListener' para sabermos a tecla pressionada
    const tecla = evento.key
    const textoTarefa = evento.target.value
    if(tecla === 'Enter') {
        const banco = getBanco()
        //Método 'push' adiciona um objeto ao final do array
        banco.push({'tarefa': textoTarefa, 'status': ''})
        setBanco(banco)
        atualizarTela()
        //Limpar o campo de texto do 'newItem' para não ficar o resquício da tarefa nova
        evento.target.value = ''
    }
}

//Acionar função para adicionar nova tarefa ao banco
document.getElementById('newItem').addEventListener('keypress', inserirTarefa)

//----------------------------------------6------------------------------------------------
//Fazer com que os cliques nas caixas das tarefas mudem suas características
const clickItem = (evento) => {
    const elemento = evento.target
    //se o clique for no botão de 'X', então apagar a tarefa
    if(elemento.type === 'button') {
        const indice = elemento.dataset.indice
        removerItem(indice)
    //fazer com que, clicando na tarefa e ela ficando riscada, atualizar esse status no banco
    } else if(elemento.type === 'checkbox') {
        const indice = elemento.dataset.indice
        atualizarStatus(indice)
    }
}

//Função para remover do array a tarefa
const removerItem = (indice) => {
    //método 'splice' permite recortar ou modificar o array
    //parâmetros:
    //(a partir do índice x, remover 1 elemento)
    const banco = getBanco()
    banco.splice(indice, 1)
    setBanco(banco)
    atualizarTela()
}

//Função para atualizar o status da tarefa
const atualizarStatus = (indice) => {
    const banco = getBanco()
    if(banco[indice].status === 'checked') {
        banco[indice].status = ''
    } else {
        banco[indice].status = 'checked'
    }
    setBanco(banco)
    atualizarTela()
}

//Acionar função mediante ao clique na caixa da tarefa para marcá-la como feita ou apagá-la
document.getElementById('todoList').addEventListener('click', clickItem)

//----------------------------------------7----------------------------------------------
//Precisamos deixar as tarefas salvas para que, mesmo quando o usuário atualizar a página
//as tarefas permaneçam.
//Para isso, vamos usar o 'Local Storage'
//O método localStorage.setItem só trabalha com strings, assim como no passo 3. Por isso,
//precisamos transformar o JSON em string, e para isso, vamos usar o 'JSON.stringfty'

const setBanco = (banco) => {
    localStorage.setItem('todoList', JSON.stringify(banco)) 
}

const getBanco = () => JSON.parse(localStorage.getItem('todoList')) ?? []
    //Vai pegar todos os índices que tiverem a chave 'todoList'
    //Mas como a função só trabalha com strings, precisamos converter a string novamente
    //em JSON usando o 'JSON.parse'
    
atualizarTela()