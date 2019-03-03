import firebase from "firebase/app";
import "firebase/database";

class ApiService {
  fb = firebase;

  get = ref =>
    this.fb
      .database()
      .ref(ref)
      .once("value")
      .then(res => res.val());

  create = async ({ data, link }) => {
    const id = await this.fb
      .database()
      .ref(link)
      .push().key;
    const dateAdd = new Date();

    await this.fb
      .database()
      .ref(`${link}/${id}`)
      .set({ ...data, id, dateAdd: dateAdd.toISOString() });
    return { ...data, id, dateAdd: dateAdd.toISOString() };
  };

  createWithFullLink = ({ data, link }) =>
    this.fb
      .database()
      .ref(`${link}`)
      .set(data);

  remove = ({ link }) =>
    this.fb
      .database()
      .ref(`${link}`)
      .remove();
}

export default new ApiService();
