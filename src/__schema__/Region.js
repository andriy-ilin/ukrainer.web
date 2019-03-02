import api from "../services/api";
const link = "/region";
const get = async lang => await api.get(`${link}/${lang}`);
const set = async ({ data, link: lang }) =>
  await api.createWithFullLink({ data, link: `${link}/${lang}` });

const remove = async ({ id }) => api.remove({ link: `${link}/${id}` });

export default { get, set, remove };
