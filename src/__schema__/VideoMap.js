import api from "../services/api";
const link = "/videoMap";
const get = async lang => await api.get(`${link}/uk`);
const setWithCreateId = async ({ data }) =>
  await api.create({ data, link: `${link}/uk` });
const set = async ({ data, id }) =>
  await api.createWithFullLink({ data, link: `${link}/uk/${id}` });
const remove = async ({ id }) => api.remove({ link: `${link}/uk/${id}` });

export default { get, set, setWithCreateId, remove };
