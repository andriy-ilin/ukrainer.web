import React, { Component } from "react";
import { Form, Button, Modal } from "antd";
import GridField, { InputField } from "../../components/GridField";
import CatalogArticlesSelect from "../../components/CatalogArticlesSelect";

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
      lang,
      data: { article, videoSrc, vlogSrc },
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
              const { id, href, mainTitle, region, lang, date } = JSON.parse(
                article
              );
              onSubmit({
                ...data,
                ...values,
                idArticle: id,
                dateArticleAdd: date,
                href,
                mainTitle,
                region,
                lang
              });
            }
          });
        }}
        hideRequiredMark={true}
      >
        <GridField
          labelSpan={6}
          valueSpan={18}
          label="article"
          value={
            <CatalogArticlesSelect
              lang={lang}
              name="article"
              value={article}
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
