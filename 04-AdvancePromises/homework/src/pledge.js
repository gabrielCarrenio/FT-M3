"use strict";
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:
function $Promise(executor, state = "pending") {
  this._value;
  this._state = state;
  return executor(this._internalResolve, this._internalReject);
}

$Promise.prototype._internalResolve = function (someData) {
  if (this._state === "pending") {
    this._state = "fulfilled";
    this._value = someData;
  }
};
$Promise.prototype._internalReject = function (myReason) {
  if (this._state === "pending") {
    this._state = "rejected";
    this._value = myReason;
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
