import React from "react";

const CreateElement = ({ children, component, style, ...props }) =>
  React.createElement(component, { style }, children);

export default CreateElement;
