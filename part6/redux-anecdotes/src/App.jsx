import { useEffect } from "react";
import { useDispatch } from "react-redux";
import anecdotesService from "./services/anecdotes";
import { setAnecdotes } from "./reducers/anecdoteReducer";
import AnecdoteList from "./components/AnecdoteList";
import AnecdoteForm from "./components/AnecdoteForm";
import Filter from "./components/Filter";
import Notification from "./components/Notification";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    anecdotesService
      .getAll()
      .then((anecdotes) => dispatch(setAnecdotes(anecdotes)));
  }, [dispatch]);

  return (
    <div>
      <Notification />
      <h2>Anecdotes</h2>
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  );
};

export default App;
