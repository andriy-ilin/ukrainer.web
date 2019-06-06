import React, { Component } from "react";
import { Modal, Form, Input, Row, Col, Button, DatePicker, Icon } from "antd";
import moment from "moment";
import LangSelect from "../../components/LangSelect";
import RegionSelect from "../../components/RegionSelect";
import TagSelect from "../../components/TagSelect";
import Switch from "../../components/Switch";
import Box from "../../components/Box/";
import AuthorsTable from "./AuthorsTable";

import "./style.css";

export class NewArticleModal extends Component {
  state = {};
  async componentDidMount() {}

  render() {
    const { handleAdd, visible, closeModal, data = {} } = this.props;
    return (
      <Modal
        title="New article"
        width={750}
        centered
        visible={visible}
        onCancel={closeModal}
        footer={[
          <Button key="back" onClick={closeModal}>
            Cancel
          </Button>,
          <Button
            key="submit"
            form="article-form"
            type="primary"
            htmlType="submit"
          >
            Save Changes
          </Button>
        ]}
      >
        <WrappedArticleForm data={data} onSubmit={handleAdd} />
      </Modal>
    );
  }
}

const ArticleForm = ({
  data: { lang, mainTitle, href, mainBg, date, region, main320Bg } = {},
  form: { getFieldDecorator, validateFields },
  onSubmit = () => {}
}) => {
  return (
    <Form
      className="article-form"
      id="article-form"
      onSubmit={async e => {
        e.preventDefault();
        validateFields(async (err, values) => {
          if (!err) {
            onSubmit({
              ...values,
              date: moment(values.date).toISOString()
            });
          }
        });
      }}
      hideRequiredMark={true}
    >
      <ArticleGrid
        label="Title"
        value={
          <FieldArticle
            name="mainTitle"
            value={mainTitle}
            getFieldDecorator={getFieldDecorator}
          />
        }
      />
      <ArticleGrid
        label="Href"
        value={
          <FieldArticle
            name="href"
            value={href}
            getFieldDecorator={getFieldDecorator}
          />
        }
      />
      <ArticleGrid
        label="Main bg foto"
        value={
          <FieldArticle
            name="mainBg"
            value={mainBg}
            getFieldDecorator={getFieldDecorator}
          />
        }
      />
      <ArticleGrid
        label="Small bg foto"
        value={
          <FieldArticle
            name="main320Bg"
            value={main320Bg}
            getFieldDecorator={getFieldDecorator}
          />
        }
      />
      <ArticleGrid
        label="Date"
        value={
          <FieldArticle
            name="date"
            value={date}
            getFieldDecorator={getFieldDecorator}
            inputComponent={DatePicker}
            format="DD.MM.YYYY"
            validateRules={[
              {
                type: "object",
                required: true,
                message: "Please select date!"
              }
            ]}
            className="article-form-input-picker"
          />
        }
      />
      <ArticleGrid
        label="Lang"
        value={
          <LangSelect
            className="article-form-input"
            initialValue={lang}
            value={lang}
            getFieldDecorator={getFieldDecorator}
          />
        }
      />
      <ArticleGrid
        label="Region"
        value={
          <RegionSelect
            className="article-form-input"
            initialValue={region}
            value={region}
            getFieldDecorator={getFieldDecorator}
          />
        }
      />
    </Form>
  );
};

export class ModalLang extends Component {
  state = {};

  render() {
    const { visible, closeModal, data = {}, onSubmit = () => {} } = this.props;
    return (
      <Modal
        title={`Translation for article: "${data.mainTitle}"`}
        width={750}
        centered
        visible={visible}
        onCancel={closeModal}
        footer={[
          <Button key="back" onClick={closeModal}>
            Cancel
          </Button>,
          <Button
            key="submit"
            form="lang-form"
            type="primary"
            htmlType="submit"
          >
            Save Changes
          </Button>
        ]}
      >
        <WrappedLangForm data={data} onSubmit={onSubmit} />
      </Modal>
    );
  }
}

class LangForm extends Component {
  state = {
    dynamicFormItems: []
  };

  componentDidMount() {
    const {
      data: { subLinks }
    } = this.props;
    this.setState({ dynamicFormItems: subLinks });
  }

  addItem = () => {
    const { dynamicFormItems } = this.state;
    this.setState({
      dynamicFormItems: [...dynamicFormItems, { href: "", lang: "" }]
    });
  };
  removeItem = lang => {
    const { dynamicFormItems } = this.state;
    this.setState({
      dynamicFormItems: dynamicFormItems.filter(
        ({ lang: itemLang }) => itemLang !== lang
      )
    });
  };

  render() {
    const {
      data,
      onSubmit = () => {},
      form: { getFieldDecorator, validateFields }
    } = this.props;
    const { dynamicFormItems } = this.state;
    const formItems = dynamicFormItems.map(({ href, lang }, index) => (
      <Box key={index}>
        <Row type="flex" align="middle" justify="space-between">
          <ArticleGrid
            labelSpan={6}
            valueSpan={18}
            label="Href"
            value={
              <FieldArticle
                name={`subLinks[${index}].href`}
                value={href}
                getFieldDecorator={getFieldDecorator}
              />
            }
          />
          <ArticleGrid
            label="Lang"
            labelSpan={6}
            valueSpan={18}
            value={
              <LangSelect
                className="article-form-input"
                name={`subLinks[${index}].lang`}
                initialValue={lang}
                value={lang}
                getFieldDecorator={getFieldDecorator}
              />
            }
          />
          <Col span={6}>
            <Button type="danger" onClick={() => this.removeItem(lang)}>
              <Icon className="dynamic-delete-button" type="minus-circle-o" />
              Delete Translation
            </Button>
          </Col>
        </Row>
        <Box borderBottom="2px solid #eee" />
      </Box>
    ));
    return (
      <Form
        className="article-form"
        id="lang-form"
        onSubmit={async e => {
          e.preventDefault();
          validateFields(async (err, values) => {
            if (!err) {
              onSubmit({ ...data, ...values });
            }
          });
        }}
        hideRequiredMark={true}
      >
        {formItems}
        <Form.Item>
          <Button type="primary" onClick={this.addItem}>
            <Icon type="plus" /> Add translation
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export class ModalContent extends Component {
  state = {};

  render() {
    const { visible, closeModal, data = {}, onSubmit = () => {} } = this.props;
    return (
      <Modal
        title={`Content for article: "${data.mainTitle}"`}
        width={750}
        centered
        visible={visible}
        onCancel={closeModal}
        footer={[
          <Button key="back" onClick={closeModal}>
            Cancel
          </Button>,
          <Button
            key="submit"
            form="content-form"
            type="primary"
            htmlType="submit"
          >
            Save Changes
          </Button>
        ]}
      >
        <WrappedContentForm data={data} onSubmit={onSubmit} />
      </Modal>
    );
  }
}

class ContentForm extends Component {
  state = {
    dynamicFormItems: []
  };

  componentDidMount() {
    const {
      data: { content }
    } = this.props;

    this.setState({ dynamicFormItems: content });
  }

  addItem = direction => {
    const { dynamicFormItems } = this.state;
    this.setState({
      dynamicFormItems:
        direction === "before"
          ? [{ tag: "", tagNumber: "", value: "" }, ...dynamicFormItems]
          : [...dynamicFormItems, { tag: "", tagNumber: "", value: "" }]
    });
  };
  removeItem = tagNumber => {
    const { dynamicFormItems } = this.state;
    this.setState({
      dynamicFormItems: dynamicFormItems.filter(
        // ({ tagNumber: itemTagNumber }, key) => itemTagNumber !== tagNumber
        ({ tagNumber: itemTagNumber }, key) => key !== tagNumber
      )
    });
  };

  removeImgFromSlider = (id, key) => {
    const { dynamicFormItems } = this.state;
    this.setState({
      dynamicFormItems: dynamicFormItems.map(({ tagNumber, value, ...props }) =>
        id === tagNumber
          ? {
              tagNumber,
              value: value.filter((el, keyImg) => keyImg !== key),
              ...props
            }
          : { tagNumber, value, ...props }
      )
    });
  };

  addImgToSlider = id => {
    const { dynamicFormItems } = this.state;

    this.setState({
      dynamicFormItems: dynamicFormItems.map(({ tagNumber, value, ...props }) =>
        id === tagNumber
          ? {
              tagNumber,
              value: Array.isArray(value) ? [...value, ""] : [value],
              ...props
            }
          : { tagNumber, value, ...props }
      )
    });
  };

  render() {
    const {
      data,
      onSubmit = () => {},
      form: { getFieldDecorator, validateFields }
    } = this.props;
    const { dynamicFormItems } = this.state;

    const formItems = dynamicFormItems.map(
      ({ tag, tagNumber, value }, index) => (
        <Box key={index}>
          <Row type="flex" align="middle" justify="space-between">
            <Col span={18}>
              <ArticleGrid
                labelSpan={7}
                valueSpan={17}
                label="tagNumber"
                value={
                  <FieldArticle
                    name={`content[${index}].tagNumber`}
                    value={tagNumber}
                    getFieldDecorator={getFieldDecorator}
                  />
                }
              />
              <ArticleGrid
                labelSpan={7}
                valueSpan={17}
                label="tag"
                value={
                  <TagSelect
                    className="article-form-input"
                    name={`content[${index}].tag`}
                    initialValue={tag}
                    value={tag}
                    onChange={v =>
                      this.setState({
                        dynamicFormItems: dynamicFormItems.map(
                          ({ tagNumber: number, tag, value }) =>
                            tagNumber === number
                              ? { tag: v, tagNumber: number, value }
                              : { tagNumber: number, tag, value }
                        )
                      })
                    }
                    getFieldDecorator={getFieldDecorator}
                  />
                }
              />
              <Switch
                value={tag}
                Img={() => (
                  <>
                    <ArticleGrid
                      labelSpan={7}
                      valueSpan={17}
                      label="Img link"
                      value={
                        <FieldArticle
                          name={`content[${index}].value.src`}
                          value={value.src}
                          getFieldDecorator={getFieldDecorator}
                        />
                      }
                    />
                    <ArticleGrid
                      labelSpan={7}
                      valueSpan={17}
                      label="Img text"
                      value={
                        <FieldArticle
                          name={`content[${index}].value.text`}
                          value={value.text}
                          validateRules={[]}
                          getFieldDecorator={getFieldDecorator}
                        />
                      }
                    />
                  </>
                )}
                Slider={() => (
                  <>
                    <Box>Slider</Box>
                    {Array.isArray(value) &&
                      value.map((el, key) => (
                        <Row type="flex" align="middle" key={key}>
                          <Col span={17}>
                            <ArticleGrid
                              labelSpan={7}
                              valueSpan={17}
                              label={`IMG ${key + 1}`}
                              value={
                                <FieldArticle
                                  name={`content[${index}].value[${key}]`}
                                  value={el}
                                  getFieldDecorator={getFieldDecorator}
                                />
                              }
                            />
                          </Col>
                          <Col span={3}>
                            <img src={el} height="50px" width="auto" alt="" />
                          </Col>
                          <Col span={4}>
                            <Button
                              type="danger"
                              onClick={() =>
                                this.removeImgFromSlider(tagNumber, key)
                              }
                            >
                              Remove
                            </Button>
                          </Col>
                        </Row>
                      ))}
                    <Button
                      type="primary"
                      onClick={() => this.addImgToSlider(tagNumber)}
                    >
                      Add img to slider
                    </Button>
                  </>
                )}
                default={
                  <ArticleGrid
                    labelSpan={7}
                    valueSpan={17}
                    label="value"
                    value={
                      <FieldArticle
                        name={`content[${index}].value`}
                        value={value}
                        getFieldDecorator={getFieldDecorator}
                      />
                    }
                  />
                }
              />
            </Col>
            <Col span={5}>
              <Button type="danger" onClick={() => this.removeItem(index)}>
                <Icon className="dynamic-delete-button" type="minus-circle-o" />
                Delete Tag
              </Button>
            </Col>
          </Row>
          <Box borderBottom="2px solid #eee" />
        </Box>
      )
    );
    return (
      <Form
        className="article-form"
        id="content-form"
        onSubmit={async e => {
          e.preventDefault();
          validateFields(async (err, values) => {
            if (!err) {
              onSubmit({ ...data, ...values });
            }
          });
        }}
        hideRequiredMark={true}
      >
        <Form.Item>
          <Button type="primary" onClick={() => this.addItem("before")}>
            <Icon type="plus" /> Add content
          </Button>
        </Form.Item>
        {formItems}
        <Form.Item>
          <Button type="primary" onClick={() => this.addItem("after")}>
            <Icon type="plus" /> Add content
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export class ModalAuthors extends Component {
  state = {};

  render() {
    const {
      visible,
      closeModal,
      data = {},
      onSubmit = () => {},
      handleSave
    } = this.props;
    return (
      <Modal
        title={`Content for article: "${data.mainTitle}"`}
        width={800}
        centered
        visible={visible}
        onCancel={closeModal}
        footer={[
          <Button key="back" type="primary" onClick={closeModal}>
            Ok
          </Button>
        ]}
      >
        <AuthorsTable data={data} handleSave={handleSave} />
      </Modal>
    );
  }
}

const FieldArticle = ({
  name = "",
  value,
  getFieldDecorator,
  format,
  className = "article-form-input",
  placeholder = `Enter your  ${name.replace(/_|\./g, " ")}`,
  validateRules = [
    {
      required: true,
      message: `Please input your ${name.replace(/_|\./g, " ")}`
    }
  ],
  inputComponent: InputComponent = Input
}) => (
  <Form.Item>
    {getFieldDecorator(name, {
      // validateTrigger: "onBlur",
      initialValue: value,
      rules: validateRules
    })(
      <InputComponent
        format={format}
        className={className}
        autoComplete="kill-auto-complete"
        placeholder={placeholder}
      />
    )}
  </Form.Item>
);

const ArticleGrid = ({
  label,
  labelSpan = 7,
  valueSpan = 10,
  value,
  align = "middle",
  className = "article-grid",
  ...props
}) => (
  <Row className={className} style={props} type="flex" align={align}>
    <Col span={labelSpan}>{label}</Col>
    <Col span={valueSpan}>{value}</Col>
  </Row>
);

const WrappedArticleForm = Form.create({ name: "article" })(ArticleForm);
const WrappedLangForm = Form.create({ name: "article" })(LangForm);
const WrappedContentForm = Form.create({ name: "article" })(ContentForm);
