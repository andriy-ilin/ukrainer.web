import React, { Component } from "react";
import moment from "moment";
import { Table, Button, Input, Icon, message } from "antd";
import Highlighter from "react-highlight-words";
import Box from "../../components/Box";
import Lang from "../../components/Lang";
import schema from "../../__schema__/";
import EditableFormRow from "../../components/EditableTableComponents/EditableFormRow";
import EditableCell from "../../components/EditableTableComponents/EditableCell";

import { NewVideoModal } from "./ModalView";

class Home extends Component {
  state = {
    lang: "uk",
    data: [],
    video: [],
    hightLighter: {},
    newVideoModal: false
  };
  async componentDidMount() {
    const { lang } = this.state;
    const video = await schema.Video.get(lang);
    return this.setState({
      video: Object.values(video),
      data: Object.values(video)
    });
  }
  updateData = async () => {
    const { lang } = this.state;
    const video = await schema.Video.get(lang);
    return this.setState({
      video: Object.values(video),
      data: Object.values(video)
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
      video: filteredArticles
    });
  };

  handleDelete = async key => {
    const { lang } = this.state;
    const dataSource = [...this.state.video];
    this.setState({
      data: dataSource.filter(item => item.id !== key),
      video: dataSource.filter(item => item.id !== key)
    });
    await schema.Video.remove({
      id: key,
      lang
    });
  };

  handleAdd = async values => {
    const { video, data, lang } = this.state;
    const { id, dateAdd } = await schema.Video.setWithCreateId({
      data: values,
      lang
    });
    this.setState({
      video: [{ ...values, id, dateAdd }, ...video],
      data: [{ ...values, id, dateAdd }, ...data],
      openModalArticles: false
    });
  };

  handleSave = async row => {
    const { lang } = this.state;
    const newData = [...this.state.video];
    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row
    });
    this.setState({ video: newData });
    await schema.Video.set({
      data: row,
      id: row.id,
      lang
    });
    message.success("Video update success");
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
      record[dataIndex] &&
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
    const { video, lang, newVideoModal } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    };
    const columnsData = columns({
      handleDelete: this.handleDelete,
      filterProps: this.filterProps
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
        <h1>Video</h1>
        <Lang
          lang={this.state.lang}
          onChange={async lang => {
            await this.setState({ lang });
            await this.updateData();
          }}
        />
        <Box my={10}>
          <Button
            type="primary"
            onClick={() => this.setState({ newVideoModal: true })}
          >
            New video
          </Button>
        </Box>
        <Table
          columns={columnsData}
          dataSource={video}
          onChange={this.handleTableChange}
          components={components}
          rowClassName={() => "editable-row"}
          scroll={{ x: 1300 }}
        />

        <NewVideoModal
          visible={!!newVideoModal}
          onSubmit={data => {
            this.handleAdd(data);
            this.setState({ newVideoModal: false });
          }}
          lang={lang}
          closeModal={() => this.setState({ newVideoModal: false })}
        />
      </Box>
    );
  }
}

const columns = ({ handleDelete = () => {}, filterProps = {} }) => [
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
    sorter: true,
    width: 70,
    ...filterProps("id")
  },
  {
    title: "Href",
    dataIndex: "href",
    key: "href",
    sorter: true,
    width: 70,
    ...filterProps("href"),
    render: src => (
      <a href={src} target="_blank" rel="noopener noreferrer">
        {src}
      </a>
    )
  },
  {
    title: "idArticle",
    dataIndex: "idArticle",
    key: "idArticle",
    sorter: true,
    width: 70,
    ...filterProps("idArticle")
  },

  {
    title: "Lang",
    key: "lang",
    dataIndex: "lang"
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
    sorter: true
  },

  {
    title: "Title",
    dataIndex: "mainTitle",
    sorter: true,
    key: "mainTitle",
    ...filterProps("mainTitle")
  },
  {
    title: "Video SRC",
    dataIndex: "videoSrc",
    sorter: true,
    editable: true,
    key: "videoSrc",
    render: src => (
      <a href={src} target="_blank" rel="noopener noreferrer">
        {src}
      </a>
    )
  },
  {
    title: "Vlog SRC",
    dataIndex: "vlogSrc",
    sorter: true,
    editable: true,
    key: "vlogSrc",
    render: src => (
      <a href={src} target="_blank" rel="noopener noreferrer">
        {src}
      </a>
    )
  },
  {
    title: "Date add",
    dataIndex: "dateAdd",
    sorter: true,
    key: "dateAdd",
    width: 120,

    render: dateAdd => moment(dateAdd).format("DD-MM-YYYY")
  },
  {
    title: "Date article add",
    dataIndex: "dateArticleAdd",
    sorter: true,
    key: "dateArticleAdd",
    width: 120,
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

export default Home;
