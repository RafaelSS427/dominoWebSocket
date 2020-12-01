"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Bolsa = _interopRequireDefault(require("./class/Bolsa"));

var _users = require("./utils/users");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//import clases
//Juego
var bolsa = new _Bolsa["default"]();
var start = false; //saber si se puede iniciar el juego

var connection = function connection(io) {
  io.on('connection', function (socket) {
    var sendHeartbeat = function sendHeartbeat() {
      setTimeout(sendHeartbeat, 2000);
      io.emit('ping', {
        beat: 1
      });
    }; //io.engine.clientsCount -> numero de clientes conectados


    console.log('Usuario conectado');

    if (start) {
      socket.emit('redirect', null);
    }

    socket.on('agregar_jug', function (nombre) {
      // me llega el nombre del jugador
      var jugador = (0, _users.jugadorJoin)(socket.id, nombre); //start = getJugadores().length >= 2;

      socket.emit('agregar_jug', jugador); // se regresa el jugador del cliente

      io.emit('enviando_jugadores', (0, _users.getJugadores)()); // se envia todos los jugadores
    });
    socket.on('start', function () {
      start = (0, _users.getJugadores)().length >= 2;

      if (start) {
        (0, _users.darFichasJugadores)(bolsa);
        io.emit('start', {
          start: start,
          jugadores: (0, _users.getJugadores)(),
          bolsa: bolsa.bolsaFichas.length
        });
      } else {
        socket.emit('start', {
          start: start,
          msg: 'Faltan jugadores, no se ha podido iniciar el juego'
        });
      }
    });
    socket.on('tirar_ficha', function (data) {
      var id = data.id,
          idJug = data.idJug;
      var paquete = (0, _users.lanzarFicha)(idJug, id);
      socket.emit('tirar_ficha', paquete);

      if (paquete.fichaMesa) {
        paquete.jugadores = (0, _users.getJugadores)();
        io.emit('ficha_mesa', paquete);
      }

      var ganador = (0, _users.jugadorGanador)();

      if (!(ganador === undefined)) {
        io.emit('jugador_ganador', {
          msg: "".concat(ganador.username, " ha ganado la partida")
        });
      }
    });
    socket.on('tomar_ficha', function (jugador) {
      var data = (0, _users.jugadorTomaFicha)(jugador.id, bolsa);
      var paquete = {
        jugadores: (0, _users.getJugadores)(),
        bolsa: bolsa.bolsaFichas.length
      };

      if (!(data === undefined)) {
        var msg = data.msg;
        socket.emit('bolsa_vacia', msg);
      }

      io.emit('tomar_ficha', paquete); //io.emit('numeroFichasB', {bolsa: bolsa.bolsaFichas.length});
    });
    socket.on('terminar_turno', function () {
      (0, _users.terminarTurno)();
      io.emit('terminar_turno', {
        jugadores: (0, _users.getJugadores)()
      });
    });
    socket.on('pong', function (data) {
      console.log("Manteniendo hilo de socket activo del cliente");
    });
    setTimeout(sendHeartbeat, 2000); // se ejecuta el intervalo de tiempo para mantener viva la conexion

    socket.on('disconnect', function () {
      console.log('Usuario desconectado');
      var jugador = (0, _users.jugadorLeave)(socket.id);
      console.log("Jugador desconectado:", jugador.username);

      if (jugador.mano && start) {
        // si se desconecta un jugador que tiene fichas y el juego esta iniciado
        start = false;
        bolsa.reiniciarBolsa();
        (0, _users.setearMesa)();
        io.emit('jug_desconectado_juego', jugador);
      } else {
        io.emit('jug_desconectado_loop', {
          jugador: jugador,
          jugadores: (0, _users.getJugadores)()
        });
      }

      if (jugador.anfitrion) {
        io.emit('jug_desconectado_juego', jugador);
      }
    });
  });
};

var _default = connection;
exports["default"] = _default;