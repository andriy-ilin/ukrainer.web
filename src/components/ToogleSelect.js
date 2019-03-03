import React from "react";
import { Form, Select } from "antd";

const ToogleSelect = ({
  children,
  className,
  hideRequiredMark = true,
  getFieldDecorator = () => {},
  label = null,
  name = "toogle",
  value,
  onChange = () => {},
  validateRules = [{ required: true, message: `Please select your ${name}` }],
  ...props
}) => {
  const toogleList = [{ name: "true" }, { name: "false" }];
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
          {toogleList.map(({ name }) => (
            <Select.Option key={name} value={name}>
              {name}
            </Select.Option>
          ))}
        </Select>
      )}
    </Form.Item>
  );
};

export default ToogleSelect;
