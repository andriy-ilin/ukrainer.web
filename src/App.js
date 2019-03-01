import React, { Component } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { Form, Card, Input, Icon, Button, Row } from "antd";
import { Router } from "@reach/router";
import Home from "./pages/Home";
import Lang from "./pages/Lang";
import Layout from "./components/Layout/";
import Box from "./components/Box/";

import "antd/dist/antd.css";
import "./App.css";

class LayoutWrapper extends Component {
  state = { password: "", email: "", verify: true, showForm: false };
  getUserFromStorage = () => localStorage.getItem("ukrainer/user");
  setUserFromStogage = user => {
    localStorage.setItem("ukrainer/user", JSON.stringify(user));
  };

  async componentDidMount() {
    const user = this.getUserFromStorage();
    if (user) {
      const { password, email } = JSON.parse(user);
      await firebase.auth().signInWithEmailAndPassword(email, password);
      return this.setState({ verify: false });
    }
    return this.setState({ showForm: true });
  }
  async componentDidUpdate(props, { verify: prevVerify }) {
    const { verify: nextVerify } = this.state;
    if (nextVerify !== prevVerify) {
      const user = this.getUserFromStorage();
      if (user) {
        const { password, email } = user;
        await firebase.auth().signInWithEmailAndPassword(email, password);
      }
    }
  }

  render() {
    const { verify, showForm } = this.state;
    if (verify)
      return (
        showForm && (
          <Box py={30}>
            <Row type="flex" justify="center" align="middle">
              <Card title="Login form" className="login-card">
                <WrapperLoginForm
                  onSubmit={async ({ email, password }) => {
                    await firebase
                      .auth()
                      .signInWithEmailAndPassword(email, password);
                    await firebase.auth().onAuthStateChanged(
                      user =>
                        user &&
                        this.setUserFromStogage({
                          email,
                          password,
                          displayName: user.displayName,
                          emailVerified: user.emailVerified,
                          photoURL: user.photoURL,
                          isAnonymous: user.isAnonymous,
                          uid: user.uid,
                          providerData: user.providerData
                        })
                    );
                    this.setState({ verify: false });
                  }}
                />
              </Card>
            </Row>
          </Box>
        )
      );
    return (
      <Layout>
        <Router>
          <Home path="/" />
          <Lang path="/lang" />
        </Router>
      </Layout>
    );
  }
}
class App extends Component {
  render() {
    return (
      <Router>
        <LayoutWrapper path="/*" />
      </Router>
    );
  }
}

const LoginForm = ({
  form: { getFieldDecorator, validateFields },
  onSubmit
}) => (
  <Form
    onSubmit={async e => {
      e.preventDefault();
      validateFields(async (err, values) => {
        if (!err) {
          onSubmit(values);
        }
      });
    }}
    className="login-form"
  >
    <Form.Item>
      {getFieldDecorator("email", {
        rules: [{ required: true, message: "Please input your email!" }]
      })(
        <Input
          prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
          placeholder="Email"
        />
      )}
    </Form.Item>
    <Form.Item>
      {getFieldDecorator("password", {
        rules: [{ required: true, message: "Please input your Password!" }]
      })(
        <Input
          prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
          type="password"
          placeholder="Password"
        />
      )}
    </Form.Item>
    <Form.Item>
      <Button type="primary" htmlType="submit" className="login-form-button">
        Log in
      </Button>
    </Form.Item>
  </Form>
);

const WrapperLoginForm = Form.create({ name: "login" })(LoginForm);

export default App;
