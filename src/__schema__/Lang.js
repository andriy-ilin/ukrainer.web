import api from "../services/api";
const link = "/lang";
const get = async lang => await api.get(`${link}`);
const set = async ({ data }) => await api.createWithFullLink({ data, link });

export default { get, set };
