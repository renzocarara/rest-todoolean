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
        // chiamo una funzione per inserire il nuovo 'todo'
        createTodo();
    }); // fine evento click su bottone

    // intercetto pressione ENTER, anzichè click sul bottone, per inserire un TODO
    $('#add-todo-input').keypress(function(event) {
        if (event.which == 13) { // è stato premuto tasto ENTER (codice 13)
            // chiamo una funzione per iserire il nuovo 'todo'
            createTodo();
        }
    }); // fine evento keypress tasto ENTER

    //intercetto click su icona cancellazione
    $('').on('click', '', function() {
        // chiamo una funzione per cancellare il 'todo'
        deleteTodo($(this));
    }); // fine evento click su icona cancellazione

    //intercetto click su icona edit
    $('').on('click', '', function() {
        // chiamo una funzione per gestire l'edit del 'todo'
        editTodo($(this));
    }); // fine evento click su icona edit

    //intercetto click su icona salva
    $('').on('click', '', function() {
        // chiamo una funzione
        updateTodo($(this));
    }); // fine evento click su icona salva

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

        // preparo l'oggetto da scrivere sul DB e da  passare alla chiamata AJAX in POST
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
    //

} // end function deleteTodo()


function editTodo(that) {
    // DESCRIZIONE:
    //

} // end function editTodo()


function updateTodo(that) {
    // DESCRIZIONE:
    //


} // end function updateTodo()