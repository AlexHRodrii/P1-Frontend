/***** INICIO DECLARACIÓN DE VARIABLES GLOBALES *****/

// Array de palos
let palos = ["viu", "cua", "hex", "cir"];

// Array de número de cartas
// let numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// En las pruebas iniciales solo se trabajará con cuatro cartas por palo:
let numeros = [9, 10, 11, 12];

// paso (top y left) en pixeles de una carta a la siguiente en un mazo
let paso = 5;

// Tapetes (se deben inicializar posteriormente a de la carga del HTML sino sus referencias serán 'null')
let tapeteInicial
let tapeteSobrantes
let tapeteReceptor1
let tapeteReceptor2
let tapeteReceptor3
let tapeteReceptor4

// Mazos
let mazoInicial = [];
let mazoSobrantes = [];
let mazoReceptor1 = [];
let mazoReceptor2 = [];
let mazoReceptor3 = [];
let mazoReceptor4 = [];

// Contadores de cartas (se deben inicializar posteriormente a la carga del HTML sino sus referencias serán 'null')
let contInicial;
let contSobrantes;
let contReceptor1;
let contReceptor2;
let contReceptor3;
let contReceptor4;
let contMovimientos;

// Tiempo
let contTiempo; // span cuenta tiempo (se debe inicializar posteriormente a de la carga del HTML sino su referencia será 'null')
let segundos = 0;    // cuenta de segundos
let temporizador = null; // manejador del temporizador

/***** FIN DECLARACIÓN DE VARIABLES GLOBALES *****/

// Evento que llama a la función para iniciar el juego una vez se ha cargado el contenido del DOM
document.addEventListener("DOMContentLoaded", comenzarJuego);

// Rutina asociada a boton reset
function resetGame() {
    // Restablecimiento de contadores a 0
    [contInicial, contSobrantes, contReceptor1, contReceptor2, contReceptor3, contReceptor4, contMovimientos].forEach((contador) => setContador(contador, 0));

    // Restablecimiento de mazos
    [mazoInicial, mazoSobrantes, mazoReceptor1, mazoReceptor2, mazoReceptor3, mazoReceptor4].forEach((mazo) => mazo.length = 0);

    // Restablecimiento de tapetes borrando las posibles cartas que tengan asociadas
    [tapeteInicial, tapeteSobrantes, tapeteReceptor1, tapeteReceptor2, tapeteReceptor3, tapeteReceptor4].forEach((tapete) => {
        while (tapete.lastChild && tapete.lastChild.tagName === "IMG") {
            tapete.removeChild(tapete.lastChild)
        }
    });

    // Restablecimiento del paso
    paso = 5;

    // Creación del mazo inicial de juego
    mazoInicial = cargarMazoInicial()

    // Barajar y cargar el mazoInicial en el tapete inicial
    barajar(mazoInicial);
    cargarTapeteInicial(mazoInicial);

    // Arrancar el conteo de tiempo (tal y como está diseñado parará el temporizador anterior)
    arrancarTiempo();
}

function endGame() {

}

// Función encargada de gestionar el inicio del juego (inicialización de mazos, tapetes y contadores)
function comenzarJuego() {

    // Inicialización de variables cuya referencia debe ser algún elemento HTML
    tapeteInicial = document.getElementById("inicial");
    tapeteSobrantes = document.getElementById("sobrantes");
    tapeteReceptor1 = document.getElementById("receptor1");
    tapeteReceptor2 = document.getElementById("receptor2");
    tapeteReceptor3 = document.getElementById("receptor3");
    tapeteReceptor4 = document.getElementById("receptor4");

    contInicial = document.getElementById("contador_inicial");
    contSobrantes = document.getElementById("contador_sobrantes");
    contReceptor1 = document.getElementById("contador_receptor1");
    contReceptor2 = document.getElementById("contador_receptor2");
    contReceptor3 = document.getElementById("contador_receptor3");
    contReceptor4 = document.getElementById("contador_receptor4");
    contMovimientos = document.getElementById("contador_movimientos");
    contTiempo = document.getElementById("contador_tiempo");

    // Registro del evento 'click' asociado al botón para reiniciar la partida
    document.getElementById('reset').addEventListener('click', resetGame);

    // Desactivación de eventos por defecto no deseados
    [tapeteInicial, tapeteSobrantes, tapeteReceptor1, tapeteReceptor2, tapeteReceptor3, tapeteReceptor4].forEach((tapete) => {
        tapete.ondragenter = disableDefaultEvents
        tapete.ondragover = disableDefaultEvents
        tapete.ondragleave = disableDefaultEvents
        tapete.ondrop = (e) => {
            recibirCarta(e, tapete)
        }
    });
    tapeteInicial.ondrop = disableDefaultEvents;

    // Puesta a cero de contadores de mazos
    [contInicial, contSobrantes, contReceptor1, contReceptor2, contReceptor3, contReceptor4, contMovimientos].forEach((contador) => setContador(contador, 0));

    // Creación del mazo inicial de juego
    mazoInicial = cargarMazoInicial()

    // Barajar y cargar el mazoInicial en el tapete inicial
    barajar(mazoInicial);
    cargarTapeteInicial(mazoInicial);

    // Arrancar el conteo de tiempo
    arrancarTiempo();
}

/*
    Función orientada a crear el mazo inicial de juego (vector de elementos <img>).
    El enunciado sugiere realizar un bucle anidado para formar el vector de mazo inicial; sin embargo,
    es más eficiente hacer uso de la programación funcional de javascript usando las funciones map() y flatMap().
    Estas funciones nos permiten ejecutar el callback deseado (en nuestro caso una concatenación de strings)
    en cada uno de los elementos del vector
     */
function cargarMazoInicial() {
    return palos.flatMap(palo => numeros.map(numero => {
        let imgElement = new Image()
        imgElement.src = `imagenes/baraja/${numero}-${palo}.png` // TODO --> Revisar path
        imgElement.id = `${numero}-${palo}`;
        imgElement.alt = `${numero}-${palo}`;
        imgElement.setAttribute('data-numero', numero.toString());
        imgElement.setAttribute('data-palo', palo);
        imgElement.ondragstart = iniciarDragCarta;

        return imgElement;
    }))
}

/*
    Función la cual recibe un mazo de cartas por parámetro y añade todas las cartas del mismo al tapete inicial de la vista
    ajustando las propiedades de estilo necesarias de las cartas para que se muestren correctamente
*/
function cargarTapeteInicial(mazo) {
    mazo.forEach(((carta, idx, array) => {
        carta.style.position = 'absolute';
        carta.style.left = `${paso}px`
        carta.style.top = `${paso}px`
        carta.style.width = '20%';
        carta.draggable = idx === array.length - 1;
        carta.setAttribute('data-tapete', 'inicial')

        tapeteInicial.appendChild(carta)

        paso += 5;
        incContador(contInicial);
    }))
}

function iniciarDragCarta(e) {
    e.dataTransfer.setData("text/plain/numero", e.target.dataset["numero"]);
    e.dataTransfer.setData("text/plain/palo", e.target.dataset["palo"]);
    e.dataTransfer.setData("text/plain/tapete", e.target.dataset["tapete"]);
}

function recibirCarta(e, tapete) {
    e.preventDefault();
    let numero = parseInt(e.dataTransfer.getData("text/plain/numero"));
    let palo = e.dataTransfer.getData("text/plain/palo");
    let tapeteOrigen = document.getElementById(e.dataTransfer.getData("text/plain/tapete"));
    let tapeteDestino = document.getElementById(tapete.id);


    switch (tapeteDestino.id) {
        case 'receptor1':
        case 'receptor2':
        case 'receptor3':
        case 'receptor4':
            isDropAllowed(tapeteDestino, numero, palo) && trasladarCarta(tapeteOrigen, tapeteDestino, false);
            break;
        case 'sobrantes':
            trasladarCarta(tapeteOrigen, tapeteDestino, true);
            break;
    }

    if (mazoInicial.length === 0 && mazoSobrantes.length === 0) {
        endGame();
    } else if (mazoInicial.length === 0) {
        mazoInicial = [...mazoSobrantes];
        mazoSobrantes = [];
        setContador(contSobrantes, 0);
        barajar(mazoInicial);
        cargarTapeteInicial(mazoInicial);
    }
}

function isDropAllowed(tapeteDestino, numero, palo) {
    let mazoDestino = obtenerMazoDesdeTapete(tapeteDestino)

    if (mazoDestino.length > 0) {
        let color = obtenerColorCarta(palo);

        let ultimaCartaMazo = mazoDestino[mazoDestino.length - 1];
        let numeroUltimaCarta = parseInt(ultimaCartaMazo.dataset["numero"]);
        let colorUltimaCarta = obtenerColorCarta(ultimaCartaMazo.dataset["palo"]);

        return ((color !== colorUltimaCarta) && (numero === numeroUltimaCarta - 1));
    }

    return numero === 12;
}

function trasladarCarta(tapeteOrigen, tapeteDestino, draggable) {
    let mazoOrigen = obtenerMazoDesdeTapete(tapeteOrigen)
    let mazoDestino = obtenerMazoDesdeTapete(tapeteDestino)

    let carta = mazoOrigen.pop();
    if (mazoOrigen.length > 0) mazoOrigen[mazoOrigen.length - 1].draggable = true
    tapeteOrigen.removeChild(carta);

    carta.draggable = draggable;
    carta.style.width = '60%';
    carta.style.top = '50%';
    carta.style.left = '50%';
    carta.style.transform = 'translate(-50%, -50%)';
    carta.setAttribute('data-tapete', tapeteDestino.id)

    mazoDestino.push(carta);
    tapeteDestino.appendChild(carta);

    incContador(obtenerContadorDesdeTapete(tapeteDestino));
    incContador(contMovimientos);
    decContador(obtenerContadorDesdeTapete(tapeteOrigen));
}

function obtenerMazoDesdeTapete(tapete) {
    const correspondencias = {
        inicial: 'mazoInicial',
        sobrantes: 'mazoSobrantes',
        receptor1: 'mazoReceptor1',
        receptor2: 'mazoReceptor2',
        receptor3: 'mazoReceptor3',
        receptor4: 'mazoReceptor4',
    }

    return eval(correspondencias[tapete.id])
}

function obtenerContadorDesdeTapete(tapete) {
    const correspondencias = {
        inicial: 'contInicial',
        sobrantes: 'contSobrantes',
        receptor1: 'contReceptor1',
        receptor2: 'contReceptor2',
        receptor3: 'contReceptor3',
        receptor4: 'contReceptor4',
    }

    return eval(correspondencias[tapete.id])
}


function obtenerColorCarta(palo) {
    return ["viu", "cua"].includes(palo) ? 'naranja' : 'gris';
}

// Función cuyo objetivo es barajar el mazo proporcionado (array)
function barajar(mazo) {
    mazo.sort(() => Math.random() - 0.5);
}

/*
    Función encargada de iniciar el contador de tiempo transcurrido en la partida,
    además de esto gestiona un intervalo el cual causa que cada segundo se llame a una función
    la cual actualiza la información visual del tiempo transcurrido en la partida en formato hh:mm:ss
 */
function arrancarTiempo() {
    if (temporizador) clearInterval(temporizador);
    let hms = function () {
        let seg = Math.trunc(segundos % 60);
        let min = Math.trunc((segundos % 3600) / 60);
        let hor = Math.trunc((segundos % 86400) / 3600);
        let tiempo = ((hor < 10) ? "0" + hor : "" + hor)
            + ":" + ((min < 10) ? "0" + min : "" + min)
            + ":" + ((seg < 10) ? "0" + seg : "" + seg);
        setContador(contTiempo, tiempo);
        segundos++;
    }
    segundos = 0;
    hms(); // Primera visualización 00:00:00
    temporizador = setInterval(hms, 1000);

}


//  Función encargada de incrementar en uno el contenido textual del elemento contador que recibe por parámetro
function incContador(contador) {
    contador.textContent = (parseInt(contador.textContent) + 1).toString();
}

//  Función encargada de decrementar en uno el contenido textual del elemento contador que recibe por parámetro
function decContador(contador) {
    contador.textContent = (parseInt(contador.textContent) - 1).toString();
}

/*
    Función encargada de ajustar el contenido textual del elemento contador que recibe en el parámetro '@contador'
    al valor proporcionado en el parámetro '@valor'
 */
function setContador(contador, valor) {
    contador.textContent = valor.toString();
}

// Función auxiliar para desactivar eventos por defecto
function disableDefaultEvents(e) {
    e.preventDefault();
}
