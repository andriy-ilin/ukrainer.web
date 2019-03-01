import api from "../services/api";
const link = "/";
const get = async () => await api.get(link);

export default { get };
