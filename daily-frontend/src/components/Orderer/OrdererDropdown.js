import React from 'react';
import { Form, Button } from 'semantic-ui-react';

const OrdererDropdown = ({
	options,
	tabIndex,
	onChange,
	onAddItem,
	onAddOrderer,
	...rest
}) => {
	return (
		<Form.Group>
			<Form.Dropdown
				name="orderer_name"
				label="보내는분"
				placeholder="거래처를 입력 또는 선택하세요"
				search
				selection
				inline
				options={options}
				allowAdditions
				tabIndex={tabIndex}
				additionLabel="보내는분 임시입력: "
				selectOnBlur
				onChange={onChange}
				onAddItem={onAddItem}
				{...rest}/>
			<Button icon="add user"
				circular
				color="purple"
				onClick={onAddOrderer}/>
		</Form.Group>
	);
};

export default OrdererDropdown;