import axios from "axios";

const PERSONS_URL = "https://fullstackopen-2026.onrender.com/api/persons";

const getAll = () => {
  return axios.get(PERSONS_URL).then((response) => response.data);
};

const create = (newPerson) => {
  return axios.post(PERSONS_URL, newPerson).then((response) => response.data);
};

const remove = (id) => {
  return axios.delete(`${PERSONS_URL}/${id}`).then((response) => response.data);
};

const update = (newPerson) => {
  return axios
    .put(`${PERSONS_URL}/${newPerson.id}`, newPerson)
    .then((response) => response.data);
};

export default { getAll, create, remove, update };
