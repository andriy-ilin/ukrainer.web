import React, { Component } from "react";
import { Row, Col, Form, Icon, Button, Modal } from "antd";
import Box from "../../components/Box";
import GridField, { InputField } from "../../components/GridField";

export class ModalArticles extends Component {
  state = { authors: [] };
  componentDidMount() {}

  render() {
    const { data = {}, onSubmit, visible, closeModal } = this.props;
    return (
      <Modal
        title={`${data.name}: add job and link`}
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
            form="team-form"
            type="primary"
            htmlType="submit"
          >
            Save Changes
          </Button>
        ]}
      >
        <WrappedArticleForm data={data} onSubmit={onSubmit} />
      </Modal>
    );
  }
}

class ArticlesForm extends Component {
  state = {
    dynamicFormItems: []
  };

  componentDidMount() {
    const {
      data: { articles }
    } = this.props;
    this.setState({ dynamicFormItems: articles });
  }

  componentDidUpdate({ data: { articles: prevArticles } }) {
    const {
      data: { articles: nextArticles }
    } = this.props;
    if (nextArticles !== prevArticles) {
      this.setState({ dynamicFormItems: nextArticles });
    }
  }

  addItem = () => {
    const { dynamicFormItems } = this.state;
    this.setState({
      dynamicFormItems: [...dynamicFormItems, { href: "", job: "" }]
    });
  };
  removeItem = index => {
    const { dynamicFormItems } = this.state;
    this.setState({
      dynamicFormItems: dynamicFormItems.filter((item, key) => key !== index)
    });
  };

  render() {
    const {
      data,
      onSubmit = () => {},
      form: { getFieldDecorator, validateFields }
    } = this.props;
    const { dynamicFormItems = [] } = this.state;
    const formItems = dynamicFormItems.map(({ href, job }, index) => (
      <Box key={index}>
        <Row type="flex" align="middle">
          <Col span={18}>
            <GridField
              labelSpan={6}
              valueSpan={18}
              label="Href"
              value={
                <InputField
                  name={`articles[${index}].href`}
                  value={href}
                  getFieldDecorator={getFieldDecorator}
                />
              }
            />
            <GridField
              label="Job"
              labelSpan={6}
              valueSpan={18}
              value={
                <InputField
                  name={`articles[${index}].job`}
                  value={job}
                  getFieldDecorator={getFieldDecorator}
                />
              }
            />
          </Col>

          <Button type="danger" onClick={() => this.removeItem(index)}>
            <Icon className="dynamic-delete-button" type="minus-circle-o" />
            Delete Job
          </Button>
        </Row>
        <Box borderBottom="2px solid #eee" />
      </Box>
    ));
    return (
      <Form
        className="article-form"
        id="team-form"
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
            <Icon type="plus" /> Add Job
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export class ModalPerson extends Component {
  render() {
    const { data = {}, onSubmit, visible, closeModal } = this.props;
    return (
      <Modal
        title={`${data.name || "New person"}: add job and link`}
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
            form="person-form"
            type="primary"
            htmlType="submit"
          >
            Save Changes
          </Button>
        ]}
      >
        <WrappedNewPersonForm data={data} onSubmit={onSubmit} />
      </Modal>
    );
  }
}

class NewPersonForm extends Component {
  state = {
    dynamicFormItems: [{ href: "", job: "" }]
  };

  addItem = () => {
    const { dynamicFormItems } = this.state;
    this.setState({
      dynamicFormItems: [...dynamicFormItems, { href: "", job: "" }]
    });
  };
  removeItem = index => {
    const { dynamicFormItems } = this.state;
    this.setState({
      dynamicFormItems: dynamicFormItems.filter((item, key) => key !== index)
    });
  };

  render() {
    const {
      data,
      data: { name, link, photo },
      onSubmit = () => {},
      form: { getFieldDecorator, validateFields }
    } = this.props;
    const { dynamicFormItems = [] } = this.state;
    const formItems = dynamicFormItems.map(({ href, job }, index) => (
      <Box key={index}>
        <Row type="flex" align="middle">
          <Col span={18}>
            <GridField
              labelSpan={6}
              valueSpan={18}
              label="Href"
              value={
                <InputField
                  name={`articles[${index}].href`}
                  value={href}
                  getFieldDecorator={getFieldDecorator}
                />
              }
            />
            <GridField
              label="Job"
              labelSpan={6}
              valueSpan={18}
              value={
                <InputField
                  name={`articles[${index}].job`}
                  value={job}
                  getFieldDecorator={getFieldDecorator}
                />
              }
            />
          </Col>

          <Button type="danger" onClick={() => this.removeItem(index)}>
            <Icon className="dynamic-delete-button" type="minus-circle-o" />
            Delete Job
          </Button>
        </Row>
        <Box borderBottom="2px solid #eee" />
      </Box>
    ));
    return (
      <Form
        className="article-form"
        id="person-form"
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
        <GridField
          labelSpan={6}
          valueSpan={18}
          label="name"
          value={
            <InputField
              name="name"
              value={name}
              getFieldDecorator={getFieldDecorator}
            />
          }
        />
        <GridField
          label="link"
          labelSpan={6}
          valueSpan={18}
          value={
            <InputField
              name="link"
              value={link}
              getFieldDecorator={getFieldDecorator}
            />
          }
        />
        <GridField
          label="photo"
          labelSpan={6}
          valueSpan={18}
          value={
            <InputField
              name="photo"
              value={photo}
              getFieldDecorator={getFieldDecorator}
            />
          }
        />

        {formItems}
        <Form.Item>
          <Button type="primary" onClick={this.addItem}>
            <Icon type="plus" /> Add Job
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedArticleForm = Form.create({ name: "article" })(ArticlesForm);
const WrappedNewPersonForm = Form.create({ name: "person" })(NewPersonForm);
