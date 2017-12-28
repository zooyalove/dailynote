import React from 'react';
import classNames from 'classnames';
import styles from './CategoryStatistics.scss';
import { Button, Dropdown, Icon } from 'semantic-ui-react';

import Input from 'components/Input';

const cx = classNames.bind(styles);

const productCategory = [
	'전체',
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

let filterText = "";

const filterTextChange = (e) => {
	filterText = e.target.value.trim();
};

const CategoryStatistics = ({
	value,
	filter,
	onChange,
	onAddFilter,
	onDeleteFilter
}) => {
	const filterTextArray = filter.map( (f, i) => {
		return (
		<Button
			key={i}
			icon
			labelPosition="right"
			// size="mini"
			onClick={() => { onDeleteFilter(f); }}
		>
			<Icon name="trash" color="red" />
			{f}
		</Button>
		);
	});

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
					id="filterInput"
					placeholder="단어를 추가해보세요."
					onChange={filterTextChange}
				/>{' '}
				<Button
					icon
					color="blue"
					style={{height: '40.7px'}}
					onClick={() => {
						onAddFilter(filterText);
						document.getElementById('filterInput').value = "";
						filterText = "";
					}}
				>
					<Icon name="add" />
					추가
				</Button>
				{filterTextArray && 
					(
						<div className={cx('filter-list')}>
							{filterTextArray}
						</div>
					)
				}
			</div>
		</div>
    );
};

export default CategoryStatistics;