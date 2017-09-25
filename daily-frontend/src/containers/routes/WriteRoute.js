import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Form, Segment, Divider, Button } from 'semantic-ui-react';

import { OrdererAddModal } from 'components/Orderer';

import * as ordererAction from 'redux/modules/base/orderer';
import api from 'helpers/WebApi/orderer';
import utils from 'helpers/utils';

const now = new Date();
const years = utils.numberArrayGenerator(2015, now.getFullYear());
const months = utils.numberArrayGenerator(1, 12);
const days = utils.numberArrayGenerator(1, 31);
const hours = utils.numberArrayGenerator(8, 21);
const categories = ['꽃다발', '꽃바구니', '꽃상자', '동양란', '서양란', '관엽식물', '영정바구니', '근조화환', '축하화환', '과일바구니', '기타'];

class WriteRoute extends Component {

	componentWillMount() {
        const { status: { orderer }, OrdererActions } = this.props;

        if (!orderer.get('data') || orderer.get('data').length === 0) {
	        api.getOrdererAll()
	        .then( (res) => {
	            // console.log(res);
	            const orderer = res.data.orderers;

	            OrdererActions.setOrdererData({orderer});
	        })
	        .catch( (err) => {
	            OrdererActions.setOrdererData({orderer: []});            
	        });
	    }
	}

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

    handleOrdererAdd = async (formdata) => {
		const { OrdererActions } = this.props;
		const { handleModal } = this;

		OrdererActions.fetchingOrdererData(true);

		await api.addOrderer(formdata)
			.then( (res) => {
				console.log('Orderer Add : ', res);
				const orderer = res.data.orderer;
				OrdererActions.setOrdererData({orderer});
			}, (err) => {
				console.log(err.response.data.error);
			});
		
		OrdererActions.fetchingOrdererData(false);
		handleModal.close();
	}

	render() {
		const { handleChange, handleAddItem, handleModal, handleOrdererAdd } = this;
		const { status: { orderer } } = this.props;

		const style = {
			'margin': '0 .85714286em 0 -0.6em',
			'fontWeight': '700'
		};

		return (
			<div className="subcontents-wrapper">
				<h2 className="main-title">일일장부 등록</h2>
				<Form onSubmit={(evt) => { evt.preventDefault(); return false; }}>
					<Segment color="blue">
						<Form.Group>
							<Form.Dropdown
								name="orderer_name"
								label="보내는분"
								placeholder="거래처를 입력 또는 선택하세요"
								search
								selection
								inline
								tabIndex="1"
								options={orderer.get('data').map((odata) => { return { key: odata._id, text: odata.name, value: odata._id }; })}
								allowAdditions
								additionLabel="보내는분 임시입력: "
								onChange={(e, d) => { console.log(d); }}
								onAddItem={handleAddItem}/>
							<Button icon="add user"
								circular
								color="purple"
								onClick={handleModal.open}/>
						</Form.Group>
						<Form.Input
							name="orderer_phone"
							label="전화번호"
							placeholder="주문자 전화번호를 적어주세요"
							inline
							tabIndex="2"
							onChange={handleChange} />
					</Segment>
					<Segment color="red">
						<Form.Input
							name="recv_name"
							label="받는 분"
							placeholder="받는 사람 이름을 적어주세요"
							inline
							style={{marginLeft: '0.66em'}}
							tabIndex="3" />
						<Form.Input
							name="recv_phone"
							label="전화번호"
							placeholder="받는 사람 전화번호를 적어주세요"
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
								tabIndex="8"
								options={hours}
								defaultValue={String(now.getHours())}
								onChange={handleChange} />{' '}<span style={style}>시</span>
						</Form.Group>
						<Form.Dropdown
							name="category"
							label="상품종류"
							selection
							placeholder="상품종류"
							inline
							options={categories.map((c) => { return {'key': c, 'text': c, 'value': c}; })}
							tabIndex="9"/>
						<Form.Group inline>
							<label>상품가격</label>
							<Form.Input
								name="price"
								placeholder="상품 가격을 적어주세요"
								inline
								tabIndex="10"/>{' '}<span style={style}>원</span>
						</Form.Group>
						<Divider />
						<Form.Input
							name="address"
							label="배달장소"
							placeholder="배송지 주소 또는 위치를 적어주세요"
							tabIndex="11"
							onChange={handleChange} />
						<Form.Input
							name="text"
							label="글 씨"
							placeholder="보내는 분과 경조사어를 적어주세요"
							tabIndex="12"
							onChange={handleChange} />
						<Form.TextArea
							name="memo"
							label="비 고"
							placeholder="추가로 참고할 내용을 적어주세요"
							inline
							tabIndex="13"/>
					</Segment>
					<Form.Button
						floated="right"
						icon="checkmark"
						content="저장"
						positive/>
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