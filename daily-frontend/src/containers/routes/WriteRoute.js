import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Form, Segment, Divider, Button } from 'semantic-ui-react';

import { OrdererAddModal } from 'components/Orderer';

import * as ordererAction from 'redux/modules/base/orderer';
import api from 'helpers/WebApi/orderer';

const numberArrayGenerator = (first, last, cb) => {
	let i=first,
		ag=[];

	for (i; i <= last; i++) {
		ag.push(String(i));
	}
	return ag.map(cb);
};

const map = (y, i) => {
	const ret = {};
	ret['key'] = i;
	ret['text'] = ret['value'] = y;

	return ret;
};

const now = new Date();
const years = numberArrayGenerator(2015, now.getFullYear(), map);
const months = numberArrayGenerator(1, 12, map);
const days = numberArrayGenerator(1, 31, map);
const hours = numberArrayGenerator(8, 21, map);

const style = {
	'margin': '0 .85714286em 0 0',
	'fontWeight': '700'
};

const orderers = [
	{text:'일선교통', value:'일선교통', key: 1},
	{text:'태림포장', value:'태림포장', key: 2},
	{text:'서구산업', value:'서구산업', key: 3},
	{text:'매장판매', value:'매장판매', key: 4},
	{text:'구미송설동창회', value:'구미송설동창회', key: 5}
];

class WriteRoute extends Component {
	state = {orderers}

	handleChange = (e, data) => {
		console.log(data);
		console.log(data.name);
	}

	handleAddItem = (e, {value}) => {
		this.setState({
			orderers: [{
				text: value,
				value
			}, ...this.state.orderers],
		});
	}

    handleModal = (() => {
        const { OrdererActions, status: { orderer } } = this.props;
        return {
            open: () => {
                if (!orderer.getIn(['modal', 'open'])) {
                    OrdererActions.openAddOrdererModal(true);
                }
            },

            close: () => {
                OrdererActions.openAddOrdererModal(false);
            }
        };
    })()

    handleOrdererAdd = (formdata) => {
        //const { OrdererActions } = this.props;

		console.log(formdata);
        /*api.addOrderer(formdata)
        .then( (res) => {
            console.log('Orderer Add : ', res);
			const orderer = res.data.orderer;
            //OrdererActions.setOrdererData({orderer});
        }, (err) => {
            console.log(err.response.data.error);
        });*/
    }

	render() {
		const { handleChange, handleAddItem, handleModal, handleOrdererAdd } = this;
		const { currentValue } = this.state;
		const { status: { orderer } } = this.props;

		return (
			<div className="subcontents-wrapper">
				<h2 className="main-title">일일장부 등록</h2>
				<Form onSubmit={(evt) => { evt.preventDefault(); return false; }}>
					<Segment color="blue">
						<Form.Group>
							<Form.Dropdown
								label="보내는분"
								name="orderer_name"
								placeholder="거래처를 입력 또는 선택하세요"
								search
								selection
								inline
								allowAdditions
								tabIndex="1"
								value={currentValue}
								options={this.state.orderers}
								additionLabel="보내는분 임시입력: "
								onAddItem={handleAddItem}
								onChange={(e, { value }) => { this.setState({ currentValue: value }); }} />
							<Button icon="add user"
								circular
								color="purple"
								onClick={handleModal.open}/>
						</Form.Group>
						<Form.Input label="전화번호"
							placeholder="주문자 전화번호를 입력하세요"
							name="orderer_phone"
							inline
							tabIndex="2"
							onChange={handleChange} />
					</Segment>
					<Segment color="red">
						<Form.Input
							label="받는 분"
							placeholder="받는 사람 이름을 입력하세요"
							name="recv_name"
							inline
							style={{marginLeft: '0.66em'}}
							tabIndex="3" />
						<Form.Input label="전화번호"
							placeholder="받는 사람 전화번호를 입력하세요"
							name="recv_phone"
							inline
							tabIndex="4"
							onChange={handleChange} />
						<Divider />
						<Form.Group inline>
							<label>배송일자</label>
							<Form.Dropdown
								name="recv_year"
								placeholder="년도"
								selection
								inline
								compact
								className="noclear"
								tabIndex="5"
								options={years}
								defaultValue={String(now.getFullYear())}
								onChange={handleChange} /><span style={style}>년</span>
							<Form.Dropdown 
								name="recv_month"
								placeholder="월"
								selection
								inline
								compact
								className="noclear"
								tabIndex="6"
								options={months}
								defaultValue={String(now.getMonth()+1)}
								onChange={handleChange} />{' '}<span style={style}>월</span>
							<Form.Dropdown 
								name="recv_day"
								placeholder="일"
								selection
								inline
								compact
								className="noclear"
								tabIndex="7"
								options={days}
								defaultValue={String(now.getDate())}
								onChange={handleChange} />{' '}<span style={style}>일</span>
							<Form.Dropdown 
								name="recv_hour"
								placeholder="시간"
								selection
								inline
								compact
								className="noclear"
								tabIndex="8"
								options={hours}
								defaultValue={String(now.getHours())}
								onChange={handleChange} />{' '}<span style={style}>시</span>
						</Form.Group>
						<Divider />
						<Form.Input label="배달장소"
							placeholder="배송지 주소 또는 위치를 입력하세요"
							name="address"
							labelPosition="left"
							tabIndex="9"
							style={{clear:'right'}}
							onChange={handleChange} />
					</Segment>
				</Form>
				<OrdererAddModal
                    open={orderer.getIn(['modal', 'open'])}
                    className="bounceInUp"
                    onClose={handleModal.close}
					onOrdererAdd={handleOrdererAdd}
                />
			</div>
		);
	}
};

WriteRoute = connect(
    state => ({
        status: {
            orderer: state.base.orderer
        }
    }),
    dispatch => ({
        OrdererActions: bindActionCreators(ordererAction, dispatch)
    })
 )(WriteRoute);

export default WriteRoute;