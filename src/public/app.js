
//div
const divLoop = document.querySelector('#divLoop');
const divJuego = document.querySelector('#divJuego');
const divFichasJug = document.querySelector('#divFichasJug');
const divFichaMesa = document.querySelector('#divFichaMesa');

//others
const ulListaJug = document.querySelector('#ulListaJug');
const spanNumBolsa = document.querySelector('#spanNumBolsa');
const spanNumJug = document.querySelector('#spanNumJug');
const h4TurnoJugado = document.querySelector('#h4TurnoJugador');
const h2Mensaje = document.querySelector('#h2Mensaje');
const h2MensajeLoop = document.querySelector('#h2MensajeLoop');


//buttons
const btnStart = document.querySelector('#btnStart');
const btnTomar = document.querySelector('#btnTomar');
const btnPasar = document.querySelector('#btnPasar');

const socket = io();
let empezar = false;
let anfitrion = false;
let jugador = {};
let boton; // se guarda el boton generado dinamicamente


const { nombre } = Qs.parse(location.search, {
    ignoreQueryPrefix:true
});

document.querySelector('#h1NombreJugador').innerText = nombre;

//activando
socket.on('ping', (data) => { 
    socket.emit('pong', {beat: 1}); 
}); 

//redireccion
socket.on('redirect', () => {
    window.location.href = 'espera.html';
});

//enviando jugador
socket.emit('agregar_jug', nombre);

//recibiendo jugador
socket.on('agregar_jug', jug => {
    jugador = jug;
    if(!jug.anfitrion) btnStart.disabled = true;
});

//cuando se desconecta un jugador en el loop
socket.on('jug_desconectado_loop', ({jugador, jugadores}) => {
    addPlayers(jugadores);
});


socket.on('jug_desconectado_juego', (jugador) => {
    const msg = !jugador.anfitrion ?
             `${jugador.username} se ha desconectado de la partida` : 
             `El anfitrion se desconectó de la partida`; 
    confirm(msg);
    window.location.href = 'index.html';
});

socket.on('start', (data) => {
    const { start } = data;

    if(start){
        const { jugadores, bolsa } = data;
        jugador = updateJugador(jugadores, jugador.id);
        infoJugadores(jugadores);
        pintarNumeroFichas(bolsa);
        viewGame();
        habilitarBotones(jugador.turno);
        crearFichas(jugador.mano);
        h4TurnoJugado.innerText = jugador.turno ? 'Tienes el turno' : 'No tienes el turno'
    } else {
        h2MensajeLoop.innerText = data.msg;
        h2MensajeLoop.style.display = 'block';

        setTimeout(() => {
            h2MensajeLoop.innerText = '';
            h2MensajeLoop.style.display = 'none';
        }, 5000);
    }
});

//add player to list
socket.on('enviando_jugadores', (jugadores) => {
    addPlayers(jugadores);
});


//respuesta servidor tirar ficha
socket.on('tirar_ficha', (data) => {
    if(data.msg){
        verMensaje(data.msg);
    } else {
        jugador = data.jugador;
        crearFichas(jugador.mano);
        spanNumJug.innerText = jugador.mano.length;
    }
});

//respuesta servidor, ficha mesa
socket.on('ficha_mesa', (data) => {
    const temp = updateJugador(data.jugadores, jugador.id);
    pintarFichaMesa(data.fichaMesa);
    infoJugadores(data.jugadores);
    habilitarBotones(temp.turno);
    h4TurnoJugado.innerText = temp.turno ? 'Es tu turno' : 'No es tu turno';
});

//respuesta servidor, dando ficha
socket.on('tomar_ficha', (data) => {
    jugador = updateJugador(data.jugadores, jugador.id);
    crearFichas(jugador.mano);
    infoJugadores(data.jugadores);
    pintarNumeroFichas(data.bolsa);
});

socket.on('terminar_turno', ({jugadores}) => {
    jugador = updateJugador(jugadores, jugador.id); // se hace saber al jugador que cambio el turno
    habilitarBotones(jugador.turno);
    infoJugadores(jugadores);
});

socket.on('bolsa_vacia', (msg) => {
    verMensaje(msg);
})

//respuesta servidor, jugador ganador
socket.on('jugador_ganador', (data) => {
    const { msg } = data;
    confirm(msg);
    window.location.href = 'index.html';
});

//eventos de botones
btnStart.addEventListener('click', () => {
    socket.emit('start', null);
});

btnTomar.addEventListener('click', () => {
    socket.emit('tomar_ficha', jugador);
});


btnPasar.addEventListener('click', () => { //falta esto crack
    socket.emit('terminar_turno', null);
});


//actualizar jugador
const updateJugador = (jugadores, id) => {
    return jugadores.find(jug => jug.id === id);
}

//agregar lista
function addPlayers(jugadores){
    ulListaJug.innerHTML = `${jugadores.map(jugador => {
        return jugador.anfitrion ?
        `<li class="list-group-item">ID: ${jugador.id} | Name: ${jugador.username} | Anfitrion</li>` : 
        `<li class="list-group-item">ID: ${jugador.id} | Name: ${jugador.username}</li>`;
    })}`;
}

//view game
function viewGame(){
    divLoop.style.display = 'none';
    divJuego.style.display = 'block';
}

function habilitarBotones(turno) {
    if(turno){
        btnPasar.disabled = false;
        btnTomar.disabled = false;
    } else {
        btnPasar.disabled = true;
        btnTomar.disabled = true;
    }
}

function crearFichas(fichas){

    divFichasJug.innerHTML = `${fichas.map(ficha => `<div data-id="${ficha.id}" class="divFicha mr-2">

    <div id="divSuperior">
        <img src="./img/${ficha.vs}.png" width="60px" height="60px">
    </div>
    <div id="line"></div>
    <div id="divInferior">   
        <img src="./img/${ficha.vi}.png" width="60px" height="60px">
    </div>

    </div>`).join('')}`;

    const divFichas = document.querySelectorAll('.divFicha');

    for (const divFicha of divFichas) {
        divFicha.addEventListener('click', () => {
            const id = divFicha.getAttribute('data-id');

            socket.emit('tirar_ficha', {id, idJug: jugador.id});
        });
    }
}

function pintarFichaMesa(ficha){
    divFichaMesa.innerHTML = `<div data-id="${ficha.id}" class="divFicha mr-2">

    <div id="divSuperior">
        <img src="./img/${ficha.vs}.png" width="60px" height="60px">
    </div>
    <div id="line"></div>
    <div id="divInferior">   
        <img src="./img/${ficha.vi}.png" width="60px" height="60px">
    </div>

    </div>`;
}

function infoJugadores(jugadores){
    ulInfoJugadores.innerHTML = jugadores.map(jugador => {
        return jugador.turno ?
        `<li class="list-group-item active">Nombre: ${jugador.username} | #Fichas: ${jugador.mano.length} | Tiene el turno</li>`:
        `<li class="list-group-item">Nombre: ${jugador.username} | #Fichas: ${jugador.mano.length} | No tiene el turno</li>`
    }).join('');
}

function pintarNumeroFichas(bolsa){
    spanNumBolsa.innerText = bolsa;
    spanNumJug.innerText = jugador.mano.length;
}

function verMensaje(msg){
    h2Mensaje.innerText = msg;
    setTimeout(() => {
        h2Mensaje.innerText = ''; 
    }, 5000);
}