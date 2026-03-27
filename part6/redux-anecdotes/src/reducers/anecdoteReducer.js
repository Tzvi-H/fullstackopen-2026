import { createSlice } from "@reduxjs/toolkit";
import anecdotesService from "../services/anecdotes";

const anecdotesSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    setAnecdotes(state, action) {
      return action.payload;
    },
    createAnecdote(state, action) {
      state.push(action.payload);
    },
    voteFor(state, action) {
      const anecdote = state.find((a) => a.id === action.payload);
      return state.map((a) =>
        a.id === anecdote.id ? { ...anecdote, votes: anecdote.votes + 1 } : a,
      );
    },
  },
});

const { setAnecdotes, createAnecdote } = anecdotesSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdotesService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const appendAnecdote = (content) => {
  return async (dispatch) => {
    const savedAnecdote = await anecdotesService.createNew(content);
    dispatch(createAnecdote(savedAnecdote));
  };
};

export const { voteFor } = anecdotesSlice.actions;
export default anecdotesSlice.reducer;
