import api from "../services/api";
const link = "/video";
const get = async lang => await api.get(`${link}/${lang}`);
const setWithCreateId = async ({ data, lang }) =>
  await api.create({ data, link: `${link}/${lang}` });
const set = async ({ data, id, lang }) =>
  await api.createWithFullLink({ data, link: `${link}/${lang}/${id}` });
const remove = async ({ id, lang }) =>
  api.remove({ link: `${link}/${lang}/${id}` });

export default { get, set, setWithCreateId, remove };
