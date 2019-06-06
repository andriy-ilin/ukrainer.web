import api from "../services/api";
const link = "/catalog";
const get = async lang => await api.get(`${link}/${lang}`);
const getById = async (lang, id) => await api.get(`${link}/${lang}/${id}`);
const create = async ({ data, model, link, successFn }) =>
  await api.get({ data, model, link, successFn });

export default { get, getById, create };
