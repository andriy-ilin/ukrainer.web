import React from "react";
import { Form, Select } from "antd";

const TagSelect = ({
  children,
  className,
  hideRequiredMark = true,
  getFieldDecorator = () => {},
  label = null,
  name = "tag",
  value,
  onChange = () => {},
  validateRules = [{ required: true, message: `Please select your ${name}` }],
  ...props
}) => {
  const tagList = [
    { name: "Text" },
    { name: "SubTitle" },
    { name: "Blockquote" },
    { name: "Img" },
    { name: "Slider" },
    { name: "Authors" },
    { name: "Video" },
    { name: "OtherFrame" },
    { name: "Fact" }
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
          {tagList.map(({ name }) => (
            <Select.Option key={name} value={name}>
              {name}
            </Select.Option>
          ))}
        </Select>
      )}
    </Form.Item>
  );
};

export default TagSelect;
