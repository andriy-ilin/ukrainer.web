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

  create = ({ data, model, link, successFn }) => {
    const id = this.fb
      .database()
      .ref(link)
      .push().key;

    successFn({ id, data });

    return this.fb
      .database()
      .ref(`${link}/${id}`)
      .set(model);
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
