const data = (
	{ link,
    trans,
    name,
    
    articles,
    lang,
    photo }
) => {
	const dateAdd = new Date();

	return {
		link,
    trans,
    name,
    
    articles,
    lang,
    photo ,
		dataAdd: dateAdd.toISOString(),
	};
};

module.exports = data;
