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


// Rutina asociada a boton reset
function resetGame() {

}

// Evento que llama a la función para iniciar el juego una vez se ha cargado el contenido del DOM
document.addEventListener("DOMContentLoaded", comenzarJuego);

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

    // Desactivación de eventos por defecto no deseados
    [tapeteInicial, tapeteSobrantes, tapeteReceptor1, tapeteReceptor2, tapeteReceptor3, tapeteReceptor4].forEach((tapete) => {
        tapete.ondragenter = disableDefaultEvents
        tapete.ondragover = disableDefaultEvents
        tapete.ondragleave = disableDefaultEvents
        tapete.ondrop = recibirCarta
    });
    tapeteInicial.ondrop = disableDefaultEvents;


    /* Crear baraja, es decir crear el mazoInicial. Este será un array cuyos
    elementos serán elementos HTML <img>, siendo cada uno de ellos una carta.
    Sugerencia: en dos bucles for, bárranse los "palos" y los "numeros", formando
    oportunamente el nombre del fichero png que contiene a la carta (recuérdese poner
    el path correcto en la URL asociada al atributo src de <img>). Una vez creado
    el elemento img, inclúyase como elemento del array mazoInicial.
    */

    /*
    El enunciado sugiere realizar un bucle anidado para formar el vector de mazo inicial; sin embargo,
    es más eficiente hacer uso de la programación funcional de javascript usando las funciones map() y flatMap().
    Estas funciones nos permiten ejecutar el callback deseado (en nuestro caso una concatenación de strings)
    en cada uno de los elementos del vector
     */

    mazoInicial = palos.flatMap(palo => numeros.map(numero => {
        let imgElement = new Image()
        imgElement.src = `imagenes/baraja/${numero}-${palo}.png` // TODO --> Revisar path
        imgElement.id = `${numero}-${palo}`;
        imgElement.alt = `${numero}-${palo}`;
        imgElement.setAttribute('data-numero', numero.toString());
        imgElement.setAttribute('data-palo', palo);
        imgElement.setAttribute('data-mazo', 'mazoInicial')
        imgElement.ondragstart = moverCarta;

        return imgElement;
    }))

    // Barajar y dejar mazoInicial en tapete inicial
    barajar(mazoInicial);
    cargarTapeteInicial(mazoInicial);

    // Puesta a cero de contadores de mazos
    [contSobrantes, contReceptor1, contReceptor2, contReceptor3, contReceptor4, contMovimientos].forEach((contador) => setContador(contador, 0));

    // Arrancar el conteo de tiempo
    arrancarTiempo();
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


// Función cuyo objetivo es barajar el mazo proporcionado (array)
function barajar(mazo) {
    mazo.sort(() => Math.random() - 0.5);
}

/*
    Función la cual recibe un mazo de cartas por parámetro y añade todas las cartas del mismo al tapete inicial de la vista
    ajustando las propiedades de estilo necesarias de las cartas para que se muestren correctamente
*/
function cargarTapeteInicial(mazo) {
    let numeroCartas = 0;

    mazo.forEach(((carta, idx, array) => {
        carta.style.position = 'absolute';
        carta.style.left = `${paso}px`
        carta.style.top = `${paso}px`
        carta.style.width = '20%';
        carta.draggable = idx === array.length - 1;

        tapeteInicial.appendChild(carta)

        paso += 5;
        numeroCartas++;
    }))

    setContador(contInicial, numeroCartas)
}

function actualizarDraggabilidad(mazoString) {
    let mazoVar = eval(mazoString);
    mazoVar[mazoVar.length - 1].draggable = true;
}

function moverCarta(e) {
    e.dataTransfer.setData("text/plain/palo", e.target.dataset["palo"]);
    e.dataTransfer.setData("text/plain/mazo", e.target.dataset["mazo"]);
    e.dataTransfer.setData("text/plain/numero", e.target.dataset["numero"]);
}

function recibirCarta(e) {
    e.preventDefault();

    let palo = e.dataTransfer.getData("text/plain/palo");
    let mazo = e.dataTransfer.getData("text/plain/mazo");
    let numero = e.dataTransfer.getData("text/plain/numero");
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
