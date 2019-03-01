import React from "react";
import parseProps from "../../helpers/parseProps";
import CreateElement from "../CreateElement/";

const Text = ({ children, component = "p", ...props }) => (
  <CreateElement component={component} style={parseProps(props)}>
    {children}
  </CreateElement>
);

export default Text;
