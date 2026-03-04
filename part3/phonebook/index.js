require("dotenv").config();

const morgan = require("morgan");
const express = require("express");
const Person = require("./models/person");

const app = express();

app.use(express.static("dist"));
app.use(express.json());

app.use(express.static("dist"));

const PORT = process.env.PORT || 3001;

morgan.token("body", function (req) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

app.get("/info", (req, res) => {
  res.send(`
        Phonebook has info for ${persons.length} people <br />
        ${new Date().toString()}`);
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((result) => res.json(result));
});

app.get("/api/persons/:id", (req, res) => {
  const person = persons.find((p) => p.id === req.params.id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.post("/api/persons", (req, res) => {
  if (req.body.name === undefined) {
    return res.status(400).json({
      error: "name missing",
    });
  } else if (req.body.number === undefined) {
    return res.status(400).json({
      error: "number missing",
    });
  } else if (persons.some((p) => p.name === req.body.name)) {
    return res.status(400).json({
      error: "person already exists",
    });
  }

  const newPerson = {
    name: req.body.name,
    number: req.body.number,
    id: String(Math.floor(Math.random() * 100000)),
  };
  persons.push(newPerson);
  res.json(newPerson);
});

app.delete("/api/persons/:id", (req, res) => {
  const person = persons.find((p) => p.id === req.params.id);
  if (person) {
    persons = persons.filter((p) => p.id !== req.params.id);
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

app.use((req, res) => {
  res.status(404).json({
    error: "unknown endpoint",
  });
});

app.listen(PORT, () => console.log(`phonebook listening on port ${PORT}`));
