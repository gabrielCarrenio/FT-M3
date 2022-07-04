"use strict";
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:
function $Promise(executor) {
  // compruebo que sea un type function el executor!
  if (typeof executor !== "function") throw new TypeError("executor function");
  this._value = undefined;
  this._state = "pending";
  this._handlerGroups = []; // [{sH,eH},{sH,eH},{sH,eH},{sH,eH}]...
  //con el bind logro que todos los this con los que trabajen estos dos metodos, apunten a la instancia
  //es como conectarle el this de la instancia $Promise a cada metodo...
  executor(this._internalResolve.bind(this), this._internalReject.bind(this));
}

$Promise.prototype._internalResolve = function (someData) {
  if (this._state === "pending") {
    // solo se cambia una sola vez el value y el state!!!!!
    this._state = "fulfilled";
    this._value = someData;
    this.callHandlers();
  }
};
$Promise.prototype._internalReject = function (myReason) {
  // solo se cambia una sola vez el value y el state!!!!!
  if (this._state === "pending") {
    this._state = "rejected";
    this._value = myReason;
    this.callHandlers();
  }
};

$Promise.prototype.then = function (successCb, errorCb) {
  // una forma:
  /* if (typeof successCb !== "function" && typeof errorCb !== "function") {
    this._handlerGroups.push(false);
  } else {
    this._handlerGroups.push({ successCb, errorCb });
  } */
  if (typeof successCb !== "function") successCb = false;
  if (typeof errorCb !== "function") errorCb = false;
  this._handlerGroups.push({ successCb, errorCb });
  if (this._state !== "pending") {
    this.callHandlers();
  }
};

$Promise.prototype.callHandlers = function () {
  while (this._handlerGroups.length > 0) {
    // solo trabajare mientras tenga info en ese arr...
    // [{SH1,EH1}, {SH2,EH2},{SH3,EH3}]
    let current = this._handlerGroups.shift();
    // ahora evaluo el state
    if (this._state === "fulfilled") {
      current.successCb && current.successCb(this._value);
    } else if (this._state === "rejected") {
      current.errorCb && current.errorCb(this._value);
    }
  }
};

module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
