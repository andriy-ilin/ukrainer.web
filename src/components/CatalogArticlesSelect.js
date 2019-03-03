import React from "react";
import { Form, Select } from "antd";
import schema from "../__schema__/";
import useCache from "../helpers/useCache";

class CatalogArticlesSelect extends React.Component {
  state = { articles: [] };
  async componentDidMount() {
    const { lang = "uk" } = this.props;
    const articles = await useCache(schema.CatalogArticles.get, [lang]);
    this.setState({ articles: Object.values(articles) });
  }
  render() {
    const {
      children,
      className,
      hideRequiredMark = true,
      getFieldDecorator = () => {},
      label = null,
      name = "article",
      value,
      lang,
      validateRules = [
        { required: true, message: `Please select your ${name}` }
      ],
      ...props
    } = this.props;
    const { articles } = this.state;
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
              children
                .join("")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {articles.map(({ id, mainTitle, region, lang, date, href }) => (
              <Select.Option
                key={id}
                value={JSON.stringify({
                  id,
                  mainTitle,
                  region,
                  lang,
                  date,
                  href
                })}
              >
                {mainTitle} --- id = {id}
              </Select.Option>
            ))}
          </Select>
        )}
      </Form.Item>
    );
  }
}

export default CatalogArticlesSelect;
