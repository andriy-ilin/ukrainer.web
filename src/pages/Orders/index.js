import React, { Component } from "react";
import moment from "moment";
import ReactJson from "react-json-view";

import { Table, Button, Input, Icon, message } from "antd";
import Highlighter from "react-highlight-words";
import Box from "../../components/Box";

import schema from "../../__schema__/";
import EditableFormRow from "../../components/EditableTableComponents/EditableFormRow";
import EditableCell from "../../components/EditableTableComponents/EditableCell";

class Orders extends Component {
  state = {
    data: [],
    orders: [],
    hightLighter: {}
  };
  async componentDidMount() {
    const orders = await schema.Orders.get();
    return this.setState({
      orders: Object.values(orders),
      data: Object.values(orders)
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
      orders: filteredArticles
    });
  };

  handleDelete = async key => {
    const dataSource = [...this.state.orders];
    this.setState({
      data: dataSource.filter(item => item.id !== key),
      orders: dataSource.filter(item => item.id !== key)
    });
    await schema.Orders.remove({ id: key });
    message.warning("Order delete");
  };

  handleSave = async row => {
    const newData = [...this.state.orders];
    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row
    });
    await schema.Orders.set({ data: row, id: row.id });
    await this.setState({ orders: newData });
    message.success("Success update order");
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
    const { orders } = this.state;
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
        <h1>Orders</h1>

        <Table
          columns={columnsData}
          dataSource={orders}
          onChange={this.handleTableChange}
          components={components}
          rowClassName={() => "editable-row"}
          scroll={{ x: 1300 }}
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
    title: "name",
    key: "name",
    dataIndex: "name",
    sorter: true,
    width: 70,
    ...filterProps("name")
  },
  {
    title: "phone",
    key: "phone",
    dataIndex: "phone",
    sorter: true,
    width: 70,
    ...filterProps("phone")
  },
  {
    title: "email",
    key: "email",
    dataIndex: "email",
    sorter: true,
    width: 70,
    ...filterProps("email")
  },
  {
    title: "address",
    key: "address",
    dataIndex: "address",
    sorter: true,
    width: 70,
    editable: true
  },
  {
    title: "Admin message",
    key: "message",
    dataIndex: "message",
    sorter: true,
    width: 70,
    editable: true
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    sorter: true,
    width: 70,
    editable: true,
    filters: [
      { value: "new", text: "new" },
      { value: "in_process", text: "in_process" },
      { value: "cancel", text: "cancel" },
      { value: "done", text: "done" }
    ]
  },
  {
    title: "Date add",
    dataIndex: "dateAdd",
    key: "dateAdd",
    width: 120,
    render: dateAdd => moment(dateAdd).format("DD-MM-YYYY")
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    sorter: true
  },
  {
    title: "product",
    dataIndex: "product",
    key: "product",
    render: data => <ReactJson src={data} collapsed />
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

export default Orders;
