"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

//div
var divLoop = document.querySelector('#divLoop');
var divJuego = document.querySelector('#divJuego');
var divFichasJug = document.querySelector('#divFichasJug');
var divFichaMesa = document.querySelector('#divFichaMesa'); //others

var ulListaJug = document.querySelector('#ulListaJug');
var spanNumBolsa = document.querySelector('#spanNumBolsa');
var spanNumJug = document.querySelector('#spanNumJug');
var h4TurnoJugado = document.querySelector('#h4TurnoJugador');
var h2Mensaje = document.querySelector('#h2Mensaje');
var h2MensajeLoop = document.querySelector('#h2MensajeLoop'); //buttons

var btnStart = document.querySelector('#btnStart');
var btnTomar = document.querySelector('#btnTomar');
var btnPasar = document.querySelector('#btnPasar');
var socket = io();
var empezar = false;
var anfitrion = false;
var jugador = {};
var boton; // se guarda el boton generado dinamicamente

var _Qs$parse = Qs.parse(location.search, {
  ignoreQueryPrefix: true
}),
    nombre = _Qs$parse.nombre;

document.querySelector('#h1NombreJugador').innerText = nombre; //activando

socket.on('ping', function (data) {
  socket.emit('pong', {
    beat: 1
  });
}); //redireccion

socket.on('redirect', function () {
  window.location.href = 'espera.html';
}); //enviando jugador

socket.emit('agregar_jug', nombre); //recibiendo jugador

socket.on('agregar_jug', function (jug) {
  jugador = jug;
  if (!jug.anfitrion) btnStart.disabled = true;
}); //cuando se desconecta un jugador en el loop

socket.on('jug_desconectado_loop', function (_ref) {
  var jugador = _ref.jugador,
      jugadores = _ref.jugadores;
  addPlayers(jugadores);
});
socket.on('jug_desconectado_juego', function (jugador) {
  var msg = !jugador.anfitrion ? "".concat(jugador.username, " se ha desconectado de la partida") : "El anfitrion se desconect\xF3 de la partida";
  confirm(msg);
  window.location.href = 'index.html';
});
socket.on('start', function (data) {
  var start = data.start;

  if (start) {
    var jugadores = data.jugadores,
        bolsa = data.bolsa;
    jugador = updateJugador(jugadores, jugador.id);
    infoJugadores(jugadores);
    pintarNumeroFichas(bolsa);
    viewGame();
    habilitarBotones(jugador.turno);
    crearFichas(jugador.mano);
    h4TurnoJugado.innerText = jugador.turno ? 'Tienes el turno' : 'No tienes el turno';
  } else {
    h2MensajeLoop.innerText = data.msg;
    h2MensajeLoop.style.display = 'block';
    setTimeout(function () {
      h2MensajeLoop.innerText = '';
      h2MensajeLoop.style.display = 'none';
    }, 5000);
  }
}); //add player to list

socket.on('enviando_jugadores', function (jugadores) {
  addPlayers(jugadores);
}); //respuesta servidor tirar ficha

socket.on('tirar_ficha', function (data) {
  if (data.msg) {
    verMensaje(data.msg);
  } else {
    jugador = data.jugador;
    crearFichas(jugador.mano);
    spanNumJug.innerText = jugador.mano.length;
  }
}); //respuesta servidor, ficha mesa

socket.on('ficha_mesa', function (data) {
  var temp = updateJugador(data.jugadores, jugador.id);
  pintarFichaMesa(data.fichaMesa);
  infoJugadores(data.jugadores);
  habilitarBotones(temp.turno);
  h4TurnoJugado.innerText = temp.turno ? 'Es tu turno' : 'No es tu turno';
}); //respuesta servidor, dando ficha

socket.on('tomar_ficha', function (data) {
  jugador = updateJugador(data.jugadores, jugador.id);
  crearFichas(jugador.mano);
  infoJugadores(data.jugadores);
  pintarNumeroFichas(data.bolsa);
});
socket.on('terminar_turno', function (_ref2) {
  var jugadores = _ref2.jugadores;
  jugador = updateJugador(jugadores, jugador.id); // se hace saber al jugador que cambio el turno

  habilitarBotones(jugador.turno);
  infoJugadores(jugadores);
});
socket.on('bolsa_vacia', function (msg) {
  verMensaje(msg);
}); //respuesta servidor, jugador ganador

socket.on('jugador_ganador', function (data) {
  var msg = data.msg;
  confirm(msg);
  window.location.href = 'index.html';
}); //eventos de botones

btnStart.addEventListener('click', function () {
  socket.emit('start', null);
});
btnTomar.addEventListener('click', function () {
  socket.emit('tomar_ficha', jugador);
});
btnPasar.addEventListener('click', function () {
  //falta esto crack
  socket.emit('terminar_turno', null);
}); //actualizar jugador

var updateJugador = function updateJugador(jugadores, id) {
  return jugadores.find(function (jug) {
    return jug.id === id;
  });
}; //agregar lista


function addPlayers(jugadores) {
  ulListaJug.innerHTML = "".concat(jugadores.map(function (jugador) {
    return jugador.anfitrion ? "<li class=\"list-group-item\">ID: ".concat(jugador.id, " | Name: ").concat(jugador.username, " | Anfitrion</li>") : "<li class=\"list-group-item\">ID: ".concat(jugador.id, " | Name: ").concat(jugador.username, "</li>");
  }));
} //view game


function viewGame() {
  divLoop.style.display = 'none';
  divJuego.style.display = 'block';
}

function habilitarBotones(turno) {
  if (turno) {
    btnPasar.disabled = false;
    btnTomar.disabled = false;
  } else {
    btnPasar.disabled = true;
    btnTomar.disabled = true;
  }
}

function crearFichas(fichas) {
  divFichasJug.innerHTML = "".concat(fichas.map(function (ficha) {
    return "<div data-id=\"".concat(ficha.id, "\" class=\"divFicha mr-2\">\n\n    <div id=\"divSuperior\">\n        <img src=\"./img/").concat(ficha.vs, ".png\" width=\"60px\" height=\"60px\">\n    </div>\n    <div id=\"line\"></div>\n    <div id=\"divInferior\">   \n        <img src=\"./img/").concat(ficha.vi, ".png\" width=\"60px\" height=\"60px\">\n    </div>\n\n    </div>");
  }).join(''));
  var divFichas = document.querySelectorAll('.divFicha');

  var _iterator = _createForOfIteratorHelper(divFichas),
      _step;

  try {
    var _loop = function _loop() {
      var divFicha = _step.value;
      divFicha.addEventListener('click', function () {
        var id = divFicha.getAttribute('data-id');
        socket.emit('tirar_ficha', {
          id: id,
          idJug: jugador.id
        });
      });
    };

    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      _loop();
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}

function pintarFichaMesa(ficha) {
  divFichaMesa.innerHTML = "<div data-id=\"".concat(ficha.id, "\" class=\"divFicha mr-2\">\n\n    <div id=\"divSuperior\">\n        <img src=\"./img/").concat(ficha.vs, ".png\" width=\"60px\" height=\"60px\">\n    </div>\n    <div id=\"line\"></div>\n    <div id=\"divInferior\">   \n        <img src=\"./img/").concat(ficha.vi, ".png\" width=\"60px\" height=\"60px\">\n    </div>\n\n    </div>");
}

function infoJugadores(jugadores) {
  ulInfoJugadores.innerHTML = jugadores.map(function (jugador) {
    return jugador.turno ? "<li class=\"list-group-item active\">Nombre: ".concat(jugador.username, " | #Fichas: ").concat(jugador.mano.length, " | Tiene el turno</li>") : "<li class=\"list-group-item\">Nombre: ".concat(jugador.username, " | #Fichas: ").concat(jugador.mano.length, " | No tiene el turno</li>");
  }).join('');
}

function pintarNumeroFichas(bolsa) {
  spanNumBolsa.innerText = bolsa;
  spanNumJug.innerText = jugador.mano.length;
}

function verMensaje(msg) {
  h2Mensaje.innerText = msg;
  setTimeout(function () {
    h2Mensaje.innerText = '';
  }, 5000);
}