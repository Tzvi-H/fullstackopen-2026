// Header, Content, and Total. All data still resides in the App component, which passes the necessary data to each component
// using props. Header takes care of rendering the name of the course, Content renders the parts and their number of
// exercises and Total renders the total number of exercises.

const Header = ({ course }) => <h1>{course}</h1>;
const Content = ({ part, exercise }) => (
  <p>
    {part} {exercise}
  </p>
);
const Total = ({ x, y, z }) => <p>Number of exercises {x + y + z}</p>;

const App = () => {
  const course = "Half Stack application development";
  const part1 = "Fundamentals of React";
  const exercises1 = 10;
  const part2 = "Using props to pass data";
  const exercises2 = 7;
  const part3 = "State of a component";
  const exercises3 = 14;

  return (
    <div>
      <Header course={course} />
      <Content part={part1} exercise={exercises1} />
      <Content part={part2} exercise={exercises2} />
      <Content part={part3} exercise={exercises3} />
      <Total x={exercises1} y={exercises2} z={exercises3} />
    </div>
  );
};

export default App;
