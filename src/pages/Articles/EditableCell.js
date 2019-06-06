import React, { Component } from "react";
import { Form, Input, DatePicker, Button, Row } from "antd";
import moment from "moment";
import { EditableContext } from "./EditableFormRow";
import Switch from "../../components/Switch";

export default class EditableCell extends Component {
  state = {
    editing: false
  };

  componentDidMount() {
    if (this.props.editable) {
      document.addEventListener("click", this.handleClickOutside, true);
    }
  }

  componentWillUnmount() {
    if (this.props.editable) {
      document.removeEventListener("click", this.handleClickOutside, true);
    }
  }

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  handleClickOutside = e => {
    const { editing } = this.state;
    const { dataIndex } = this.props;
    if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
      if (dataIndex === "date") return null;
      this.save();
    }
  };

  save = () => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      this.toggleEdit();
      //TODO check and handle tag
      console.log("record", record, "values", values);
      // value => "text";
      // value => src => "text";

      if (record.tag === "Img") {
        return handleSave({
          ...record,
          value: { ...record.value, src: values.value }
        });
      }
      if (values.date) {
        return handleSave({
          ...record,
          date: moment(values.date).toISOString()
        });
      }
      handleSave({ ...record, ...values });
    });
  };

  render() {
    const { editing } = this.state;
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      ...restProps
    } = this.props;

    return (
      <td ref={node => (this.cell = node)} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {form => {
              this.form = form;

              if (editing && dataIndex === "date")
                return (
                  <Row type="flex" align="midle" justify="center">
                    <Form.Item>
                      {form.getFieldDecorator("date", {
                        initialValue: moment(record[dataIndex], "DD-MM-YYYY"),
                        rules: [
                          {
                            type: "object",
                            required: true,
                            message: "Please select time!"
                          }
                        ],
                        label: "Date"
                      })(
                        <DatePicker
                          format={"DD-MM-YYYY"}
                          ref={node => (this.input = node)}
                        />
                      )}
                    </Form.Item>

                    <Button type="primary" size="small" onClick={this.save}>
                      save
                    </Button>
                  </Row>
                );
              return editing ? (
                <Form.Item style={{ margin: 0 }}>
                  {form.getFieldDecorator(dataIndex, {
                    rules: [
                      {
                        required: true,
                        message: `${title} is required.`
                      }
                    ],
                    //TODO check and handle tag
                    initialValue:
                      record.tag === "Img"
                        ? record[dataIndex].src
                        : record[dataIndex]
                  })(
                    <Input
                      ref={node => (this.input = node)}
                      onPressEnter={this.save}
                    />
                  )}
                </Form.Item>
              ) : (
                <div
                  className="editable-cell-value-wrap"
                  style={{ paddingRight: 24 }}
                  onClick={this.toggleEdit}
                >
                  {restProps.children}
                </div>
              );
            }}
          </EditableContext.Consumer>
        ) : (
          restProps.children
        )}
      </td>
    );
  }
}
