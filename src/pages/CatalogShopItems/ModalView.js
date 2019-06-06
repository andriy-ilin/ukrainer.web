import React, { Component } from "react";
import { Card, Table, Row, Col, Form, Icon, Button, Modal } from "antd";
import Box from "../../components/Box";
import GridField, { InputField } from "../../components/GridField";

export class NewVideoModal extends Component {
  render() {
    const { data = {}, onSubmit, visible, closeModal } = this.props;
    return (
      <Modal
        title={"New Video"}
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
            form="video-form"
            type="primary"
            htmlType="submit"
          >
            Save Changes
          </Button>
        ]}
      >
        <WrappedNewVideoForm data={data} onSubmit={onSubmit} />
      </Modal>
    );
  }
}

class NewVideoForm extends Component {
  render() {
    const {
      data,
      data: { idArticle, videoSrc, vlogSrc },
      onSubmit = () => {},
      form: { getFieldDecorator, validateFields }
    } = this.props;

    return (
      <Form
        className="article-form"
        id="video-form"
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
          label="idArticle"
          value={
            <InputField
              name="idArticle"
              value={idArticle}
              getFieldDecorator={getFieldDecorator}
            />
          }
        />
        <GridField
          label="videoSrc"
          labelSpan={6}
          valueSpan={18}
          value={
            <InputField
              name="videoSrc"
              value={videoSrc}
              getFieldDecorator={getFieldDecorator}
            />
          }
        />
        <GridField
          label="vlogSrc"
          labelSpan={6}
          valueSpan={18}
          value={
            <InputField
              name="vlogSrc"
              value={vlogSrc}
              getFieldDecorator={getFieldDecorator}
            />
          }
        />
      </Form>
    );
  }
}

const WrappedNewVideoForm = Form.create({ name: "video" })(NewVideoForm);
