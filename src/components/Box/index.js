import React from "react";
import parseProps from "../../helpers/parseProps";
import CreateElement from "../CreateElement/";

const Box = ({ children, component = "div", ...props }) => (
  <CreateElement component={component} style={parseProps(props)}>
    {children}
  </CreateElement>
);

export default Box;
