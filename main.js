// Repo: rest-todoolean
// Creare una piccola applicazione web per gestire una lista di "todo".
// Le operazioni principali che devo essere implementate sono:
// la lettura di tutti i todo
// l'inserimento di un nuovo todo
// la cancellazione di un todo.
// BONUS: gestire la modifica di un todo.
// -----------------------------------------------------------------------------

var urlTodoList = "http://157.230.17.132:3004/todos/";

var initialMoment = moment(); // data corrente

$(document).ready(function() {

    // acquisico la lista iniziale dei TODOs e la visualizzo
    readAndDisplayTodoList();

    //intercetto click sul bottone 'Aggiungi'
    $('#add-todo-button').click(function() {
        // chiamo una funzione per inserire il nuovo TODO
        createTodo();
    });

    // intercetto pressione ENTER, anzichè click sul bottone, per inserire un TODO
    $('#add-todo-input').keypress(function(event) {
        if (event.which == 13) { // è stato premuto tasto ENTER (codice 13)
            // chiamo una funzione per iserire il nuovo 'todo'
            createTodo();
        }
    });

    //intercetto click su icona cancellazione
    $('#todo-list').on('click', '.delete-todo', function() {
        // chiamo una funzione per cancellare il 'todo'
        deleteTodo($(this));
    });

    //intercetto click su icona edit
    $('#todo-list').on('click', '.edit-todo', function() {
        // chiamo una funzione per gestire l'edit del 'todo'
        editTodo($(this));
    });

    //intercetto click su icona salva
    $('#todo-list').on('click', '.upload-todo', function() {
        // chiamo una funzione per aggiornare il TODO
        updateTodo($(this));
    });

    // intercetto pressione ENTER, anzichè click sul icona upload, per aggiornare un TODO
    $('#todo-list').on('keypress', '.modify-todo-input', function(event) {
        if (event.which == 13) { // è stato premuto tasto ENTER (codice 13)
            console.log("dentro if");
            // chiamo una funzione per aggiornare il TODO
            updateTodo($(this));
        }
    });

});

// ---------------------------- FUNCTIONs --------------------------------------

function readAndDisplayTodoList() {
    // DESCRIZIONE:
    // tramite chiamata AJAX recupera la TODO list
    // chiama poi una funzione per visualizzare la lista in pagina

    $.ajax({
        url: urlTodoList,
        method: 'get',
        success: function(data) {
            displayTodoList(data);
        },
        error: function() {
            alert("ERRORE! C'è stato un problema nell'accesso ai dati");
        }
    });
}

function displayTodoList(todoList) {
    // DESCRIZIONE:
    // visualizza la TODO list in pagina

    // cancello dalla pagina la lista precedente
    $('#todo-list').empty();

    // ciclo sull'array ricevuto come parametro in ingresso alla funzione
    // che contiene la lista dei TODOs
    for (var i = 0; i < todoList.length; i++) {

        // oggetto per HANDLEBARS
        var context = {
            'todo-id': todoList[i].id,
            'todo-text': todoList[i].text
        };
        // recupero il codice html dal template HANDLEBARS
        var todoListTemplate = $('#todo-list-template').html();
        // compilo il template HANDLEBARS, lui mi restituisce un funzione
        var todoListFunction = Handlebars.compile(todoListTemplate);
        // chiamo la funzione generata da HANDLEBARS per popolare il template
        var todo = todoListFunction(context);
        // aggiungo in pagina il todo appena creato
        $('#todo-list').append(todo);
    }

} // end function displayTodoList()

function createTodo() {
    // DESCRIZIONE:
    // elabora l'input dell'utente per inserire un nuovo TODO in lista
    // fa una chiamata AJAX con metodo POST per crere un nuovo elemento nel DB

    // recupero il valore del campo di input eliminando gli eventuali spazi iniziali e finali
    var todoInput = $('#add-todo-input').val().trim();

    // console.log("todoInput", todoInput);
    if (todoInput) {

        // resetto campo di input
        $('#add-todo-input').val('');

        // preparo l'oggetto da scrivere sul DB e da passare alla chiamata AJAX in POST
        var todoObj = {
            'text': todoInput
        };

        $.ajax({
            url: urlTodoList,
            method: 'post',
            data: todoObj,
            success: function(data) {
                // visualizzo i dati aggiornati dopo l'inserimento del nuovo TODO
                readAndDisplayTodoList();
            },
            error: function() {
                alert("ERRORE! C'è stato un problema nell'accesso ai dati");
            }
        });

    } else {
        alert("Il campo di input è vuoto!");
    }

} // end function createTodo()

function deleteTodo(that) {
    // DESCRIZIONE:
    // fa una chiammata AJAX con metodo DELETE per cancellare il TODO cliccato dall'utente
    // riceve in ingresso il riferimento dell'elemento cliccato (l'icona trash a fianco del TODO)

    console.log("sono nella delete");
    // ricavo l'id dell'elemento da cancellare, tramite l'attributo 'data-todo-id'
    // l'attributo è associato all'elemento padre dell'elemento cliccato
    var todoIdToBeDeleted = that.parent().attr('data-todo-id');
    // console.log("todoIdToBeDeleted", todoIdToBeDeleted);

    $.ajax({
        url: urlTodoList + todoIdToBeDeleted,
        method: 'delete',
        success: function(data) {
            // console.log("data in risposta a delete", data);
            // visualizzo i dati aggiornati dopo l'inserimento del nuovo TODO
            readAndDisplayTodoList();
        },
        error: function() {
            alert("ERRORE! C'è stato un problema nell'accesso ai dati");
        }
    });

} // end function deleteTodo()


function editTodo(that) {
    // DESCRIZIONE:
    // gestisce il click sull'icona per modificare un TODO

    console.log("sono nella editTodo()");
    var todoText = that.parent().find('.todo-text').text();

    // trovo il TODO associato all'icona di 'modifica' cliccata e lo nascondo
    that.parent().find('.todo-text').addClass('hidden');
    // nascondo l'icona di cancellazione
    that.parent().find('.delete-todo').addClass('hidden');
    // nascondo l'icona di modifica
    that.parent().find('.edit-todo').addClass('hidden');
    // visualizzo icona di upload
    that.parent().find('.upload-todo').addClass('visible');
    // valorizzo e visualizzo il campo di input per permettere all'utente di inserire la modifica
    that.parent().find('.modify-todo-input').val(todoText).addClass('visible');

} // end function editTodo()


function updateTodo(that, newTodo) {
    // DESCRIZIONE:
    // fa una chiamata AJAX con metodo PUT per aggiornare un TODO della lista,
    // in base all'input inserito dall'utente

    // recupero il testo contenuto nel campo di edit
    var modifiedTodoText = that.parent().find('.modify-todo-input').val().trim();

    // ricavo l'id dell'elemento da aggiornare, tramite l'attributo 'data-todo-id'
    // l'attributo è associato all'elemento padre dell'elemento cliccato
    var todoToBeUpdatedId = that.parent().attr('data-todo-id');

    if (modifiedTodoText) {

        // preparo l'oggetto da scrivere sul DB e da passare alla chiamata AJAX in PUT
        var todoObj = {
            'text': modifiedTodoText
        };

        $.ajax({
            url: urlTodoList + todoToBeUpdatedId,
            method: 'put',
            data: todoObj,
            success: function(data) {
                // visualizzo i dati aggiornati
                readAndDisplayTodoList();
            },
            error: function() {
                alert("ERRORE! C'è stato un problema nell'accesso ai dati");
            }
        });

    } else {
        alert("Il campo editato è vuoto!");
    }
} // end function updateTodo()