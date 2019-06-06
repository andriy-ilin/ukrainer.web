const data = ({ link }) => {
  const dateAdd = new Date();

  return {
    link,
    dataAdd: dateAdd.toISOString()
  };
};

module.exports = data;
