import React, { Component } from "react";
import moment from "moment";
import ReactJson from "react-json-view";
import { Table, Button, Input, Icon, message } from "antd";
import Highlighter from "react-highlight-words";
import Box from "../../components/Box";

import schema from "../../__schema__/";
import EditableFormRow from "../../components/EditableTableComponents/EditableFormRow";
import EditableCell from "../../components/EditableTableComponents/EditableCell";

class Users extends Component {
  state = {
    data: [],
    users: [],
    hightLighter: {}
  };

  async componentDidMount() {
    const users = await schema.Users.get();
    return this.setState({
      users: Object.values(users),
      data: Object.values(users)
    });
  }

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
      users: filteredArticles
    });
  };

  handleDelete = async key => {
    const dataSource = [...this.state.users];
    this.setState({
      data: dataSource.filter(item => item.id !== key),
      users: dataSource.filter(item => item.id !== key)
    });
    await schema.Users.remove({ id: key });
    message.warning("Order delete");
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
    const { users } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    };
    const columnsData = columns({
      handleDelete: this.handleDelete,
      filterProps: this.filterProps,
      openModalArticles: id => this.setState({ openModalArticles: id })
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
        <h1>Users</h1>

        <Table
          columns={columnsData}
          dataSource={users}
          onChange={this.handleTableChange}
          components={components}
          rowClassName={() => "editable-row"}
          scroll={{ x: 1300 }}
        />
      </Box>
    );
  }
}

const columns = ({
  handleDelete = () => {},
  filterProps = {},
  openModalArticles = () => {}
}) => [
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
    sorter: true,
    width: 70,
    ...filterProps("id")
  },

  {
    title: "appName",
    key: "appName",
    dataIndex: "appName"
  },
  {
    title: "secretCode",
    key: "secretCode",
    dataIndex: "secretCode"
  },
  {
    title: "tokenDevice",
    key: "tokenDevice",
    dataIndex: "tokenDevice"
  },

  {
    title: "Date add",
    dataIndex: "dateAdd",
    key: "dateAdd",
    width: 120,
    render: dateAdd => moment(dateAdd).format("DD-MM-YYYY")
  },
  {
    title: "userPhone",
    dataIndex: "userPhone",
    sorter: true,
    key: "userPhone",
    render: data => <ReactJson src={JSON.parse(data)} collapsed />
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

export default Users;
