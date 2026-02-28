import Person from "./Person";

const Persons = ({ personsToShow, onDelete }) => (
  <div>
    {personsToShow.map((person) => (
      <Person person={person} key={person.id} onDelete={onDelete} />
    ))}
  </div>
);

export default Persons;
