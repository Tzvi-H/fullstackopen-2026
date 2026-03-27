const baseUrl = "http://localhost:3001/anecdotes";

const getAll = async () => {
  const response = await fetch(baseUrl);

  if (!response.ok) {
    throw new Error("Failed to fetch anecdotes");
  }

  return await response.json();
};

const createNew = async (content) => {
  const response = await fetch(baseUrl, {
    method: "Post",
    body: JSON.stringify({ content, votes: 0 }),
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch anecdotes");
  }

  return await response.json();
};

const update = async (anecdote) => {
  const response = await fetch(`${baseUrl}/${anecdote.id}`, {
    method: "Put",
    body: JSON.stringify(anecdote),
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch anecdotes");
  }

  return await response.json();
};

export default { getAll, createNew, update };
