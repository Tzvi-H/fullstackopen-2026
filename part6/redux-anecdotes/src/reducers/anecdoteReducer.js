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
    updateAnecdote(state, action) {
      const anecdote = action.payload;
      return state.map((a) => (a.id === anecdote.id ? anecdote : a));
    },
  },
});

const { setAnecdotes, createAnecdote, updateAnecdote } = anecdotesSlice.actions;

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

export const replaceAnecdote = (updatedAnecdote) => {
  return async (dispatch) => {
    const savedAnecdote = await anecdotesService.update(updatedAnecdote);
    dispatch(updateAnecdote(savedAnecdote));
  };
};

export default anecdotesSlice.reducer;
