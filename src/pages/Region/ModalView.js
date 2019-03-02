import React, { Component } from "react";
import { Form, Button, Modal } from "antd";
import GridField, { InputField } from "../../components/GridField";

export class NewRegionModal extends Component {
  render() {
    const { data = {}, onSubmit, visible, closeModal, lang } = this.props;
    return (
      <Modal
        title={"New Region"}
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
            form="region-form"
            type="primary"
            htmlType="submit"
          >
            Save Changes
          </Button>
        ]}
      >
        <WrappedNewRegionForm data={data} onSubmit={onSubmit} lang={lang} />
      </Modal>
    );
  }
}

class NewRegionForm extends Component {
  render() {
    const {
      data,
      lang,
      data: { region, name, about, video, img },
      onSubmit = () => {},
      form: { getFieldDecorator, validateFields }
    } = this.props;

    return (
      <Form
        className="article-form"
        id="region-form"
        onSubmit={async e => {
          e.preventDefault();
          validateFields(async (err, values) => {
            if (!err) {
              onSubmit({ lang, ...data, ...values });
            }
          });
        }}
        hideRequiredMark={true}
      >
        <GridField
          labelSpan={6}
          valueSpan={18}
          label="region"
          value={
            <InputField
              name="region"
              value={region}
              getFieldDecorator={getFieldDecorator}
            />
          }
        />
        <GridField
          label="name"
          labelSpan={6}
          valueSpan={18}
          value={
            <InputField
              name="name"
              value={name}
              getFieldDecorator={getFieldDecorator}
            />
          }
        />
        <GridField
          label="about"
          labelSpan={6}
          valueSpan={18}
          value={
            <InputField
              name="about"
              value={about}
              getFieldDecorator={getFieldDecorator}
            />
          }
        />
        <GridField
          label="img"
          labelSpan={6}
          valueSpan={18}
          value={
            <InputField
              name="img"
              value={img}
              getFieldDecorator={getFieldDecorator}
            />
          }
        />
        <GridField
          label="video"
          labelSpan={6}
          valueSpan={18}
          value={
            <InputField
              name="video"
              value={video}
              getFieldDecorator={getFieldDecorator}
            />
          }
        />
      </Form>
    );
  }
}

const WrappedNewRegionForm = Form.create({ name: "region" })(NewRegionForm);
