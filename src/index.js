const express = require("express");
const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checkRepositoryExists(request, response, next) {
  const { id } = request.params;
  const repositoryExist = repositories.some(repository => repository.id === id);
  if (!repositoryExist) {
    return response.status(404).send({ error: "Repository not found" })
  }
  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };
  repositories.push(repository)
  return response.status(201).json(repository);
});

app.put("/repositories/:id", checkRepositoryExists, (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  repositories[repositoryIndex].title = title !== undefined ? title : repositories[repositoryIndex].title;
  repositories[repositoryIndex].url = url !== undefined ? url : repositories[repositoryIndex].url;
  repositories[repositoryIndex].techs = techs !== undefined ? techs : repositories[repositoryIndex].techs;
  return response.status(200).json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", checkRepositoryExists, (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  console.log("repositoryIndex", repositoryIndex);
  console.log("repositories", repositories);
  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", checkRepositoryExists, (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  ++repositories[repositoryIndex].likes;
  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
