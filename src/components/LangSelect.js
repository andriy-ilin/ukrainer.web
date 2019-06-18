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
      value: "українська"
    },
    { key: "cz", value: "česky" },
    { key: "de", value: "deutsch" },
    { key: "el", value: "ελληνικά" },
    { key: "en", value: "english" },
    { key: "fr", value: "francais" },
    { key: "ka", value: "ქართული" },
    { key: "pl", value: "polski" },
    { key: "ru", value: "русский" }
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
              {key && key.toUpperCase()} - {value}
            </Select.Option>
          ))}
        </Select>
      )}
    </Form.Item>
  );
};

export default LangSelect;
