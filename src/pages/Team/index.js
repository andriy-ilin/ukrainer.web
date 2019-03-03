import React, { Component } from "react";
import { slugify } from "transliteration";

import {
  Popconfirm,
  message,
  Form,
  Table,
  Button,
  Input,
  Icon,
  Row
} from "antd";
import Highlighter from "react-highlight-words";
import Box from "../../components/Box";
import LangSelect from "../../components/LangSelect";
import schema from "../../__schema__/";
import EditableFormRow from "../../components/EditableTableComponents/EditableFormRow";
import EditableCell from "../../components/EditableTableComponents/EditableCell";

import { ModalArticles, ModalPerson } from "./ModalView";

class Team extends Component {
  state = {
    lang: "uk",
    data: [],
    role: [],
    hightLighter: {},
    openModalArticles: null,
    newPersonModal: false
  };
  async componentDidMount() {
    const { lang } = this.state;
    const role = await schema.Role.get(lang);
    return this.setState({
      role: Object.values(role),
      data: Object.values(role)
    });
  }
  updateData = async () => {
    const { lang } = this.state;
    const role = await schema.Role.get(lang);
    return this.setState({
      role: Object.values(role),
      data: Object.values(role)
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
      role: filteredArticles
    });
  };

  handleDelete = async key => {
    const { lang } = this.state;
    const dataSource = [...this.state.role];
    await this.setState({
      data: dataSource.filter(item => item.trans !== key),
      role: dataSource.filter(item => item.trans !== key)
    });
    await schema.Role.remove({ lang, id: key });
  };

  handleAdd = async values => {
    const { role, data, lang } = this.state;
    const dateAdd = new Date();
    await schema.Role.set({
      data: {
        articles: [{ href: "", job: "" }],
        ...values,
        lang,
        trans: slugify(values.name),
        dataAdd: dateAdd.toISOString()
      },
      id: `${slugify(values.name)}`,
      lang
    });
    this.setState({
      role: [
        {
          articles: [{ href: "", job: "" }],
          ...values,
          lang,
          trans: slugify(values.name),
          dataAdd: dateAdd.toISOString()
        },
        ...role
      ],
      data: [
        {
          articles: [{ href: "", job: "" }],
          ...values,
          trans: slugify(values.name),
          dataAdd: dateAdd.toISOString()
        },
        ...data
      ],
      openModalArticles: false
    });
    message.success("Role add success");
  };

  handleSave = async row => {
    const { lang } = this.state;
    const newData = [...this.state.role];
    const index = newData.findIndex(item => row.trans === item.trans);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row
    });
    await this.setState({ role: newData });
    await schema.Role.set({
      data: row,
      id: row.trans,
      lang
    });
    message.success("Role update success");
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
    const { role, lang, openModalArticles, newPersonModal, data } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    };
    const columnsData = columns({
      handleDelete: this.handleDelete,
      filterProps: this.filterProps,
      openModalArticles: trans => this.setState({ openModalArticles: trans })
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
        <h1>Team</h1>
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
            onClick={() => this.setState({ newPersonModal: true })}
          >
            New person
          </Button>
        </Box>
        <Table
          columns={columnsData}
          dataSource={role}
          onChange={this.handleTableChange}
          components={components}
          rowClassName={() => "editable-row"}
          scroll={{ x: 1300 }}
        />

        <ModalArticles
          data={data.filter(({ trans }) => trans === openModalArticles)[0]}
          visible={!!openModalArticles}
          onSubmit={data => {
            this.handleSave(data);
            this.setState({ openModalArticles: null });
          }}
          closeModal={() => this.setState({ openModalArticles: null })}
        />
        <ModalPerson
          visible={!!newPersonModal}
          onSubmit={data => {
            this.handleAdd(data);
            this.setState({ newPersonModal: false });
          }}
          lang={lang}
          closeModal={() => this.setState({ newPersonModal: false })}
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
    dataIndex: "trans",
    key: "trans",
    sorter: true,
    width: 100,

    ...filterProps("trans")
  },
  {
    title: "Name",
    dataIndex: "name",
    sorter: true,
    key: "name",
    width: 100,

    ...filterProps("name")
  },

  {
    title: "Link",
    dataIndex: "link",
    sorter: true,
    editable: true,
    width: 100,
    key: "link"
  },
  {
    title: "Photo",
    dataIndex: "photo",
    sorter: true,
    editable: true,
    width: 100,
    key: "photo",
    render: photo => <img src={photo} alt={photo} />
  },
  {
    title: "Lang",
    key: "lang",
    sorter: true,
    dataIndex: "lang"
  },

  {
    title: "Date add to DB",
    key: "dataAdd",
    dataIndex: "dataAdd",
    sorter: true,
    editable: true
  },
  {
    title: "List Articles",
    key: "articles",
    dataIndex: "articles",
    render: (articles = [], { trans, lang: articleLang }) => (
      <div>
        {articles
          .reduce((prev, { job, href }) => {
            if (prev.every(({ job: prevJob }) => prevJob !== job)) {
              return [...prev, { job, href: [href] }];
            }
            return prev.map(({ job: prevJob, href: hrefArr }) =>
              job === prevJob
                ? {
                    job: prevJob,
                    href: [...hrefArr, href]
                    // .filter(
                    //   (el, key, arr) => arr.indexOf(el) === key
                    // )
                  }
                : { job: prevJob, href: hrefArr }
            );
          }, [])
          .map(({ job, href }, index) => (
            <Box mb={5} key={`${job}-${index}`}>
              <b>{job}</b>
              {href.map((el, key) => (
                <Box key={`${el}-${key}`}>
                  <a href={el} target="_blank" rel="noopener noreferrer">
                    {el}
                  </a>
                </Box>
              ))}
            </Box>
          ))}

        <Box mt={10}>
          <Button type="primary" onClick={() => openModalArticles(trans)}>
            change job
          </Button>
        </Box>
      </div>
    )
  },
  {
    title: "Actions",
    key: "actions",
    dataIndex: "actions",
    delete: true,
    render: (actions, { trans }) => (
      <Popconfirm
        title="Are you sure delete this?"
        onConfirm={async () => {
          await handleDelete(trans);
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
const WrappedLangForm = Form.create({ name: "person" })(LangForm);
export default Team;
