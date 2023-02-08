// SELECIONA OS ITENS
const alert = document.querySelector('.alert');
const form = document.querySelector('.form-de-compra');
const item = document.getElementById('item');
const adicionarItem = document.querySelector('.submit-btn');
const container = document.querySelector('.container-lista');
const lista = document.querySelector('.lista-de-compras');
const limparLista = document.querySelector('.clear-btn');
let editItemId;
// OPÇÃO DE EDIÇÃO
let editElement;
let editFlag = false;
let editID = '';

// EVENT LISTENERS
// submissão do form
form.addEventListener('submit',addItem);
limparLista.addEventListener('click',limpaLista);
//carrega itens
window.addEventListener('DOMContentLoaded',setupItens)
// FUNÇÕES
function addItem(e) {
    e.preventDefault();
    const valor = item.value;
    const id = new Date().getTime().toString()
    if(valor && !editFlag){
        createListItem(id, valor);
        
        //mostra o alerta 
        mostraAlerta('Item adicionado','success');
        
        //adiciona o item no localStorage
        addToLocalStorage(id, valor);

        //retornar ao valor padrão
        setBackToDedfault();
    }else if(valor && editFlag){
        //eidtar item
        editElement.innerHTML = valor;
        //mostra o alerta 
        mostraAlerta('Item Atualizado','success');
        
        //edita o item no localStorage
        updateItemInLocalStorage(editID,valor);

        //retornar ao valor padrão
        setBackToDedfault();
    }else{
        mostraAlerta('Por favor preencha o campo','danger');
    }
}

function mostraAlerta(text,action) {
    alert.classList.remove('alert-success','alert-danger');
    alert.textContent = text;
    alert.classList.add(`alert-${action}`, 'show-item');
    setTimeout(() => {
        alert.textContent = '&nbsp;';
        alert.classList.remove(`alert-${action}`,'show-item');
    }, 3000);
}

//limpa a lista
function limpaLista(){
    const itens = document.querySelectorAll('article');
    if(itens.length > 0){
        itens.forEach(function(item){
            lista.removeChild(item);
        });
        mostraAlerta('Lista Limpa','success');
    }
    container.classList.remove('show-item');
    localStorage.removeItem('lista');
    setBackToDedfault();
    //limpa a lista inteira do localstorage
}

// edita o item
function editItem(e){
    const itemDaListaEdit = e.currentTarget.parentElement.parentElement;
    //pega o nome do item
    editElement = e.currentTarget.parentElement.previousElementSibling;
    //joga o nome do item para o campo de edição
    item.value = editElement.innerHTML;
    editFlag = true;
    editID = itemDaListaEdit.dataset.id;
    adicionarItem.textContent = 'Editar Item';
    adicionarItem.classList.add('editItem-btn')
}

// deleta o item
function deleteItem(e){
   const itemDaLista = e.currentTarget.parentElement.parentElement;
   const idItem = itemDaLista.dataset.id

   lista.removeChild(itemDaLista);
   if(lista.children.length === 0){
    container.classList.remove('show-item');
   }
   mostraAlerta('Item Removido', 'danger')
   setBackToDedfault();
   //remove o item do localstorage
   removeFromLocalStorage(idItem);
}

// zera o campo de texto da lista
function setBackToDedfault(){
    item.value = '';
    editFlag = false;
    editID = '';
    adicionarItem.textContent = 'Adicionar Item';
    adicionarItem.classList.remove('editItem-btn')
}

// LOCAL STORAGE
function addToLocalStorage(id, valor){
    const aLista = {id,valor};
    let itens = getLocalStorage();
    itens.push(aLista);
    localStorage.setItem('lista',JSON.stringify(itens));
}

function updateItemInLocalStorage(id, valor){
    let itens = getLocalStorage();
    itens = itens.map(function(item){
        if(item.id === id){
            item.valor = valor;
        }
        return item;
    });
    localStorage.setItem('lista',JSON.stringify(itens));
}

function removeFromLocalStorage(id){
    let itens = getLocalStorage();
    itens = itens.filter(function(item){
        if(item.id !== id){
            return item
        }
    });
    localStorage.setItem('lista',JSON.stringify(itens));
}

function getLocalStorage(){
    return localStorage.getItem('lista')
    ? JSON.parse(localStorage.getItem('lista'))
    :[];
}


// SETANDO OS ITENS
function setupItens(){
    let itens = getLocalStorage();
    if(itens.length > 0){
        itens.forEach(function(item){
            createListItem(item.id,item.valor);
        });
    }
}

function createListItem(id, valor){
    //adicionar item
    const novoItem = document.createElement('article');
    novoItem.classList.add('item-da-lista');
    const attr = document.createAttribute('data-id');
    attr.value = id;
    novoItem.setAttributeNode(attr);
    novoItem.innerHTML = `<p class="titulo">${valor}</p>
            <div class="btn-container">
                <button type="button" class="edit-btn">
                    <i class="fas fa-edit"></i>
                </button>
                <button type="button" class="delete-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>`
    const deleteBtn = novoItem.querySelector('.delete-btn');
    const editBtn = novoItem.querySelector('.edit-btn');
    deleteBtn.addEventListener('click',deleteItem);
    editBtn.addEventListener('click',editItem);
    //adiciona o novo item na lista
    lista.appendChild(novoItem);
    //mostra o container
    container.classList.add('show-item');
}