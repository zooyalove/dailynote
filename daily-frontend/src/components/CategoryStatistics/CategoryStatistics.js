import React from 'react';
import classNames from 'classnames';
import styles from './CategoryStatistics.scss';
import { Dropdown } from 'semantic-ui-react';

const cx = classNames.bind(styles);

const productCategory = [
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
	'기타'
];

const CategoryStatistics = ({
    value,
    onChange
}) => {
    return (
		<div>
			▶ 상품종류별 현황
			<Dropdown
				selection
				placeholder="상품종류"
				options={productCategory.map((c, i) => { return {'key': i, 'text': c, 'value': c}; })}
				value={value}
				onChange={onChange}
			/>
		</div>
    );
};

export default CategoryStatistics;