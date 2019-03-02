import React, { Component } from "react";
import { Form, Table, Button, Row, Popconfirm, message } from "antd";
import Box from "../../components/Box";
import LangSelect from "../../components/LangSelect";
import schema from "../../__schema__/";
import EditableFormRow from "../../components/EditableTableComponents/EditableFormRow";
import EditableCell from "../../components/EditableTableComponents/EditableCell";

import { NewRegionModal } from "./ModalView";

class Region extends Component {
  state = {
    lang: "uk",
    region: [],
    newRegionModal: false
  };
  async componentDidMount() {
    const { lang } = this.state;
    const region = await schema.Region.get(lang);
    return this.setState({
      region: Object.values(region)
    });
  }
  updateData = async () => {
    const { lang } = this.state;
    const region = await schema.Region.get(lang);
    return this.setState({
      region: Object.values(region)
    });
  };

  handleDelete = async key => {
    const { lang } = this.state;
    const dataSource = [...this.state.region];

    await schema.Region.set({
      link: lang,
      data: dataSource.filter(item => item.region !== key)
    });
    this.setState({ region: dataSource.filter(item => item.region !== key) });
  };

  handleAdd = async values => {
    const { region, lang } = this.state;
    await schema.Region.set({ link: lang, data: [{ ...values }, ...region] });

    await this.setState({
      region: [{ ...values }, ...region],
      newRegionModal: false
    });
    message.success("Region add");
  };

  handleSave = async row => {
    const { lang } = this.state;

    const newData = [...this.state.region];
    const index = newData.findIndex(item => row.region === item.region);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row
    });

    await schema.Region.set({ link: lang, data: newData });
    this.setState({ region: newData });
  };

  render() {
    const { region, lang, newRegionModal } = this.state;
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
        <h1>Region</h1>
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
            onClick={() => this.setState({ newRegionModal: true })}
          >
            New region
          </Button>
        </Box>
        <Table
          columns={columnsData}
          dataSource={region}
          onChange={this.handleTableChange}
          components={components}
          rowClassName={() => "editable-row"}
          scroll={{ x: 1300 }}
        />

        <NewRegionModal
          visible={!!newRegionModal}
          onSubmit={data => {
            this.handleAdd(data);
            this.setState({ newRegionModal: false });
          }}
          lang={lang}
          closeModal={() => this.setState({ newRegionModal: false })}
        />
      </Box>
    );
  }
}

const columns = ({ handleDelete = () => {} }) => [
  {
    title: "Region",
    key: "region",
    dataIndex: "region"
  },
  {
    title: "Lang",
    key: "lang",
    dataIndex: "lang"
  },
  {
    title: "name",
    key: "name",
    dataIndex: "name",
    editable: true
  },
  {
    title: "about",
    key: "about",
    dataIndex: "about",
    editable: true
  },
  {
    title: "img",
    key: "img",
    dataIndex: "img",
    editable: true,
    render: img => <img src={img} alt={img} width="auto" height="100px" />
  },

  {
    title: "Video",
    dataIndex: "video",
    sorter: true,
    editable: true,
    key: "video",
    render: src => (
      <a href={src} target="_blank" rel="noopener noreferrer">
        {src}
      </a>
    )
  },
  {
    title: "Actions",
    key: "actions",
    dataIndex: "actions",
    delete: true,
    render: (actions, { region }) => (
      <Popconfirm
        title="Are you sure delete this?"
        onConfirm={async () => {
          await handleDelete(region);
          message.success("Delete success");
        }}
        onCancel={() => message.error("Delete cancel")}
        okText="Yes"
        cancelText="No"
      >
        <Button type="danger" size="small">
          Delete
        </Button>
      </Popconfirm>
    )
  }
];

const LangForm = ({ form: { getFieldDecorator }, ...props }) => (
  <LangSelect getFieldDecorator={getFieldDecorator} {...props} />
);
const WrappedLangForm = Form.create({ name: "lang" })(LangForm);
export default Region;
