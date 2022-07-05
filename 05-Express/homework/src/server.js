// const bodyParser = require("body-parser");
const express = require("express");

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = []; // simula la db

const server = express();
// to enable parsing of json bodies for post requests

server.use(express.json());
// TODO: your code to handle requests
server.post("/posts", (req, res) => {
  const post = req.body;
  const error = {
    error: "No se recibieron los parámetros necesarios para crear el Post",
  };

  if (
    post.hasOwnProperty("author") &&
    post.hasOwnProperty("title") &&
    post.hasOwnProperty("contents")
  ) {
    let postOutput = {
      author: post.author,
      title: post.title,
      contents: post.contents,
      id: Math.floor(Math.random() * 100),
    };
    posts.push(postOutput);

    res.status(200).send(postOutput);
  } else {
    res.status(STATUS_USER_ERROR).send(error);
  }
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
  const termParams = req.query;
  //console.log(termParams);
  //logica de filtrar los post por term:
  const postWithTerm = posts.filter((post) => {
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
  }
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
    res.status(200).send(postsAuthorIndicado);
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
    res.status(200).send(postCoincidentes);
  }
});

server.put("/posts", (req, res) => {
  const paramsPost = req.body;
  if (
    paramsPost.hasOwnProperty("id") &&
    paramsPost.hasOwnProperty("title") &&
    paramsPost.hasOwnProperty("contents")
  ) {
    if (!posts.find(({ id }) => id === paramsPost.id)) {
      res.status(STATUS_USER_ERROR).send({
        error: "No se recibio el id necesario para modificar el Post",
      });
    } else {
      let postAct;
      posts.forEach((post) => {
        // console.log("soy un post:", post);
        if (post.id === paramsPost.id) {
          post.title = paramsPost.title;
          post.contents = paramsPost.contents;
          postAct = post;
        }
      });
      res.status(200).send(postAct);
    }
  } else {
    res.status(STATUS_USER_ERROR).send({
      error:
        "No se recibieron los parámetros necesarios para modificar el Post",
    });
  }
});

server.delete("/posts", (req, res) => {
  const body = req.body;
  if (body.hasOwnProperty("id") && posts.find(({ id }) => id === body.id)) {
    const nuevoPosts = [];
    posts.forEach((post) => {
      if (post.id !== body.id) {
        nuevoPosts.push(post);
      }
    });

    posts = nuevoPosts;
    res.status(200).send({ success: true });
  } else {
    res.status(STATUS_USER_ERROR).send({ error: "Mensaje de error" });
  }
});

server.delete("/author", (req, res) => {
  const body = req.body;
  if (
    body.hasOwnProperty("author") &&
    posts.find(({ author }) => author === body.author)
  ) {
    const postEliminados = [];
    const nuevoPosts = [];
    posts.forEach((post) => {
      if (post.author === body.author) {
        postEliminados.push(post);
      } else {
        nuevoPosts.push(post);
      }
    });

    posts = nuevoPosts;
    res.status(200).send(postEliminados);
  } else {
    res
      .status(STATUS_USER_ERROR)
      .send({ error: "No existe el autor indicado" });
  }
});
module.exports = { posts, server };
