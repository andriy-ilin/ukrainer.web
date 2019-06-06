import React, { Component } from "react";
import { Link } from "@reach/router";
import moment from "moment";
import { Card, Form, Table, Button, Input, Icon, Row, message } from "antd";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Highlighter from "react-highlight-words";
import Box from "../../components/Box";
import LangSelect from "../../components/LangSelect";
import schema from "../../__schema__/";
import EditableFormRow from "../../components/EditableTableComponents/EditableFormRow";
import EditableCell from "../../components/EditableTableComponents/EditableCell";

import { NewVideoModal } from "./ModalView";

import "./style.css";

class Home extends Component {
  state = {
    lang: "uk",
    data: [],
    catalog: [],
    hightLighter: {},
    openModalArticles: null,
    openModalLang: null,
    newVideoModal: false
  };
  async componentDidMount() {
    const { lang } = this.state;
    const catalog = await schema.CatalogShopItems.get(lang);
    return this.setState({
      catalog: Object.values(catalog),
      data: Object.values(catalog)
    });
  }
  updateData = async () => {
    const { lang } = this.state;
    const catalog = await schema.CatalogShopItems.get(lang);
    return this.setState({
      catalog: Object.values(catalog),
      data: Object.values(catalog)
    });
  };

  handleTableChange = async (pagination, filters, sorter) => {
    const { data } = this.state;
    const { field, order } = sorter;
    const articlesSort = data.sort(
      ({ [field]: first }, { [field]: second }) => {
        if (order === "descend") {
          if (first > second) {
            return 1;
          }
          if (first < second) {
            return -1;
          }
          return 0;
        } else {
          if (first < second) {
            return 1;
          }
          if (first > second) {
            return -1;
          }
          return 0;
        }
      }
    );

    const fiteringList = (data, filters) =>
      data.filter(item =>
        Object.entries(filters).every(
          ([key, value]) =>
            !value.length ||
            (value.length === 1
              ? item[key].includes(value[0])
              : value.includes(item[key]))
        )
      );
    this.setState({
      hightLighter: Object.entries(filters).reduce(
        (prev, [key, value]) =>
          value.length === 1 && { ...prev, [key]: value[0] },
        {}
      )
    });

    const filteredArticles = fiteringList(articlesSort, filters);

    this.setState({
      catalog: filteredArticles
    });
  };

  handleDelete = key => {
    const dataSource = [...this.state.catalog];
    this.setState({ data: dataSource.filter(item => item.id !== key) });
    this.setState({ catalog: dataSource.filter(item => item.id !== key) });
  };

  handleAdd = values => {
    const { catalog, data } = this.state;
    this.setState({
      catalog: [{ ...values }, ...catalog],
      data: [{ ...values }, ...catalog],
      openModalArticles: false
    });
  };

  handleSave = row => {
    const newData = [...this.state.catalog];
    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row
    });
    console.log("row", row);
    this.setState({ catalog: newData });
    //update article
  };

  filterProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={confirm}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={confirm}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text, ...props) => (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[this.state.hightLighter[dataIndex]]}
        autoEscape
        textToHighlight={text && text.toString()}
      />
    )
  });

  render() {
    const {
      catalog,
      lang,
      openModalArticles,
      newVideoModal,
      data
    } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    };
    const columnsData = columns({
      handleDelete: this.handleDelete,
      filterProps: this.filterProps,
      openModalLang: id => this.setState({ openModalLang: id })
    }).map(col => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave
        })
      };
    });

    return (
      <Box>
        <h1>Catalog shop item</h1>
        <Row type="flex">
          <Box>Lang</Box>
          <WrappedLangForm
            initialValue={this.state.lang}
            value={this.state.lang}
            onChange={async lang => {
              await this.setState({ lang });
              await this.updateData();
            }}
          />
        </Row>
        <Box my={10}>
          <Button
            type="primary"
            onClick={() => this.setState({ newVideoModal: true })}
          >
            New catalog
          </Button>
        </Box>
        <Table
          columns={columnsData}
          dataSource={catalog}
          onChange={this.handleTableChange}
          components={components}
          rowClassName={() => "editable-row"}
          scroll={{ x: 1300 }}
        />

        <NewVideoModal
          visible={!!newVideoModal}
          onSubmit={data => {
            console.log("data", data);
            this.handleSave(data);
            this.setState({ newVideoModal: false });
          }}
          lang={lang}
          closeModal={() => this.setState({ newVideoModal: false })}
        />
      </Box>
    );
  }
}

// dataAdd
// href
// id
// img
// lang
// priceArr
// newPrice
// oldPrice
// title

const columns = ({
  handleDelete = () => {},
  filterProps = {},
  openModalLang = () => {}
}) => [
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
    sorter: true,
    width: 70,
    ...filterProps("id"),
    render: id => (
      <CopyToClipboard
        text={id}
        onCopy={() => message.success("Address copied!")}
      >
        <span>{id}</span>
      </CopyToClipboard>
    )
  },
  {
    title: "title",
    dataIndex: "title",
    key: "title",
    sorter: true,
    width: 170,
    ...filterProps("title")
  },
  {
    title: "Href",
    dataIndex: "href",
    key: "href",
    sorter: true,
    width: 70,
    editable: true,
    render: src => (
      <a href={src} target="_blank" rel="noopener noreferrer">
        {src}
      </a>
    )
  },
  {
    title: "img",
    dataIndex: "img",
    key: "img",
    sorter: true,
    width: 70,
    editable: true,

    render: src => <img src={src} alt={src} height="100" width="auto" />
  },

  {
    title: "New Price",
    dataIndex: "priceArr.newPrice",
    key: "priceArr.newPrice",
    sorter: true,
    editable: true
  },
  {
    title: "Lang",
    dataIndex: "lang",
    key: "lang",
    editable: true
  },
  {
    title: "Date add",
    dataIndex: "dateAdd",
    sorter: true,
    key: "dateAdd",
    width: 120,
    editable: true,
    render: dateAdd => moment(dateAdd).format("DD-MM-YYYY")
  },
  {
    title: "Actions",
    key: "actions",
    dataIndex: "actions",
    delete: true,
    render: (actions, { id }) => (
      <Button type="danger" size="small" onClick={() => handleDelete(id)}>
        Delete
      </Button>
    )
  }
];

const LangForm = ({ form: { getFieldDecorator }, ...props }) => (
  <LangSelect getFieldDecorator={getFieldDecorator} {...props} />
);
const WrappedLangForm = Form.create({ name: "person" })(LangForm);
export default Home;
