import React from 'react';
import { Form } from 'semantic-ui-react';

const categories = [
	'꽃다발',
	'꽃바구니',
	'꽃상자',
	'동양란',
	'서양란',
	'관엽식물',
	'영정바구니',
	'근조화환',
	'축하화환',
	'과일바구니',
	'기타'];

const Category = ({ value, tabIndex, onChange, children }) => {
	return (
		<Form.Dropdown
			name="delivery_category"
			label="상품종류"
			selection
			placeholder="상품종류"
			inline
			options={categories.map((c, i) => { return {'key': i, 'text': c, 'value': c}; })}
			value={value}
			tabIndex={tabIndex}
			onChange={onChange}>{children}
		</Form.Dropdown>
	);
};

export default Category;