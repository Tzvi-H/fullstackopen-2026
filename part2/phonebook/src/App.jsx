import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "987-654-3210" },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const handleNameChange = (e) => setNewName(e.target.value);
  const handleNumberChange = (e) => setNewNumber(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    const newPerson = {
      name: newName,
      number: "123-456-789",
    };
    setPersons([...persons, newPerson]);
    setNewName("");
    setNewNumber("");
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={handleSubmit}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map((person) => (
        <p key={person.name}>
          {person.name} {person.number}
        </p>
      ))}
    </div>
  );
};

export default App;
