import React, { Component } from "react";
import { Row, Col, Form, Icon, Button, Modal } from "antd";
import Box from "../../components/Box";
import GridField, { InputField } from "../../components/GridField";

export const ModalDictionary = ({
  data = {},
  onSubmit,
  visible,
  closeModal,
  listName
}) => (
  <Modal
    title={`${listName}: list`}
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
        form="dictionary-form"
        type="primary"
        htmlType="submit"
      >
        Save Changes
      </Button>
    ]}
  >
    <WrappedDictionaryForm
      data={data}
      onSubmit={onSubmit}
      listName={listName}
    />
  </Modal>
);

class DictionaryForm extends Component {
  state = {
    dynamicFormItems: []
  };

  componentDidMount() {
    const { data } = this.props;
    this.setState({ dynamicFormItems: data });
  }

  componentDidUpdate({ data: prevDictionary }) {
    const { data: nextDictionary } = this.props;
    if (nextDictionary !== prevDictionary) {
      this.setState({ dynamicFormItems: nextDictionary });
    }
  }

  addItem = () => {
    const { dynamicFormItems } = this.state;
    this.setState({
      dynamicFormItems: ["", ...dynamicFormItems]
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
      listName,
      onSubmit = () => {},
      form: { getFieldDecorator, validateFields }
    } = this.props;
    const { dynamicFormItems = [] } = this.state;
    const formItems = dynamicFormItems.map((el, index) => (
      <Box key={index}>
        <Row type="flex" align="middle">
          <Col span={18}>
            <GridField
              labelSpan={6}
              valueSpan={18}
              label={`${index + 1}.`}
              value={
                <InputField
                  name={`${listName}[${index}]`}
                  value={el}
                  getFieldDecorator={getFieldDecorator}
                />
              }
            />
          </Col>

          <Button type="danger" onClick={() => this.removeItem(index)}>
            <Icon className="dynamic-delete-button" type="minus-circle-o" />
            Delete
          </Button>
        </Row>
        <Box borderBottom="2px solid #eee" />
      </Box>
    ));
    return (
      <Form
        className="article-form"
        id="dictionary-form"
        onSubmit={async e => {
          e.preventDefault();
          validateFields(async (err, values) => {
            if (!err) {
              onSubmit(values);
            }
          });
        }}
        hideRequiredMark={true}
      >
        <Form.Item>
          <Button type="primary" onClick={this.addItem}>
            <Icon type="plus" /> Add
          </Button>
        </Form.Item>
        {formItems}
      </Form>
    );
  }
}

const WrappedDictionaryForm = Form.create({ name: "dictionary" })(
  DictionaryForm
);
