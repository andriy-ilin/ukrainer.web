import api from "../services/api";
const link = "/orders";
const get = async () => await api.get(`${link}`);
const set = async ({ data, id }) =>
  await api.createWithFullLink({ data, link: `${link}/${id}` });

const remove = async ({ id }) => api.remove({ link: `${link}/${id}` });

export default { get, set, remove };
