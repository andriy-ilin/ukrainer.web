import React from "react";
import { Form, Select } from "antd";

const RegionSelect = ({
  children,
  className,
  hideRequiredMark = true,
  getFieldDecorator = () => {},
  label = null,
  name = "region",
  value,
  validateRules = [{ required: true, message: `Please select your ${name}` }],
  ...props
}) => {
  const regions = [
    { name: "bessarabiya" },
    { name: "galychyna" },
    { name: "zakarpattya" },
    { name: "karpaty" },
    { name: "naddniprianshchyna" },
    { name: "podillya" },
    { name: "podniprovia-zaporizhzhia" },
    { name: "polissya" },
    { name: "poltavshhyna" },
    { name: "pryazovya" },
    { name: "sivershchyna" }
  ];
  return (
    <Form.Item label={label} hideRequiredMark>
      {getFieldDecorator(name, {
        rules: validateRules,
        initialValue: value
      })(
        <Select placeholder={`Please select a ${name}`} className={className}>
          {regions.map(({ name }) => (
            <Select.Option key={name} value={name}>
              {name}
            </Select.Option>
          ))}
        </Select>
      )}
    </Form.Item>
  );
};

export default RegionSelect;
