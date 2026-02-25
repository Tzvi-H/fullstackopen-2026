// Header, Content, and Total. All data still resides in the App component, which passes the necessary data to each component
// using props. Header takes care of rendering the name of the course, Content renders the parts and their number of
// exercises and Total renders the total number of exercises.

const Header = ({ course }) => <h1>{course}</h1>;

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Content = ({ part1, part2, part3 }) => (
  <div>
    <Part part={part1} />
    <Part part={part2} />
    <Part part={part3} />
  </div>
);

const Total = ({ x, y, z }) => <p>Number of exercises {x + y + z}</p>;

const App = () => {
  const course = "Half Stack application development";
  const part1 = {
    name: "Fundamentals of React",
    exercises: 10,
  };
  const part2 = {
    name: "Using props to pass data",
    exercises: 7,
  };
  const part3 = {
    name: "State of a component",
    exercises: 14,
  };

  return (
    <div>
      <Header course={course} />
      <Content part1={part1} part2={part2} part3={part3} />
      <Total x={part1.exercises} y={part2.exercises} z={part3.exercises} />
    </div>
  );
};

export default App;
