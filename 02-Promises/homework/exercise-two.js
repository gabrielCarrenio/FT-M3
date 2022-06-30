"use strict";

var Promise = require("bluebird"),
  async = require("async"),
  exerciseUtils = require("./utils");

var readFile = exerciseUtils.readFile,
  promisifiedReadFile = exerciseUtils.promisifiedReadFile,
  blue = exerciseUtils.blue,
  magenta = exerciseUtils.magenta;

var args = process.argv.slice(2).map(function (st) {
  return st.toUpperCase();
});

module.exports = {
  problemA: problemA,
  problemB: problemB,
  problemC: problemC,
  problemD: problemD,
  problemE: problemE,
};

// corre cada problema dado como un argumento del command-line para procesar
args.forEach(function (arg) {
  var problem = module.exports["problem" + arg];
  if (problem) problem();
});

function problemA() {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * A. loggea el poema dos stanza uno y stanza dos en cualquier orden
   *    pero loggea 'done' cuando ambos hayan terminado
   *    (ignora errores)
   *    nota: lecturas ocurriendo paralelamente (en simultaneo)
   *
   */

  // callback version
  /*   async.each(
    ["poem-two/stanza-01.txt", "poem-two/stanza-02.txt"],
    function (filename, eachDone) {
      readFile(filename, function (err, stanza) {
        console.log("-- A. callback version --");
        blue(stanza);
        eachDone();
      });
    },
    function (err) {
      console.log("-- A. callback version done --");
    }
  ); */

  // promise version
  /*   Promise.all([ // una forma
    promisifiedReadFile("poem-two/stanza-01.txt").then((stanza) => {
      blue(stanza);
    }),
    promisifiedReadFile("poem-two/stanza-02.txt").then((stanza) => {
      blue(stanza);
    }),
  ]).then(() => console.log("done")); */
  // Solamente encapsulo los iterables en consts para hacer mas facil la lectura del codigo!
  const promiseOne = promisifiedReadFile("poem-two/stanza-01.txt").then(
    (stanza) => {
      blue(stanza);
    }
  );
  const promiseTwo = promisifiedReadFile("poem-two/stanza-02.txt").then(
    (stanza) => {
      blue(stanza);
    }
  );
  // por cada elemento del array que recibe Promise.all, se ejecuta y resuelve de forma random pero no solo se ejecutan las promesas
  // si no que se ejecutan y resuelven en el mismo momento, por eso Promises.all terminar de resolver todas las promises
  // agarra y devuelve un array con los values de cada elemento (promesas resueltas con sus respectivos valores ya trabajados en sus thens) y solo resta añadirles el "done" respectivo al final de la ejecicion de las mismas!
  Promise.all([promiseOne, promiseTwo]).then(() => console.log("done"));
}

function problemB() {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * B. loggea todas las stanzas en poema dos, en cualquier orden y loggea
   *    'done' cuando todas hayan terminado
   *    (ignora errores)
   *    nota: las lecturas ocurren en paralelo (en simultaneo)
   *
   */

  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return "poem-two/" + "stanza-0" + n + ".txt";
  });

  // callback version
  /*   async.each(
    filenames,
    function (filename, eachDone) {
      readFile(filename, function (err, stanza) {
        console.log("-- B. callback version --");
        blue(stanza);
        eachDone();
      });
    },
    function (err) {
      console.log("-- B. callback version done --");
    }
  ); */

  // promise version
  //En este caso, no aplicamos el .then en cada elemento del arr que le otorgamos a Promise.all porque no necesitamos que el orden sea aleatorio, con que simplemente Promise.all retorne un arr con promises, ya basta para iterar esas promesas con un ciclo y asi ir haciendo cada uno de los .then correspondientes!
  Promise.all(filenames.map((filename) => promisifiedReadFile(filename))).then(
    (promisesFilenames) => {
      promisesFilenames.forEach((stanza) => blue(stanza));
      console.log("done");
    }
  );
  // otra forma:
  /*   const filesNamesResolve = filenames.map((filename) =>
    promisifiedReadFile(filename).then((stanza) => blue(stanza))
  );
  Promise.all(filesNamesResolve).then(() => console.log("done")); */
}

function problemC() {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * C. Lee y loggea todas las stanzas en el poema dos, *en orden* y
   *    loggea 'done cuando hayan terminado todas
   *    (ignorá errores)
   *    nota: las lecturas ocurren en serie (solo cuando las previas
   *    hayan terminado)
   *
   */

  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return "poem-two/" + "stanza-0" + n + ".txt";
  });

  // callback version
  /*   async.eachSeries(
    filenames,
    function (filename, eachDone) {
      readFile(filename, function (err, stanza) {
        console.log("-- C. callback version --");
        blue(stanza);
        eachDone();
      });
    },
    function (err) {
      console.log("-- C. callback version done --");
    }
  ); */

  // promise version
  /*   Promise.all( // resolviendo las promesas en el mismo map... solamente seria como prorrogar el valor del .then, un pasa manos!
    filenames.map((filename) =>
      promisifiedReadFile(filename).then((stanza) => stanza)
    )
  ).then((promisesFilenames) => {
    promisesFilenames.forEach((stanza) => blue(stanza));
    console.log("done");
  }); */
  Promise.all(filenames.map((filename) => promisifiedReadFile(filename))).then(
    (promisesFilenames) => {
      promisesFilenames.forEach((stanza) => blue(stanza));
      console.log("done");
    }
  );
}

function problemD() {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * D. loggea todas las stanzas en el poema dos *en orden* asegurandote
   *    de fallar para cualquier error y logueando un 'done cuando todas
   *    hayan terminado
   *    nota: las lecturas ocurren en serie (solo cuando las previas
   *    hayan terminado)
   *
   */

  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return "poem-two/" + "stanza-0" + n + ".txt";
  });
  var randIdx = Math.floor(Math.random() * filenames.length);
  filenames[randIdx] = "wrong-file-name-" + (randIdx + 1) + ".txt";

  // callback version
  /*   async.eachSeries(
    filenames,
    function (filename, eachDone) {
      readFile(filename, function (err, stanza) {
        console.log("-- D. callback version --");
        if (err) return eachDone(err);
        blue(stanza);
        eachDone();
      });
    },
    function (err) {
      if (err) magenta(new Error(err));
      console.log("-- D. callback version done --");
    }
  ); */

  // promise version
  // Aca basicamente realizo lo mismo que vengo haciendo en los demas .all, solo que manejo el errorHandler de cualquier promesa
  //que devuelva el Promise.all. Capturo el erroH posible de cualquier promesa con catch y considero loggear done en cualquier caso
  // si resolvemos o rechazamos las promises...
  /*   Promise.all(filenames.map((filename) => promisifiedReadFile(filename)))
    .then((promisesFilenames) => {
      promisesFilenames.forEach((stanza) => blue(stanza));
    })
    .catch((err) => magenta(new Error(err)))
    .finally(() => console.log("done")); */
  Promise.all(
    filenames.reduce(
      (acc, filename) => [...acc, promisifiedReadFile(filename)],
      []
    )
  )
    .then((promisesFilenames) => {
      promisesFilenames.forEach((stanza) => blue(stanza));
    })
    .catch((err) => magenta(new Error(err)))
    .finally(() => console.log("done"));
}

function problemE() {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * E. Haz una versión promisificada de fs.writeFile
   *
   */

  var fs = require("fs");
  function promisifiedWriteFile(filename, str) {
    return new Promise(filename)
      .then((stanza) => {
        blue(stanza);
      })
      .catch((err) => magenta(new Error(err)))
      .finally(() => console.log(str));
  }
}
