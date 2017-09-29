import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

import {
	Form,
	Segment,
	Divider,
	Button,
	Icon,
	Modal,
	Message
} from 'semantic-ui-react';

import { OrdererDropdown, OrdererAddModal } from 'components/Orderer';
import Category from 'components/Category';

import * as ordererAction from 'redux/modules/base/orderer';
import api from 'helpers/WebApi/orderer';
import * as notes from 'helpers/WebApi/note';
import utils from 'helpers/utils';

const initialState = {
	'orderer_name': '',
	'orderer_phone': '',
	'orderer_id': '',
	'receiver_name': '',
	'receiver_phone': '',
	'delivery_category': '',
	'delivery_price': 0,
	'delivery_date': moment(),
	'delivery_address': '',
	'delivery_text': '',
	'memo': '',
	'error': false
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

		const rd = moment().millisecond();

		const data = {
			name: value,
			_id: 'no'+rd
		};

		await OrdererActions.setOrdererData({orderer: data});

		await handleChange(null, {name: 'orderer_name', value: data.name+'|'+data._id});
	}

	handleDateChange = (date) => {
		this.setState({delivery_date: date});
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
		
		OrdererActions.fetchingOrdererData({fetch: true, message: (<div><Icon name="checkmark" color="green" /> 거래처 등록완료!!!</div>)});

		setTimeout(() => {
			OrdererActions.fetchingOrdererData({fetch: false, message: ''});
			handleModal.close();
		}, 1500);
	}

	handlePriceClick = (price) => {
		this.setState({delivery_price: price.toLocaleString()});
	}

	handleCancel = (e) => {
		e.preventDefault();

		this.setState(initialState);
	}

	handleSubmit = async (e) => {
		const { OrdererActions } = this.props;
		const {
			orderer_name,
			orderer_phone,
			orderer_id,
			receiver_name,
			receiver_phone,
			delivery_category,
			delivery_address,
			delivery_date,
			delivery_price,
			delivery_text,
			memo
		} = this.state;

		e.preventDefault();

		if (utils.empty(orderer_name) || utils.empty(orderer_phone) || utils.empty(receiver_name)) {
			this.setState({error: true});
			return false;
		}

		OrdererActions.fetchingOrdererData({
			fetch: true,
			message: `${orderer_name} 님의 장부 1건 등록중...`});
		
		const res = await notes.addNote({
			orderer_name,
			orderer_phone,
			orderer_id,
			receiver_name,
			receiver_phone,
			delivery_category,
			delivery_address,
			delivery_date: delivery_date.toISOString(),
			delivery_price: parseInt(delivery_price.replace(',', ''), 10),
			delivery_text,
			memo
		});
		console.log(res);

		OrdererActions.fetchingOrdererData({
			fetch: true,
			message: (<div><Icon name="checkmark" color="green" /> 장부 등록완료!!!</div>)
		});
		
		setTimeout(() => {
			this.setState(initialState);
			OrdererActions.fetchingOrdererData({fetch: false, message: ''});
		}, 1500);
	}

	handleError = () => {
		this.setState({error: false});
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
			handleOrdererAdd,
			handleError
		} = this;

		const {
			orderer_phone,
			receiver_name,
			receiver_phone,
			delivery_date,
			delivery_address,
			delivery_price,
			delivery_text,
			delivery_category,
			memo,
			error
		} = this.state;

		const { status: { orderer } } = this.props;

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

		// console.log(this.state);

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
							required
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
							required
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
							<DatePicker
								showTimeSelect
								selected={delivery_date}
								minTime={moment().hours(9).minutes(0)}
								maxTime={moment().hours(20).minutes(30)}
								dateFormat="YYYY/MM/DD A HH시 mm분"
								className="date_input"
								onChange={handleDateChange} />
						</Form.Group>
						<Category
							tabIndex="9"
							value={delivery_category}
							onChange={handleChange}/>
						<Form.Group inline>
							<label className="prequired">상품가격</label>
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
								<Button color="blue" onClick={(e) => { e.preventDefault(); handlePriceClick(50000);}}>50,000원</Button>
								<Button color="red" onClick={(e) => { e.preventDefault(); handlePriceClick(100000);}}>100,000원</Button>
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
				{error && (
					<Modal dimmer='blurring' open={error} onClose={handleError}>
						<Modal.Header>필수 입력란을 기입하세요!</Modal.Header>
						<Modal.Content>
							<Message error icon>
								<Icon name="warning sign" color="red" size="huge"/>								<Message.Content>
								<Message.Header style={{marginBottom: '1rem'}}>필수 입력란이 비어있습니다.</Message.Header>
									<b style={{color: 'red'}}>'*'</b> 표시가 있는 부분은 필수 입력하셔야 됩니다.<br/>
									필수 입력란을 모두 입력하시고 난 후 저장버튼을 눌러주세요.
								</Message.Content>
							</Message>
						</Modal.Content>
					</Modal>
				)}
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