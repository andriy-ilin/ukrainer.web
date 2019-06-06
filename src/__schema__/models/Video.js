const data = (
  {
    videoSrc,
    idArticle,
    dateArticleAdd,
    lang,
    region,
    vlogSrc,
    mainTitle,
    href
  },
  id
) => {
  const dateAdd = new Date();

  return {
    videoSrc,
    idArticle,
    dateArticleAdd,
    lang,
    region,
    id,
    vlogSrc,
    mainTitle,
    href,
    dateAdd: dateAdd.toISOString()
  };
};

module.exports = data;
