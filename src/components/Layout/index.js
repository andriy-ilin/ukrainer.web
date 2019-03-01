import React from "react";
import { Link } from "@reach/router";
import { Row } from "antd";
import Logo from "../../icons/Logo";

import "./style.css";

const Layout = ({ children, navigate, ...props }) => (
  <div className="page" {...props}>
    <div className="page__sidebar">
      <Row type="flex" align="middle" justify="center">
        <Link to="/">
          <Logo />
        </Link>
      </Row>
    </div>
    <div className="page__content">{children}</div>
  </div>
);

export default Layout;
