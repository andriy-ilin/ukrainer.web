import React, { Component } from "react";
import { Form, Button, Modal } from "antd";
import GridField, { InputField } from "../../components/GridField";
import RegionSelect from "../../components/RegionSelect";
import CatalogArticlesSelect from "../../components/CatalogArticlesSelect";
import ToogleSelect from "../../components/ToogleSelect";

export class NewVideoModal extends Component {
  render() {
    const { data = {}, onSubmit, visible, closeModal, lang } = this.props;
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
        <WrappedNewVideoForm data={data} onSubmit={onSubmit} lang={lang} />
      </Modal>
    );
  }
}

class NewVideoForm extends Component {
  render() {
    const {
      data,
      data: {
        title,
        description,
        image,
        video,
        latitude,
        longitude,
        region,
        article,
        mapUrl,
        isActive
      },
      lang,
      onSubmit = () => {},
      form: { getFieldDecorator, validateFields }
    } = this.props;

    return (
      <Form
        className="article-form"
        id="video-form"
        onSubmit={async e => {
          e.preventDefault();
          validateFields(async (err, { article, ...values }) => {
            if (!err) {
              const { id } = JSON.parse(article);
              onSubmit({ ...data, ...values, articleId: id });
            }
          });
        }}
        hideRequiredMark={true}
      >
        <GridField
          label="title"
          labelSpan={6}
          valueSpan={18}
          value={
            <InputField
              name="title"
              value={title}
              getFieldDecorator={getFieldDecorator}
            />
          }
        />
        <GridField
          label="description"
          labelSpan={6}
          valueSpan={18}
          value={
            <InputField
              name="description"
              value={description}
              getFieldDecorator={getFieldDecorator}
            />
          }
        />
        <GridField
          label="image"
          labelSpan={6}
          valueSpan={18}
          value={
            <InputField
              name="image"
              value={image}
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
        <GridField
          label="latitude"
          labelSpan={6}
          valueSpan={18}
          value={
            <InputField
              name="latitude"
              value={latitude}
              getFieldDecorator={getFieldDecorator}
            />
          }
        />
        <GridField
          label="longitude"
          labelSpan={6}
          valueSpan={18}
          value={
            <InputField
              name="longitude"
              value={longitude}
              getFieldDecorator={getFieldDecorator}
            />
          }
        />
        <GridField
          label="region"
          labelSpan={6}
          valueSpan={18}
          value={
            <RegionSelect
              className="article-form-input"
              initialValue={region}
              value={region}
              getFieldDecorator={getFieldDecorator}
            />
          }
        />
        <GridField
          label="article"
          labelSpan={6}
          valueSpan={18}
          value={
            <CatalogArticlesSelect
              lang={lang}
              validateRules={[]}
              className="article-form-input"
              initialValue={article}
              value={article}
              getFieldDecorator={getFieldDecorator}
            />
          }
        />
        <GridField
          label="mapUrl"
          labelSpan={6}
          valueSpan={18}
          value={
            <InputField
              name="mapUrl"
              value={mapUrl}
              getFieldDecorator={getFieldDecorator}
            />
          }
        />
        <GridField
          label="isActive"
          labelSpan={6}
          valueSpan={18}
          value={
            <ToogleSelect
              className="article-form-input"
              name="isActive"
              value={isActive}
              initialValue={isActive}
              getFieldDecorator={getFieldDecorator}
            />
          }
        />
      </Form>
    );
  }
}

const WrappedNewVideoForm = Form.create({ name: "video" })(NewVideoForm);
