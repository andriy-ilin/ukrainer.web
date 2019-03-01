import api from "../services/api";
const link = "/users";
const get = async () => await api.get(`${link}`);
const remove = async ({ id }) => api.remove({ link: `${link}/${id}` });

export default { get, remove };
