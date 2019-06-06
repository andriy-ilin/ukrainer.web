import api from "../services/api";
const link = "/catalogShopItems";
const get = async lang => await api.get(`${link}/${lang}`);
export default { get };
