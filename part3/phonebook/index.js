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
  Person.countDocuments({}).then((count) => {
    res.send(`
        Phonebook has info for ${count} people <br />
        ${new Date().toString()}`);
  });
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((result) => res.json(result));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (!person) {
        return res.status(404).json({ error: "unknown endpoint" });
      }

      res.json(person);
    })
    .catch((e) => next(e));
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
  }

  const newPerson = new Person({
    name: req.body.name,
    number: req.body.number,
  });
  newPerson.save().then((result) => res.json(result));
});

app.put("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id).then((person) => {
    if (!person) {
      return res.status(404).send({ error: "unknown endpoint" });
    }

    person.number = req.body.number;
    person
      .save()
      .then((result) => res.json(result))
      .catch((e) => next(e));
  });
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => res.status(204).end())
    .catch((e) => next(e));
});

app.use((req, res) => {
  res.status(404).json({
    error: "unknown endpoint",
  });
});

app.use((error, req, res, next) => {
  if (error.name === "CastError") {
    console.log(error);
    return res.status(400).json({ error: "malformatted id" });
  }

  next();
});

app.listen(PORT, () => console.log(`phonebook listening on port ${PORT}`));
