import axios from "axios";

const PERSONS_URL = "http://localhost:3001/persons";

const getAll = () => {
  return axios.get(PERSONS_URL).then((response) => response.data);
};

const create = (newPerson) => {
  return axios.post(PERSONS_URL, newPerson).then((response) => response.data);
};

const remove = (id) => {
  return axios.delete(`${PERSONS_URL}/${id}`).then((response) => response.data);
};

export default { getAll, create, remove };
