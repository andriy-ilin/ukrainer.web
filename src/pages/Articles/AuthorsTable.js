import React, { Component } from "react";
import { Card, Table, Button } from "antd";
import Box from "../../components/Box";
import Switch from "../../components/Switch";

import EditableFormRow from "./EditableFormRow";
import EditableCell from "./EditableCell";

export default class AuthorsTable extends Component {
  state = { authors: [] };
  componentDidMount() {
    const {
      data: { content }
    } = this.props;
    console.log("AuthorsTables  ", "props", this.props);
    this.setState({
      authors: content.filter(({ tag }) => tag === "Authors")[0].value
    });
  }

  componentDidUpdate({ data: { content: prevContent } }) {
    const {
      data: { content: nextContent }
    } = this.props;
    if (nextContent !== prevContent) {
      this.setState({
        authors:
          nextContent &&
          nextContent.filter(({ tag }) => tag === "Authors")[0].value
      });
    }
  }
  addAuthor = () => {
    const { authors } = this.state;
    this.setState({ authors: [{ link: "", name: "", job: "" }, ...authors] });
  };

  handleTableChange = async (pagination, filters, sorter) => {
    const { authors } = this.state;
    const { field, order } = sorter;
    const authorsSort = authors.sort(
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

    this.setState({
      authors: authorsSort
    });
  };

  handleDelete = key => {
    const dataSource = [...this.state.authors];
    this.setState({
      authors: dataSource.filter(item => item.name !== key)
    });
  };

  handleSave = row => {
    const { handleSave, data } = this.props;
    const newData = [...this.state.authors];
    const index = newData.findIndex(item => row.tagNumber === item.tagNumber);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row
    });
    this.setState({ authors: newData });
    handleSave({
      ...data,
      content: data.content.map(({ tag, ...props }) =>
        tag === "Authors"
          ? { tag, ...props, value: newData }
          : { tag, ...props }
      )
    });
  };

  render() {
    const { id, openContentAddModal, openAuthorsModal } = this.props;
    const { authors } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    };
    const columnsData = columns({ handleDelete: this.handleDelete }).map(
      col => {
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
      }
    );

    return (
      <>
        <Button type="primary" onClick={this.addAuthor}>
          Add authors
        </Button>

        <Table
          // style={{ maxWidth: 700 }}
          columns={columnsData}
          dataSource={authors}
          onChange={this.handleTableChange}
          components={components}
          rowClassName={() => "editable-row"}
          bordered
        />
      </>
    );
  }
}

const columns = ({ handleDelete }) => [
  {
    title: "Job",
    dataIndex: "job",
    key: "job",
    sorter: true,
    editable: true
  },
  {
    title: "Link",
    dataIndex: "link",
    key: "link",
    sorter: true,
    editable: true
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    sorter: true,
    editable: true
  },

  {
    title: "Actions",
    dataIndex: "actions",
    key: "actions",
    width: 150,

    render: (actions, { name }) => (
      <Button type="danger" size="small" onClick={() => handleDelete(name)}>
        Delete
      </Button>
    )
  }
];

const Author = () => <Box />;
