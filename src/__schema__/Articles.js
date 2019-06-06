import api from "../services/api";
const link = "/articles";
const get = async () => await api.get(link);
const getById = async id => await api.get(`${link}/${id}`);
const create = async ({ data, model, link, successFn }) =>
  await api.get({ data, model, link, successFn });

export default { get, getById, create };
