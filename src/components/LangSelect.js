import React from "react";
import { Form, Select } from "antd";

const LangSelect = ({
  children,
  className,
  hideRequiredMark = true,
  getFieldDecorator = () => {},
  onChange = () => {},
  label = null,
  name = "lang",
  value,
  validateRules = [{ required: true, message: `Please select your ${name}` }],
  ...props
}) => {
  const lang = [
    {
      key: "uk",
      value: "Українська"
    },
    { key: "cz", value: "" },
    { key: "de", value: "" },
    { key: "el", value: "" },
    { key: "en", value: "" },
    { key: "fr", value: "" },
    { key: "ka", value: "" },
    { key: "pl", value: "" },
    { key: "ru", value: "" }
  ];
  return (
    <Form.Item label={label} hideRequiredMark>
      {getFieldDecorator(name, {
        rules: validateRules,
        initialValue: value
      })(
        <Select
          placeholder={`Please select a ${name}`}
          className={className}
          onChange={onChange}
        >
          {lang.map(({ key, value }) => (
            <Select.Option key={key} value={key}>
              {key} {value}
            </Select.Option>
          ))}
        </Select>
      )}
    </Form.Item>
  );
};

export default LangSelect;
