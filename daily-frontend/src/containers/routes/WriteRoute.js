import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Form, Segment, Divider, Button, Icon } from 'semantic-ui-react';

import { OrdererDropdown, OrdererAddModal } from 'components/Orderer';
import Category from 'components/Category';

import * as ordererAction from 'redux/modules/base/orderer';
import api from 'helpers/WebApi/orderer';
import utils from 'helpers/utils';

const now = new Date();
const years = utils.numberArrayGenerator(2015, now.getFullYear());
const months = utils.numberArrayGenerator(1, 12);
const days = utils.numberArrayGenerator(1, 31);
const hours = utils.numberArrayGenerator(8, 21);

const initialState = {
	'orderer_name': '',
	'orderer_phone': '',
	'orderer_id': '',
	'receiver_name': '',
	'receiver_phone': '',
	'delivery_category': '',
	'delivery_price': 0,
	'delivery_date': now.getTime(),
	'delivery_address': '',
	'delivery_text': '',
	'memo': ''
};

class WriteRoute extends Component {

	state = initialState

	componentWillMount() {
		const { OrdererActions } = this.props;

		api.getOrdererAll()
		.then( (res) => {
			const orderer = res.data.orderers;

			OrdererActions.setOrdererData({orderer});
		})
		.catch( (err) => {
			// OrdererActions.setOrdererData({orderer: []});            
		});
	}

	handleChange = (e, { name, value }) => {
		// const { status: { orderer } } = this.props;
		let text, _id;

		if (name === 'orderer_name') {
			text = value.split('|')[0];
			_id = value.split('|')[1];
			_id = (/^no[0-9]+/.test(_id)) ? 'no' : _id;

			this.setState({ [name]: text, 'orderer_id': _id });
		} else {
			this.setState({[name]: value});
		}
	}

	handleAddItem = async (e, { value }) => {
		const { OrdererActions } = this.props;
		const { handleChange } = this;

		const rd = (new Date()).getTime();

		const data = {
			name: value,
			_id: 'no'+rd
		};

		await OrdererActions.setOrdererData({orderer: data});

		await handleChange(null, {name: 'orderer_name', value: data.name+'|'+data._id});
	}

	handleDateChange = () => {

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

    handleOrdererAdd = async (formdata) => {
		const { OrdererActions } = this.props;
		const { handleModal } = this;

		OrdererActions.fetchingOrdererData({fetch: true, message: '거래처 정보 업데이트중...'});

		await api.addOrderer(formdata)
			.then( (res) => {
				console.log('Orderer Add : ', res);
				const orderer = res.data.orderer;
				OrdererActions.setOrdererData({orderer});
			}, (err) => {
				console.log(err.response.data.error);
			});
		
		OrdererActions.fetchingOrdererData({fetch: true, message: (<Icon name="checkmark" color="green" ></Icon>)});

		setTimeout(() => {
			OrdererActions.fetchingOrdererData({fetch: false, message: ''});
			handleModal.close();
		}, 1000);
	}

	handlePriceClick = (price) => {
		this.setState({delivery_price: price.toLocaleString()});
	}

	handleCancel = () => {
		this.setState(initialState);
	}

	handleSubmit = () => {
		const { OrdererActions } = this.props;

		OrdererActions.fetchingOrdererData({fetch: true, message: `${this.state.name} 님의 장부 1건 등록중...`});
	}

	render() {
		const {
			handleChange,
			handleDateChange,
			handleAddItem,
			handleModal,
			handlePriceClick,
			handleCancel,
			handleSubmit,
			handleOrdererAdd
		} = this;

		const {
			orderer_phone,
			receiver_name,
			receiver_phone,
			delivery_address,
			delivery_price,
			delivery_text,
			delivery_category,
			memo
		} = this.state;

		const { status: { orderer } } = this.props;

		const style = {
			'margin': '0 .85714286em 0 -0.6em',
			'fontWeight': '700'
		};

		const options = (orderer.get('data') && orderer.get('data').size > 0) ?
			orderer.get('data').map((d) => {
				return {
					key: d.get('_id'),
					text: d.get('name'),
					value: d.get('name')+'|'+d.get('_id')
				};
			}).toArray() : [];

		const price = (String(delivery_price).indexOf(',') > -1) ?
						String(delivery_price).replace(',', '') : delivery_price;

		console.log(this.state);

		return (
			<div className="subcontents-wrapper">
				<h2 className="main-title">일일장부 등록</h2>
				<Form onSubmit={(evt) => { evt.preventDefault(); return false; }}>
					<Segment color="blue">
						<OrdererDropdown
							options={options}
							tabIndex="1"
							onChange={handleChange}
							onAddItem={handleAddItem}
							onAddOrderer={handleModal.open}/>
						<Form.Input
							name="orderer_phone"
							label="전화번호"
							placeholder="주문자 전화번호를 적어주세요"
							inline
							value={orderer_phone}
							tabIndex="2"
							onChange={handleChange} />
					</Segment>
					<Segment color="red">
						<Form.Input
							name="receiver_name"
							label="받는 분"
							placeholder="받는 사람 이름을 적어주세요"
							inline
							value={receiver_name}
							style={{marginLeft: '0.66em'}}
							tabIndex="3"
							onChange={handleChange} />
						<Form.Input
							name="receiver_phone"
							label="전화번호"
							placeholder="받는 사람 전화번호를 적어주세요"
							inline
							value={receiver_phone}
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
								tabIndex="5"
								options={years}
								defaultValue={String(now.getFullYear())}
								onChange={handleDateChange} /><span style={style}>년</span>
							<Form.Dropdown 
								name="recv_month"
								placeholder="월"
								selection
								inline
								compact
								tabIndex="6"
								options={months}
								defaultValue={String(now.getMonth()+1)}
								onChange={handleDateChange} />{' '}<span style={style}>월</span>
							<Form.Dropdown 
								name="recv_day"
								placeholder="일"
								selection
								inline
								compact
								tabIndex="7"
								options={days}
								defaultValue={String(now.getDate())}
								onChange={handleDateChange} />{' '}<span style={style}>일</span>
							<Form.Dropdown 
								name="recv_hour"
								placeholder="시간"
								selection
								inline
								compact
								tabIndex="8"
								options={hours}
								defaultValue={String(now.getHours())}
								onChange={handleDateChange} />{' '}<span style={style}>시</span>
						</Form.Group>
						<Category
							tabIndex="9"
							value={delivery_category}
							onChange={handleChange}/>
						<Form.Group inline>
							<label>상품가격</label>
							<div className="ui input" style={{minWidth: '6rem'}}>
								<input
									name="delivery_price"
									type="number"
									placeholder="상품 가격을 적어주세요"
									min="0"
									inputMode="numeric"
									tabIndex="10"
									value={parseInt(price, 10)}
									style={{textAlign: 'right'}}
									onChange={({target: { name, value }}) => {handleChange(null, {name, value});}}
									/>
							</div>{' '}<span style={{margin: '0 1rem 0 .4rem'}}><b>원</b></span>{' '}
							<Button.Group>
								<Button color="blue" onClick={() => handlePriceClick(50000)}>50,000원</Button>
								<Button color="red" onClick={() => handlePriceClick(100000)}>100,000원</Button>
							</Button.Group>
						</Form.Group>
						<Divider />
						<Form.Input
							name="delivery_address"
							label="배달장소"
							placeholder="배송지 주소 또는 위치를 적어주세요"
							tabIndex="11"
							value={delivery_address}
							onChange={handleChange} />
						<Form.Input
							name="delivery_text"
							label="글 씨"
							placeholder="보내는 분과 경조사어를 적어주세요"
							tabIndex="12"
							value={delivery_text}
							onChange={handleChange} />
						<Form.TextArea
							name="memo"
							label="비 고"
							placeholder="추가로 참고할 내용을 적어주세요"
							inline
							style={{'height': '1rem'}}
							value={memo}
							tabIndex="13"
							onChange={handleChange}/>
					</Segment>
					<Form.Group inline style={{float: 'right'}}>
						<Form.Button
							negative
							content="취소"
							onClick={handleCancel} />
						<Form.Button
							icon="checkmark"
							positive
							content="저장"
							onClick={handleSubmit} />
					</Form.Group>
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