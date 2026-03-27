import { useSelector, useDispatch } from "react-redux";
import { replaceAnecdote } from "../reducers/anecdoteReducer";
import {
  setNotification,
  removeNotification,
} from "../reducers/notificationReducer";

const AnecdoteList = () => {
  const dispatch = useDispatch();
  const anecdotes = useSelector((state) =>
    [...state.anecdotes].sort((a, b) => b.votes - a.votes),
  );
  const filter = useSelector((state) => state.filter);

  const vote = (anecdote) => {
    const newAnecdote = { ...anecdote, votes: anecdote.votes + 1 };
    dispatch(replaceAnecdote(newAnecdote));
    dispatch(setNotification(`You voted '${anecdote.content}'`));
    setTimeout(() => {
      dispatch(removeNotification());
    }, 3000);
  };

  const filteredAnecdotes = anecdotes.filter((a) =>
    a.content.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div>
      {filteredAnecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
