const data = ({ img, href, title, priceArr, lang = "" }, id) => {
  const dateAdd = new Date();

  return {
    img,
    href,
    title,
    priceArr,
    id,
    lang,
    dataAdd: dateAdd.toISOString()
  };
};

module.exports = data;
