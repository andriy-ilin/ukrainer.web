import React, { Component } from "react";
import { Button, message, Row, Col, Form, Divider } from "antd";
import LangSelect from "../../components/LangSelect";
import Box from "../../components/Box";
import schema from "../../__schema__/";
import { ModalDictionary } from "./ModalView";

class Home extends Component {
  state = {
    lang: "uk",
    data: [],
    top: [],
    favorite: [],
    job: [],
    modal: false
  };

  async componentDidMount() {
    const { lang } = this.state;
    const { top, favorite, job } = await schema.Dictionary.get(lang);
    const data = await schema.CatalogArticles.get(lang);
    return this.setState({
      top,
      favorite,
      job,
      data: Object.values(data)
    });
  }

  getAll = async () => {
    const data = await schema.All.get();
    await this.download(
      JSON.stringify(data),
      "ukrainer-db.json",
      "application/json"
    );
    return message.success("DB success download");
  };

  download = (content, fileName, contentType) => {
    var a = document.createElement("a");
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  };

  updateData = async () => {
    const { lang } = this.state;
    const { top, favorite, job } = await schema.Dictionary.get(lang);
    const data = await schema.CatalogArticles.get(lang);

    return this.setState({
      top,
      favorite,
      job,
      data: Object.values(data)
    });
  };

  handleSave = async data => {
    const { lang, modal } = this.state;
    await schema.Dictionary.set({
      link: `${lang}/${modal}`,
      data: data[modal]
    });
    this.setState({ modal: false, ...data });
    return message.success("Success change data");
  };

  render() {
    const { lang, top, job, favorite, data, modal } = this.state;

    return (
      <>
        <h1>Home</h1>
        <Box my={10}>
          <Button type="primary" onClick={this.getAll}>
            Copy all DB
          </Button>
        </Box>
        <Row type="flex">
          <Box>Lang</Box>
          <WrappedLangForm
            initialValue={lang}
            value={lang}
            onChange={async lang => {
              await this.setState({ lang });
              await this.updateData();
            }}
          />
        </Row>

        <Divider />
        <Row type="flex" justify="space-between">
          <Col span={8}>
            <Box mb={10}>
              <h2>List top stories</h2>
              <Button
                type="primary"
                onClick={() => this.setState({ modal: "top" })}
              >
                Change list
              </Button>
            </Box>
            {top.map((el, key) => {
              const { mainBg, mainTitle, id } =
                data.find(({ id }) => id === el) || {};
              return (
                <div key={el}>
                  <p>
                    {key + 1}. {id}
                  </p>
                  <p>{mainTitle}</p>
                  <img src={mainBg} alt={mainBg} height={100} width="auto" />
                  <Divider />
                </div>
              );
            })}
          </Col>
          <Col span={8}>
            <Box mb={10}>
              <h2>List favorites stories</h2>
              <Button
                type="primary"
                onClick={() => this.setState({ modal: "favorite" })}
              >
                Change list
              </Button>
            </Box>
            {favorite.map((el, key) => {
              const { mainBg, mainTitle, id } =
                data.find(({ id }) => id === el) || {};
              return (
                <div key={el}>
                  <p>
                    {key + 1}. {id}
                  </p>
                  <p>{mainTitle}</p>
                  <img src={mainBg} alt={mainBg} height={100} width="auto" />
                  <Divider />
                </div>
              );
            })}
          </Col>
          <Col span={6}>
            <Box mb={10}>
              <h2>List jobs of persons</h2>
              <Button
                type="primary"
                onClick={() => this.setState({ modal: "job" })}
              >
                Change list
              </Button>
            </Box>
            {job.map((el, key) => {
              return (
                <div key={el}>
                  <p>
                    {key + 1}. {el}
                  </p>
                </div>
              );
            })}
          </Col>
        </Row>

        <ModalDictionary
          data={modal === "top" ? top : modal === "favorite" ? favorite : job}
          visible={!!modal}
          listName={modal}
          onSubmit={this.handleSave}
          closeModal={() => this.setState({ modal: false })}
        />
      </>
    );
  }
}

const LangForm = ({ form: { getFieldDecorator }, ...props }) => (
  <LangSelect getFieldDecorator={getFieldDecorator} {...props} />
);
const WrappedLangForm = Form.create({ name: "lang" })(LangForm);

export default Home;
