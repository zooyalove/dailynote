import lodash from 'lodash';

export const map = (y, i) => {
	const ret = {};
	ret['key'] = i;
	ret['text'] = ret['value'] = y;

	return ret;
};

export const numberArrayGenerator = (first, last, cb) => {
	let i=first,
		ag=[];

	if (!cb || cb === undefined) {
		cb = map;
	}

	for (i; i <= last; i++) {
		ag.push(String(i));
	}
	return ag.map(cb);
};

export const empty = (str) => {
	return lodash.isEmpty(str);
	// return !!(!str || str.length === 0 || str === "");
};