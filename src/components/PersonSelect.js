import React from "react";
import { Form, Select } from "antd";
import schema from "../__schema__/";
import useCache from "../helpers/useCache";

class PersonSelect extends React.Component {
  state = { persons: [] };
  async componentDidMount() {
    const { lang = "uk" } = this.props;
    const persons = await useCache(schema.Role.get, [lang]);
    this.setState({ persons: Object.values(persons) });
  }
  render() {
    const {
      children,
      className,
      hideRequiredMark = true,
      getFieldDecorator = () => {},
      label = null,
      name = "persons",
      value,
      lang,
      validateRules = [
        { required: true, message: `Please select your ${name}` }
      ],
      ...props
    } = this.props;
    const { persons } = this.state;
    return (
      <Form.Item label={label} hideRequiredMark={hideRequiredMark}>
        {getFieldDecorator(name, {
          rules: validateRules,
          initialValue: value
        })(
          <Select
            placeholder={`Please select a ${name}`}
            className={className}
            showSearch
            optionFilterProp="children"
            filterOption={(input, { props: { children } }) =>
              children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {persons.map(({ name }, key) => (
              <Select.Option key={key} value={name}>
                {name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Form.Item>
    );
  }
}

export default PersonSelect;
