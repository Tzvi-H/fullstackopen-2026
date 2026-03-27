import { createSlice } from "@reduxjs/toolkit";

const anecdotesSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    setAnecdotes(state, action) {
      return action.payload;
    },
    createAnecdote(state, action) {
      // state.push(asObject(action.payload));
      return action.payload;
    },
    voteFor(state, action) {
      const anecdote = state.find((a) => a.id === action.payload);
      return state.map((a) =>
        a.id === anecdote.id ? { ...anecdote, votes: anecdote.votes + 1 } : a,
      );
    },
  },
});

export const { createAnecdote, voteFor, setAnecdotes } = anecdotesSlice.actions;
export default anecdotesSlice.reducer;
