import React, { Component } from "react";
import { Card, Table, Row, Button } from "antd";
import Box from "../../components/Box";
import Switch from "../../components/Switch";

import EditableFormRow from "./EditableFormRow";
import EditableCell from "./EditableCell";

export default class ContentTable extends Component {
  state = { content: null };
  componentDidMount() {
    const { content } = this.props;
    this.setState({ content });
  }

  componentDidUpdate({ content: prevContent }) {
    const { content: nextContent } = this.props;
    if (nextContent !== prevContent) {
      this.setState({ content: nextContent });
    }
  }

  handleTableChange = async (pagination, filters, sorter) => {
    const { content } = this.state;
    const { field, order } = sorter;
    const contentSort = content.sort(
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
      content: contentSort
    });
  };

  handleDelete = key => {
    const dataSource = [...this.state.content];
    this.setState({
      content: dataSource.filter(item => item.tagNumber !== key)
    });
  };

  handleSave = row => {
    console.log(row);
    const newData = [...this.state.content];
    const index = newData.findIndex(item => row.tagNumber === item.tagNumber);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row
    });
    this.setState({ content: newData });
  };

  render() {
    const { id, openContentAddModal, openAuthorsModal } = this.props;
    const { content } = this.state;
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
      <Card>
        <Row type="flex">
          <Box my={10} mr={10}>
            <Button type="primary" onClick={() => openContentAddModal(id)}>
              Add content
            </Button>
          </Box>
          <Box my={10} mr={10}>
            <Button type="primary" onClick={() => openAuthorsModal(id)}>
              Configure authors
            </Button>
          </Box>
        </Row>
        <Table
          columns={columnsData}
          dataSource={content}
          onChange={this.handleTableChange}
          components={components}
          rowClassName={() => "editable-row"}
          bordered
        />
      </Card>
    );
  }
}

const columns = ({ handleDelete }) => [
  {
    title: "Tag number",
    dataIndex: "tagNumber",
    key: "tagNumber",
    sorter: true
  },
  {
    title: "Tag",
    dataIndex: "tag",
    key: "tag",
    sorter: true,
    editable: true
  },

  {
    title: "Value",
    dataIndex: "value",
    key: "value",
    editable: true,
    render: (value, { tag }) => (
      <Switch
        value={tag}
        Text={<p>{value}</p>}
        Img={<p>{value.src}</p>}
        Slider={
          Array.isArray(value) && (
            <div>
              {value.map(item => (
                <p>{item}</p>
              ))}
            </div>
          )
        }
        SubTitle={<p>{value}</p>}
        Blockquote={<p>{value}</p>}
        Fact={
          <Box>
            <p containerProps={{ marginBottom: 5 }}>{value.title}</p>
            <p>{value.content}</p>
          </Box>
        }
        Authors={
          Array.isArray(value) && (
            <Box>
              <p>{"Authors"}</p>
              <Box>
                {value.map(({ job = "", name = "", link }, key) => {
                  return <Author key={key} name={name.split(" ")} job={job} />;
                })}
              </Box>
            </Box>
          )
        }
        Video={<p>{value}</p>}
        default={<Box />}
      />
    )
  },
  {
    title: "View",
    dataIndex: "view",
    key: "view",
    render: (view, { value, tag }) => (
      <Switch
        value={tag}
        Img={<img width="auto" height="100px" src={value.src} />}
        Slider={
          Array.isArray(value) && (
            <div>
              {value.map(item => (
                <img key={item} src={item} width="auto" height="100px" />
              ))}
            </div>
          )
        }
        Video={
          typeof value === "string" && <iframe src={value.split("?")[0]} />
        }
        default={<Box />}
      />
    )
  },
  {
    title: "Actions",
    dataIndex: "actions",
    key: "actions",
    render: (actions, { tagNumber }) => (
      <Button
        type="danger"
        size="small"
        onClick={() => handleDelete(tagNumber)}
      >
        Delete
      </Button>
    )
  }
];

const Author = () => <Box />;
