import React from "react";
import { Row, Form, Input, Col } from "antd";

export const InputField = ({
  name = "",
  value,
  getFieldDecorator,
  format,
  className = "article-form-input",
  placeholder = `Enter your  ${name.replace(/_|\./g, " ")}`,
  validateRules = [
    {
      required: true,
      message: `Please input your ${name.replace(/_|\./g, " ")}`
    }
  ],
  inputComponent: InputComponent = Input
}) => (
  <Form.Item>
    {getFieldDecorator(name, {
      initialValue: value,
      rules: validateRules
    })(
      <InputComponent
        format={format}
        className={className}
        autoComplete="kill-auto-complete"
        placeholder={placeholder}
      />
    )}
  </Form.Item>
);

const GridField = ({
  label,
  labelSpan = 7,
  valueSpan = 10,
  value,
  align = "middle",
  className = "article-grid",
  ...props
}) => (
  <Row className={className} style={props} type="flex" align={align}>
    <Col span={labelSpan}>{label}</Col>
    <Col span={valueSpan}>{value}</Col>
  </Row>
);

export default GridField;
