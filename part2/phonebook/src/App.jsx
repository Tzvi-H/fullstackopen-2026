import { useState, useEffect } from "react";

import personService from "./services/persons";

import SearchFilter from "./components/SearchFilter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const p = personService.getAll();
    p.then((persons) => setPersons(persons));
  }, []);

  const handleNameChange = (e) => setNewName(e.target.value);
  const handleNumberChange = (e) => setNewNumber(e.target.value);
  const handleFilterChange = (e) => setFilter(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();

    const existingPerson = persons.find((person) => person.name === newName);
    if (existingPerson) {
      if (
        confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`,
        )
      ) {
        const personToUpdate = { ...existingPerson, number: newNumber };
        personService.update(personToUpdate).then((createdPerson) => {
          setPersons(
            persons.map((p) => (p.id !== createdPerson.id ? p : createdPerson)),
          );
          setNotification({ message: `Updated ${newName}`, type: "success" });
          setTimeout(() => setNotification(null), 4000);
          setNewName("");
          setNewNumber("");
        });
      }
      return;
    }

    const newPerson = {
      name: newName,
      number: newNumber,
    };
    personService
      .create(newPerson)
      .then((createdPerson) => {
        setPersons([...persons, createdPerson]);
        setNotification({ message: `Added ${newName}`, type: "success" });
        setTimeout(() => setNotification(null), 4000);
        setNewName("");
        setNewNumber("");
      })
      .catch((error) => {
        setNotification({ message: error.response.data.error, type: "error" });
        setTimeout(() => setNotification(null), 4000);
        console.log(error.response.data.error);
      });
  };

  const handleDelete = (id, name) => {
    if (confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id));
          setNotification({ message: `Deleted ${name}`, type: "success" });
          setTimeout(() => setNotification(null), 4000);
        })
        .catch((e) => {
          setNotification({ message: e.message, type: "error" });
          setTimeout(() => setNotification(null), 4000);
        });
    }
  };

  const personsToShow = persons.filter((p) =>
    p.name.toLocaleLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <SearchFilter filter={filter} handleFilterChange={handleFilterChange} />

      <h2>Add a new</h2>
      <PersonForm
        handleSubmit={handleSubmit}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} onDelete={handleDelete} />
    </div>
  );
};

export default App;
