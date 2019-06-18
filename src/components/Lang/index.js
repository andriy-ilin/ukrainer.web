import React from "react";
import { Row, Form } from "antd";
import Box from "../Box";
import LangSelect from "../LangSelect";
import "./style.css";

const Lang = ({ lang, onChange }) => (
  <Row type="flex" className="lang">
    <Box m={10}>
      <h3 className="lang__title">{lang}</h3>
    </Box>
    <Box m={10}>Choose languages</Box>
    <WrappedLangForm
      initialValue={lang}
      value={lang}
      onChange={lang => onChange(lang)}
    />
  </Row>
);

const LangForm = ({ form: { getFieldDecorator }, ...props }) => (
  <LangSelect getFieldDecorator={getFieldDecorator} {...props} />
);
const WrappedLangForm = Form.create({ name: "lang" })(LangForm);

export default Lang;
