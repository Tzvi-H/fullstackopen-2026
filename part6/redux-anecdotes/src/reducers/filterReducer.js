export const filterChange = (filter) => {
  return {
    type: "SET_FILTER",
    payload: filter,
  };
};

const reducer = (state = "a", action) => {
  switch (action.type) {
    case "SET_FILTER": {
      return action.payload;
    }
    default:
      return state;
  }
};

export default reducer;
