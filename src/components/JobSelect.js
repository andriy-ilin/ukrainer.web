import React from "react";
import { Form, Select } from "antd";
import schema from "../__schema__/";
import useCache from "../helpers/useCache";

class JobSelect extends React.Component {
  state = { job: [] };
  async componentDidMount() {
    const { lang = "uk" } = this.props;
    const { job } = await useCache(schema.Dictionary.get, [lang]);
    this.setState({ job });
  }
  render() {
    const {
      children,
      className,
      hideRequiredMark = true,
      getFieldDecorator = () => {},
      label = null,
      name = "job",
      value,
      lang,
      validateRules = [
        { required: true, message: `Please select your ${name}` }
      ],
      ...props
    } = this.props;
    const { job } = this.state;
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
            {job.map((el, key) => (
              <Select.Option key={key} value={el}>
                {el}
              </Select.Option>
            ))}
          </Select>
        )}
      </Form.Item>
    );
  }
}

export default JobSelect;
