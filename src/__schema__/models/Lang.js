const data = ({ key, value }) => {
	const dateAdd = new Date();

	return {
		key,
		value,
		dataAdd: dateAdd.toISOString()
	};
};

module.exports = data;
