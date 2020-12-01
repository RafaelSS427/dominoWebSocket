"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _underscore = require("underscore");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Bolsa = /*#__PURE__*/function () {
  function Bolsa() {
    _classCallCheck(this, Bolsa);

    this.bolsaFichas = [];
    this.generarFichas();
    this.revolverFichas();
  }

  _createClass(Bolsa, [{
    key: "generarFichas",
    value: function generarFichas() {
      var id = 1;

      for (var i = 0; i < 29; i++) {
        for (var j = i; j < 7; j++) {
          this.bolsaFichas.push({
            id: id,
            vs: i,
            vi: j
          }); // vs = valor superior, vi = valor inferior

          id++;
        }
      }
    }
  }, {
    key: "revolverFichas",
    value: function revolverFichas() {
      this.bolsaFichas = (0, _underscore.shuffle)(this.bolsaFichas);
    }
  }, {
    key: "tomarFicha",
    value: function tomarFicha() {
      return this.bolsaFichas.pop();
    }
  }, {
    key: "fichasIniciales",
    value: function fichasIniciales() {
      var fichas = [];

      for (var i = 0; i < 7; i++) {
        fichas.push(this.tomarFicha());
      }

      return fichas;
    }
  }, {
    key: "reiniciarBolsa",
    value: function reiniciarBolsa() {
      this.bolsaFichas = [];
      this.generarFichas();
      this.revolverFichas();
    }
  }]);

  return Bolsa;
}();

var _default = Bolsa;
exports["default"] = _default;