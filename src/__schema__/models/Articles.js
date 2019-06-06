const data = (
  { href, mainBg, mainTitle, date, content, subLinks, lang, region, main320Bg },
  id
) => {
  const dateAdd = new Date();

  return {
    href,
    mainBg,
    mainTitle,
    date,
    content,
    subLinks,
    region,
    lang,
    main320Bg,
    dateAdd: dateAdd.toISOString(),
    id
  };
};

module.exports = data;
