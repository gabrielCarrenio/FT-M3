// const bodyParser = require("body-parser");
const express = require("express");

const STATUS_OK = 200;
const STATUS_USER_ERROR = 422;
let nextId = 1;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = []; // simula la db

const server = express();
// to enable parsing of json bodies for post requests
//
//params:
// /posts/:id/:author/:title => /posts/hola/gabi/la historia de gabi
// query: /posts/?id=hola&author=gabi&title=la historia de gabi //puedo obviar algunos de los parametros y seguiria funcionando! esa es la ventaja de query!

server.use(express.json()); //aplico el midlware que me tradusca del japones al español para el server
// TODO: your code to handle requests
server.post("/posts", (req, res) => {
  // normalmente trabajamos com body, en post y en put
  const { author, title, contents } = req.body;
  const error = {
    error: "No se recibieron los parámetros necesarios para crear el Post",
  };

  if (!author || !title || !contents) {
    // aca tener cuidado con enviar .json o .send, el send me define un content type string y el .json en obviamente un type content en json!
    //TENER EN CUENTA EL RETURN!!! YA QUE NO CORTARIA LA LECTURA DEL CODIGO! y no se pueden enviar dos res!!!
    return res.status(STATUS_USER_ERROR).json(error);
  }
  let nuevoPost = {
    author,
    title,
    contents,
    id: nextId,
  };
  posts.push(nuevoPost);
  nextId++;
  res.json(nuevoPost);
});

server.post("/posts/author/:author", (req, res) => {
  const postBody = req.body;
  const parametro = req.params;
  /* console.log("soy el:", parametro); */
  if (
    postBody.hasOwnProperty("title") &&
    postBody.hasOwnProperty("contents") &&
    parametro.hasOwnProperty("author")
  ) {
    let postObj = {
      title: postBody.title,
      contents: postBody.contents,
      id: Math.floor(Math.random() * 100),
      author: parametro.author,
    };
    posts.push(postObj);
    res.status(200).send(postObj);
  } else {
    res.status(STATUS_USER_ERROR).send({
      error: "No se recibieron los parámetros necesarios para crear el Post",
    });
  }
});

server.get("/posts", (req, res) => {
  //const termParams = req.query;
  const { term } = req.query;
  //console.log(termParams);
  //logica de filtrar los post por term:
  if (term) {
    const term_posts = posts.filter(
      (p) => p.title.includes(term) || p.contents.includes(term)
    );
    return res.json(term_posts);
  }
  return res.json(posts); // por default envia un status 200
  /*   const postWithTerm = posts.filter((post) => {
    if (
      post.title.split(" ").includes(termParams.term) &&
      post.contents.split(" ").includes(termParams.term)
    ) {
      return post;
    } else if (post.contents.split(" ").includes(termParams.term)) {
      return post;
    } else if (post.title.split(" ").includes(termParams.term)) {
      return post;
    }
  });
  if (postWithTerm && termParams.term) {
    res.status(200).send(postWithTerm);
  } else {
    res.status(200).send(posts);
  } */
});

server.get("/posts/:author", (req, res) => {
  const parametro = req.params;
  const postsAuthorIndicado = posts.filter((post) => {
    if (post.author === parametro.author) {
      return post;
    }
  });
  if (postsAuthorIndicado.length == 0) {
    res
      .status(STATUS_USER_ERROR)
      .send({ error: "No existe ningun post del autor indicado" });
  } else {
    //res.status(200).send(postsAuthorIndicado);
    res.json(postsAuthorIndicado);
  }
});

server.get("/posts/:author/:title", (req, res) => {
  const parametros = req.params;
  const postCoincidentes = posts.filter((post) => {
    if (post.title === parametros.title && post.author === parametros.author) {
      return post;
    }
  });
  if (postCoincidentes.length === 0) {
    res.status(STATUS_USER_ERROR).send({
      error: "No existe ningun post con dicho titulo y autor indicado",
    });
  } else {
    // res.status(200).send(postCoincidentes);
    res.json(postCoincidentes);
  }
});

server.put("/posts", (req, res) => {
  const { id, title, contents } = req.body;
  if (id && title && contents) {
    //en el caso de estar trabajando por query o paramas, se reciben string entonces no es necesario parear a int!
    let post = posts.find((p) => p.id === parseInt(id)); //esta la referencia del post!
    if (post) {
      // al trabajar con referencia, logro cambiar los datos:
      post.title = title;
      post.contents = contents;
      postAct = post;
      return res.json(post);
    } else {
      res
        .status(STATUS_USER_ERROR)
        .json({ error: "No existe ningun post con dicho ID" });
    }
  } else {
    res.status(STATUS_USER_ERROR).json({
      error: "No se recibio el id necesario para modificar el Post",
    });
  }
});

server.delete("/posts", (req, res) => {
  const { id } = req.body;
  const post = posts.find((p) => p.id === id);
  if (!id || !post) {
    return res.status(STATUS_USER_ERROR).json({ error: "Mensaje de error" });
  }
  posts = posts.filter((p) => p.id !== parseInt(id)); //quedate con todos los elementos que no tengan ese id

  res.json({ success: true });
});

server.delete("/author", (req, res) => {
  const { author } = req.body;
  const author_found = posts.find((p) => p.author === author);
  if (!author || !author_found) {
    return res
      .status(STATUS_USER_ERROR)
      .json({ error: "No existe el autor indicado" });
  }
  const autoresEliminados = [];

  posts = posts.filter((post) => {
    if (post.author !== author) {
      return true;
    } else {
      autoresEliminados.push(post);
      // no  hace falta poner el return false, ya que filter no le interesa los false!
    }
    /*  if (post.author === author) {
      autoresEliminados.push(post);
    } else {
      return post;
    } */
  });

  res.json(autoresEliminados);
});
module.exports = { posts, server };
