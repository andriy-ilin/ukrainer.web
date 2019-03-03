import React, { Component } from "react";
import moment from "moment";
import { Table, Button, Input, Icon, Popconfirm, message } from "antd";
import Highlighter from "react-highlight-words";
import Box from "../../components/Box";

import schema from "../../__schema__/";
import EditableFormRow from "../../components/EditableTableComponents/EditableFormRow";
import EditableCell from "../../components/EditableTableComponents/EditableCell";

import { NewVideoModal } from "./ModalView";

class VideoMap extends Component {
  state = {
    data: [],
    video: [],
    hightLighter: {},
    newVideoMapModal: false
  };
  async componentDidMount() {
    const video = await schema.VideoMap.get();
    return this.setState({
      video: Object.values(video),
      data: Object.values(video)
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
      video: filteredArticles
    });
  };

  handleDelete = async key => {
    const dataSource = [...this.state.video];
    await this.setState({
      data: dataSource.filter(item => item.id !== key),
      video: dataSource.filter(item => item.id !== key)
    });
    await await schema.VideoMap.remove({ id: key });
    message.success("Video delete success");
  };

  handleAdd = async values => {
    const { video, data } = this.state;

    const { id, dateAdd } = await schema.VideoMap.setWithCreateId({
      data: values
    });

    await this.setState({
      video: [{ ...values, id, dateAdd }, ...video],
      data: [{ ...values, id, dateAdd }, ...data]
    });
    message.success("Video add success");
  };

  handleSave = async row => {
    const newData = [...this.state.video];
    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row
    });

    await schema.VideoMap.set({ id: row.id, data: row });
    await this.setState({ video: newData });
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
    const { video, newVideoMapModal } = this.state;
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
        <h1>Video on map</h1>
        <Box my={10}>
          <Button
            type="primary"
            onClick={() => this.setState({ newVideoMapModal: true })}
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
          scroll={{ x: 2000 }}
        />
        <NewVideoModal
          visible={!!newVideoMapModal}
          onSubmit={data => {
            this.handleAdd(data);
            this.setState({ newVideoMapModal: false });
          }}
          closeModal={() => this.setState({ newVideoMapModal: false })}
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
    title: "title",
    key: "title",
    dataIndex: "title",
    sorter: true,
    editable: true,
    width: 70
  },
  {
    title: "description",
    key: "description",
    dataIndex: "description",
    sorter: true,
    editable: true
  },
  {
    title: "image",
    key: "image",
    dataIndex: "image",
    sorter: true,
    editable: true,
    render: src => <img src={src} alt={src} />
  },
  {
    title: "video",
    key: "video",
    dataIndex: "video",
    sorter: true,
    editable: true,
    render: src => <iframe src={src} title={src} />
  },
  {
    title: "latitude",
    key: "latitude",
    dataIndex: "latitude",
    sorter: true,
    editable: true,
    width: 70
  },
  {
    title: "longitude",
    key: "longitude",
    dataIndex: "longitude",
    sorter: true,
    editable: true,
    width: 70
  },
  {
    title: "region",
    key: "region",
    dataIndex: "region",
    sorter: true,
    editable: true,
    width: 70
  },
  {
    title: "isActive",
    key: "isActive",
    dataIndex: "isActive",
    sorter: true,
    editable: true,
    width: 70,
    render: isActive => (isActive ? "active" : "inactive")
  },
  {
    title: "mapUrl",
    key: "mapUrl",
    dataIndex: "mapUrl",
    sorter: true,
    editable: true,
    render: src => (
      <a href={src} target="_blank" rel="noopener noreferrer">
        View map
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
    title: "Actions",
    key: "actions",
    dataIndex: "actions",
    delete: true,
    render: (actions, { id }) => (
      <Popconfirm
        title="Are you sure delete this?"
        onConfirm={async () => {
          await handleDelete(id);
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

export default VideoMap;
