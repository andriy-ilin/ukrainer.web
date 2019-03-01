import React, { Component } from "react";
import { Table, Button, message } from "antd";
import Box from "../../components/Box";

import schema from "../../__schema__/";
import EditableFormRow from "../../components/EditableTableComponents/EditableFormRow";
import EditableCell from "../../components/EditableTableComponents/EditableCell";

class Lang extends Component {
  state = {
    lang: []
  };
  async componentDidMount() {
    const lang = await schema.Lang.get();
    return this.setState({
      lang: Object.values(lang)
    });
  }

  handleDelete = async key => {
    const dataSource = [...this.state.lang];
    this.setState({ lang: dataSource.filter(item => item.key !== key) });
    await schema.Lang.set({
      data: dataSource.filter(item => item.key !== key)
    });
    message.success("Lang delete success");
  };

  handleAdd = () => {
    const { lang } = this.state;
    this.setState({
      lang: [{ key: "", value: "" }, ...lang]
    });
  };

  handleSave = async row => {
    const newData = [...this.state.lang];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row
    });

    await schema.Lang.set({ data: newData });

    this.setState({ lang: newData });
    message.success("Lang change success");
  };

  render() {
    const { lang } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    };
    const columnsData = columns({
      handleDelete: this.handleDelete
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
        <h1>Lang</h1>
        <Box my={10}>
          <Button type="primary" onClick={() => this.handleAdd()}>
            New Lang
          </Button>
        </Box>
        <Table
          dataSource={lang}
          columns={columnsData}
          components={components}
          rowClassName={() => "editable-row"}
        />
      </Box>
    );
  }
}

const columns = ({ handleDelete = () => {} }) => [
  {
    title: "Key",
    dataIndex: "key",
    key: "key",
    editable: true
  },

  {
    title: "Value",
    key: "value",
    dataIndex: "value",
    editable: true
  },
  {
    title: "Actions",
    key: "actions",
    dataIndex: "actions",
    delete: true,
    render: (actions, { key }) => (
      <Button type="danger" size="small" onClick={() => handleDelete(key)}>
        Delete
      </Button>
    )
  }
];

export default Lang;
