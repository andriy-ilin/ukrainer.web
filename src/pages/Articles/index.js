import React, { Component } from "react";
import { Link } from "@reach/router";
import moment from "moment";
import { Card, Table, Button, Input, Icon, Row } from "antd";
import Highlighter from "react-highlight-words";
import Box from "../../components/Box";
import schema from "../../__schema__/";
import EditableFormRow from "./EditableFormRow";
import EditableCell from "./EditableCell";
import ContentTable from "./ContentTable";
import {
  NewArticleModal,
  ModalLang,
  ModalContent,
  ModalAuthors
} from "./ModalView";
import useCache from "../../helpers/useCache";

import "./style.css";

class Home extends Component {
  state = {
    articles: null,
    data: [],
    newArticleModal: false,
    newContentModal: false,
    openContentAddModal: null,
    openAuthorsModal: null,
    modalLang: null,
    hightLighter: {}
  };
  async componentDidMount() {
    const articles = await useCache(schema.Articles.get, []);
    return this.setState({
      articles: Object.values(articles),
      data: Object.values(articles)
    });
  }

  handleTableChange = async (pagination, filters, sorter) => {
    const { articles, data } = this.state;
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
      articles: filteredArticles
    });
  };

  handleDelete = key => {
    const dataSource = [...this.state.articles];
    this.setState({ articles: dataSource.filter(item => item.id !== key) });
  };

  handleAdd = values => {
    const { articles, data } = this.state;
    const { href, lang } = values;
    //return {id, dateAdd}
    this.setState({
      articles: [
        {
          subLinks: [{ href, lang }],
          content: [],
          id: "",
          dateAdd: "",
          ...values
        },
        ...articles
      ],
      data: [
        { subLinks: [], content: [], id: "", dateAdd: "", ...values },
        ...data
      ],
      newArticleModal: false
    });
  };

  handleSave = row => {
    const newData = [...this.state.articles];
    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row
    });
    this.setState({ articles: newData });
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
      articles,
      modalLang,
      openContentAddModal,
      openAuthorsModal,
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
      openModalLang: id => this.setState({ modalLang: id })
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
    console.log(articles);
    return (
      <>
        <h1>Articles</h1>
        <Box my={10}>
          <Button
            type="primary"
            onClick={() => this.setState({ newArticleModal: true })}
          >
            Add Article
          </Button>
        </Box>
        <Table
          columns={columnsData}
          dataSource={articles}
          expandedRowRender={props => (
            <ContentTable
              openContentAddModal={id =>
                this.setState({ openContentAddModal: id })
              }
              openAuthorsModal={id => this.setState({ openAuthorsModal: id })}
              {...props}
            />
          )}
          onChange={this.handleTableChange}
          components={components}
          rowClassName={() => "editable-row"}
          // bordered
        />
        <NewArticleModal
          handleAdd={this.handleAdd}
          visible={this.state.newArticleModal}
          closeModal={() => this.setState({ newArticleModal: false })}
        />
        <ModalLang
          data={data.filter(({ id }) => id === modalLang)[0]}
          visible={!!this.state.modalLang}
          onSubmit={data => {
            this.handleSave(data);
            this.setState({ modalLang: null });
          }}
          closeModal={() => this.setState({ modalLang: null })}
        />
        <ModalContent
          data={data.filter(({ id }) => id === openContentAddModal)[0]}
          visible={!!openContentAddModal}
          onSubmit={data => {
            this.handleSave(data);
            this.setState({ openContentAddModal: null });
          }}
          closeModal={() => this.setState({ openContentAddModal: null })}
        />
        <ModalAuthors
          data={data.filter(({ id }) => id === openAuthorsModal)[0]}
          visible={!!openAuthorsModal}
          onSubmit={data => {
            this.handleSave(data);
            this.setState({ openAuthorsModal: null });
          }}
          closeModal={() => this.setState({ openAuthorsModal: null })}
        />
      </>
    );
  }
}

const columns = ({
  handleDelete,
  filterProps = {},
  openModalLang = () => {}
}) => [
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
    // render: id => <Link to={`articles/${id}`}>{id}</Link>,
    ...filterProps("id")
  },
  {
    title: "Title",
    dataIndex: "mainTitle",
    sorter: true,
    key: "mainTitle",
    editable: true,
    ...filterProps("mainTitle")
  },

  {
    title: "Date",
    dataIndex: "date",
    sorter: true,
    editable: true,
    key: "date",

    render: date => moment(date).format("DD-MM-YYYY")
  },
  {
    title: "Lang",
    key: "lang",
    sorter: true,
    editable: true,
    dataIndex: "lang",
    filters: [
      { text: "uk", value: "uk" },
      { text: "cz", value: "cz" },
      { text: "de", value: "de" },
      { text: "el", value: "el" },
      { text: "en", value: "en" },
      { text: "fr", value: "fr" },
      { text: "ka", value: "ka" },
      { text: "pl", value: "pl" },
      { text: "ru", value: "ru" }
    ]
  },
  {
    title: "Region",
    key: "region",
    dataIndex: "region",
    filters: [
      { value: "bessarabiya", text: "bessarabiya" },
      { value: "galychyna", text: "galychyna" },
      { value: "zakarpattya", text: "zakarpattya" },
      { value: "karpaty", text: "karpaty" },
      { value: "naddniprianshchyna", text: "naddniprianshchyna" },
      { value: "podillya", text: "podillya" },
      { value: "podniprovia-zaporizhzhia", text: "podniprovia-zaporizhzhia" },
      { value: "polissya", text: "polissya" },
      { value: "poltavshhyna", text: "poltavshhyna" },
      { value: "pryazovya", text: "pryazovya" },
      { value: "sivershchyna", text: "sivershchyna" }
    ],
    sorter: true,
    editable: true
  },
  {
    title: "Href",
    key: "href",
    dataIndex: "href",
    sorter: true,
    editable: true,
    ...filterProps("href"),
    render: href => (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {href}
      </a>
    )
  },
  {
    title: "Main bg foto",
    key: "mainBg",
    dataIndex: "mainBg",
    sorter: true,
    editable: true,
    render: value => <img src={value} height={100} width="auto" alt="" />
  },
  {
    title: "Small bg foto",
    key: "main320Bg",
    dataIndex: "main320Bg",
    sorter: true,
    editable: true,
    render: value => (
      <img
        src={`http://ukrainer.net/${value}`}
        height={100}
        width="auto"
        alt=""
      />
    )
  },
  {
    title: "Date add to DB",
    key: "dateAdd",
    dataIndex: "dateAdd",
    sorter: true,
    editable: true
  },
  {
    title: "Translation",
    key: "subLinks",
    dataIndex: "subLinks",
    render: (subLinks = [], { id, lang: articleLang }) => (
      <>
        <Row type="flex" align="center" justify="center">
          {subLinks.map(({ href, lang }) => (
            <Box
              py={3}
              width="20px"
              m={2}
              backgroundColor={articleLang === lang ? "#77d9a0" : "#eee"}
              border={`1px solid  ${
                articleLang === lang ? "#2f4b7c" : "#e8e8e8"
              }`}
              borderRadius="3px"
            >
              <a href={href} target="_blank" rel="noopener noreferrer">
                {lang}
              </a>
            </Box>
          ))}
        </Row>
        <Box mt={10}>
          <Button type="primary" onClick={() => openModalLang(id)}>
            change lang
          </Button>
        </Box>
      </>
    )
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

export default Home;
