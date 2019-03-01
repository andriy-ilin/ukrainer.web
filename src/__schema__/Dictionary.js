import api from "../services/api";
const link = "/dictionary";
const get = async lang => await api.get(`${link}/${lang}`);
const set = async ({ data, link: setLink }) =>
  await api.createWithFullLink({ data, link: `${link}/${setLink}` });

export default { get, set };
