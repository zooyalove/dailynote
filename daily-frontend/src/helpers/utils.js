const utils = {};

utils.numberArrayGenerator = (first, last, cb) => {
	let i=first,
		ag=[];

	if (!cb || cb === undefined) {
		cb = utils.map;
	}

	for (i; i <= last; i++) {
		ag.push(String(i));
	}
	return ag.map(cb);
};

utils.map = (y, i) => {
	const ret = {};
	ret['key'] = i;
	ret['text'] = ret['value'] = y;

	return ret;
};

utils.empty = (str) => {
	return !!(!str || str.length === 0 || str === "");
};

export default utils;