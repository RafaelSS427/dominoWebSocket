"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jugadorGanador = exports.terminarTurno = exports.jugadorTomaFicha = exports.setearMesa = exports.lanzarFicha = exports.darFichasJugadores = exports.getJugadores = exports.jugadorLeave = exports.getJugador = exports.jugadorJoin = void 0;

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var jugadores = [];
var mesa = [];
var fichaMesa = {
  id: -1,
  vs: -1,
  vi: -1
}; //ficha de mesa
//metodos find y findIndex funcionan solo con variables globales
// Join user to game

var jugadorJoin = function jugadorJoin(id, username) {
  var jugador = {
    id: id,
    username: username
  };
  jugador.turno = false;

  if (jugadores.length < 4) {
    jugadores.push(jugador);
    if (jugadores.length === 1) jugadores[0].anfitrion = true;
    return jugador;
  }
};

exports.jugadorJoin = jugadorJoin;

var getJugador = function getJugador(id) {
  return jugadores.find(function (user) {
    return user.id === id;
  });
}; // 2, 4, 5, 7, 8


exports.getJugador = getJugador;

var jugadorLeave = function jugadorLeave(id) {
  var index = jugadores.findIndex(function (user) {
    return user.id === id;
  }); // si encuentra = pos, si no o encuentra = -1

  if (index !== -1) {
    // si lo encontro
    return jugadores.splice(index, 1)[0]; // remueve un elemento a partir de la posicion ingresada
  }

  return {};
};

exports.jugadorLeave = jugadorLeave;

var removeFicha = function removeFicha(fichas, id) {
  var index = fichas.indexOf(id); // si encuentra = pos, si no o encuentra = -1

  if (index !== -1) {
    // si lo encontro
    //console.log('se elimino la ficha');
    fichas.splice(index, 1); // remueve un elemento a partir de la posicion ingresada
  }
};

var getJugadores = function getJugadores() {
  return jugadores;
};

exports.getJugadores = getJugadores;

var darFichasJugadores = function darFichasJugadores(bolsa) {
  var _iterator = _createForOfIteratorHelper(jugadores),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var jug = _step.value;
      jug.mano = bolsa.fichasIniciales();
    } //luego de repartir las fichas, concedemos los turnos

  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  var existeTurno = turnoInicialJugadores(0); // true or false

  if (existeTurno === false) jugadores[0].turno = true;
};

exports.darFichasJugadores = darFichasJugadores;

var turnoInicialJugadores = function turnoInicialJugadores(cont) {
  var idFichas = [28, 26, 23, 19, 14, 8, 1]; // id de fichas iniciales

  var _iterator2 = _createForOfIteratorHelper(jugadores),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var jugador = _step2.value;

      var _iterator3 = _createForOfIteratorHelper(jugador.mano),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var ficha = _step3.value;

          if (ficha.id === idFichas[cont]) {
            jugador.turno = true;
            return true;
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  if (cont === idFichas.length) return false;
  cont++;
  turnoInicialJugadores(cont);
};

var buscarFichaId = function buscarFichaId(mano, idFicha) {
  return mano.find(function (ficha) {
    return ficha.id == idFicha;
  });
};

var terminarTurno = function terminarTurno() {
  for (var index in jugadores) {
    if (jugadores[index].turno === true) {
      var pos = index;
      jugadores[pos].turno = false;
      pos++;

      if (pos === jugadores.length) {
        jugadores[0].turno = true;
      } else {
        jugadores[pos].turno = true;
      }

      return;
    }
  }
};

exports.terminarTurno = terminarTurno;

var setearFichaM = function setearFichaM(vs, vi) {
  fichaMesa.vs = vs;
  fichaMesa.vi = vi;
};

var lanzarFicha = function lanzarFicha(idJugador, idFicha) {
  var jugador = getJugador(idJugador);
  console.log('El jugador que va a jugar es:', jugador.username);

  if (jugador.turno) {
    var ficha = buscarFichaId(jugador.mano, idFicha);
    console.log('ficha encontrada', ficha);
    var idFichas = [28, 26, 23, 19, 14, 8, 1];
    var jugadaFichaInic = false;

    if (mesa.length === 0) {
      for (var i = 0; i < idFichas.length; i++) {
        if (ficha.id === idFichas[i]) {
          jugadaFichaInic = true;
          mesa.push(ficha);
          removeFicha(jugador.mano, ficha); //console.log(jugador);

          terminarTurno(); // terminamos el turno del jugador

          setearFichaM(ficha.vs, ficha.vi); //i = idFichas.length;

          return {
            jugador: jugador,
            fichaMesa: fichaMesa
          };
        }
      }

      if (jugadaFichaInic === false) return {
        msg: "Esta no es una ficha inicial, intente de nuevo"
      };
    } else {
      if (ficha.vs === fichaMesa.vs || ficha.vi === fichaMesa.vi || ficha.vi === fichaMesa.vs || ficha.vs === fichaMesa.vi) {
        mesa.push(ficha); // agregamos la ficha a la mesa

        removeFicha(jugador.mano, ficha); // removemos la ficha de la mano del jugador

        terminarTurno(); // terminamos turno de jugador
        //seteamos la ficha

        if (ficha.vs === fichaMesa.vs) {
          fichaMesa.vs = ficha.vi;
          return {
            jugador: jugador,
            fichaMesa: fichaMesa
          };
        } else if (ficha.vi === fichaMesa.vs) {
          fichaMesa.vs = ficha.vs;
          return {
            jugador: jugador,
            fichaMesa: fichaMesa
          };
        }

        if (ficha.vi === fichaMesa.vi) {
          fichaMesa.vi = ficha.vs;
          return {
            jugador: jugador,
            fichaMesa: fichaMesa
          };
        } else if (ficha.vs === fichaMesa.vi) {
          fichaMesa.vi = ficha.vi;
          return {
            jugador: jugador,
            fichaMesa: fichaMesa
          };
        }
      } else {
        return {
          msg: "Esta ficha no coincide con ninguno de los lados"
        };
      }
    }
  } else {
    return {
      msg: "No tienes el turno"
    };
  }
};

exports.lanzarFicha = lanzarFicha;

var jugadorTomaFicha = function jugadorTomaFicha(idJugador, bolsa) {
  if (bolsa.bolsaFichas.length === 0) return {
    msg: 'Ya no quedan fichas'
  };
  var jugador = getJugador(idJugador);
  var ficha = bolsa.tomarFicha();
  jugador.mano.push(ficha);
};

exports.jugadorTomaFicha = jugadorTomaFicha;

var setearMesa = function setearMesa() {
  mesa = [];
  setearFichaM(-1, -1);
};

exports.setearMesa = setearMesa;

var jugadorGanador = function jugadorGanador() {
  return jugadores.find(function (jug) {
    return jug.mano.length === 0;
  });
};

exports.jugadorGanador = jugadorGanador;