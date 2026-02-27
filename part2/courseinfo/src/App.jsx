// Header, Content, and Total. All data still resides in the App component, which passes the necessary data to each component
// using props. Header takes care of rendering the name of the course, Content renders the parts and their number of
// exercises and Total renders the total number of exercises.

const Header = ({ course }) => <h1>{course}</h1>;

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Content = ({ parts }) => (
  <div>
    {parts.map((part, index) => (
      <Part part={part} key={index} />
    ))}
  </div>
);

const Total = ({ parts }) => {
  const total = parts.reduce((acc, curr) => acc + curr.exercises, 0);
  return <p>Number of exercises {total}</p>;
};

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

const App = () => {
  const course = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
      },
      {
        name: "State of a component",
        exercises: 14,
      },
      {
        name: "Typescript",
        exercises: 25,
      },
    ],
  };

  return <Course course={course} />;
};

export default App;
