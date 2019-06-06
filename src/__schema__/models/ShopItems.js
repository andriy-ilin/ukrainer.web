const data = (
  {
    tab,
    slider,
    title,
    price,
    shortDescription,
    lang = "",
    img,
    href,
    priceArr
  },
  id
) => {
  const dateAdd = new Date();

  return {
    tab,
    slider,
    title,
    price,
    shortDescription,
    img,
    href,
    priceArr,
    lang,
    dataAdd: dateAdd.toISOString(),
    id
  };
};

module.exports = data;
