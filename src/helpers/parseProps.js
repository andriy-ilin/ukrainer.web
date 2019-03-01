const LIST = {
  pt: ["paddingTop"],
  pb: ["paddingBottom"],
  pl: ["paddingLeft"],
  pr: ["paddingRight"],
  px: ["paddingLeft", "paddingRight"],
  py: ["paddingTop", "paddingBottom"],
  p: ["padding"],
  mt: ["marginTop"],
  mb: ["marginBottom"],
  ml: ["marginLeft"],
  mr: ["marginRight"],
  mx: ["marginLeft", "marginRight"],
  my: ["marginTop", "marginBottom"],
  m: ["margin"],
  bg: ["backgroundColor"]
};

const parseProps = props => {
  const fromKeyToProps = (key, value) => {
    const data = LIST[key]
      ? LIST[key].reduce((prev, item) => ({ ...prev, [item]: value }), {})
      : { [key]: value };
    return data;
  };
  const returnProps = Object.entries(props).reduce(
    (prev, [key, value]) => ({ ...prev, ...fromKeyToProps(key, value) }),
    {}
  );

  return returnProps;
};

export default parseProps;
