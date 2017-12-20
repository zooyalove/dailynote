import React from 'react';
import classNames from 'classnames';
import styles from './CategoryStatistics.scss';
import { Dropdown } from 'semantic-ui-react';

import Input from 'components/Input';

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
		<div className={cx('category-stat-wrapper')}>
			<div className={cx('category-header')}>
				▶ 상품종류별 현황
				<Dropdown
					selection
					placeholder="상품종류"
					options={productCategory.map((c, i) => { return {'key': i, 'text': c, 'value': c}; })}
					value={value}
					onChange={onChange}
				/>
			</div>
			<div className={cx('category-filter')}>
				필터링
				<Input
					type="text"
					onChange={(e) => { console.log(e.target.value); }}
					onKeyUp={(e) => { console.log(e); }}
				/>
			</div>
		</div>
    );
};

export default CategoryStatistics;