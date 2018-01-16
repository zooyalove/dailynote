import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon, Loader } from 'semantic-ui-react';

import OrdererWidget, { OrdererList, OrdererItem, OrdererAdd, OrdererAddModal } from 'components/Orderer';

import * as headerAction from 'redux/modules/base/header';
import * as ordererAction from 'redux/modules/base/orderer';

import * as api from 'helpers/WebApi/orderer';

class OrdererRoute extends Component {

    constructor(props) {
        super(props);

        this.state = {
            listActive: false
        };
    }

    componentWillMount() {
        const { OrdererActions } = this.props;

        document.title = 'Daily Note - 거래처';
        
        api.getOrdererAll()
        .then( (res) => {
            const orderer = res.data.orderers;

            OrdererActions.setOrdererData({orderer});
        })
        .catch( (err) => {
            OrdererActions.setOrdererData({orderer: []});            
        });
    }

    handleModal = (() => {
        const { OrdererActions, status: { orderer } } = this.props;
        return {
            open: () => {
                if (!orderer.getIn(['modal', 'open'])) {
                    OrdererActions.openAddOrdererModal({open: true, mode: 'add'});
                }
            },

            close: () => {
                OrdererActions.setOrdererModifyInfo({info: null});
                OrdererActions.openAddOrdererModal({open: false});
            }
        };
    })()

    handleOrdererAdd = async (formdata) => {
		const { OrdererActions, status: { orderer } } = this.props;
		const { handleModal, handleAdd, handleModify } = this;

		OrdererActions.fetchingOrdererData({fetch: true, message: (<Loader>거래처 정보 업데이트중...</Loader>)});

        if (orderer.getIn(['modal', 'mode']) === 'add') {
            await handleAdd(formdata);
        } else {
            await handleModify(formdata);
        }
		
		OrdererActions.fetchingOrdererData({fetch: true, message: (<div><Icon name="checkmark" color="green" /> 거래처 {(orderer.getIn(['modal', 'mode']) === 'add') ? '등록' : '수정'}완료!!!</div>)});

		setTimeout(() => {
			OrdererActions.fetchingOrdererData({fetch: false, message: ''});
			handleModal.close();
		}, 1500);
    }
    
    handleAdd = (formdata) => {
        const { OrdererActions } = this.props;

		api.addOrderer(formdata)
        .then( (res) => {
            console.log('Orderer Add : ', res);
            const orderer = res.data.orderer;
            OrdererActions.setOrdererData({orderer});
        }, (err) => {
            console.log(err.response.data.error);
        });
    }

    handleModify = (formdata) => {
    	const { OrdererActions } = this.props;

		api.modifyOrderer(formdata._id, formdata)
			.then( (res) => {
				console.log('Orderer Modify : ', res);
				const orderer = res.data.orderer;
				OrdererActions.setOrdererData({orderer});
			}, (err) => {
				console.log(err.response.data.error);
			});
    }
    
    handleOrdererListClick = (listActive) => {
        this.setState({ listActive });
    }

	render() {
        const { handleModal, handleOrdererAdd, handleOrdererListClick, state: { listActive } } = this;
        const { children, status: { orderer } } = this.props;

        const orderers = (orderer.get('data') && orderer.get('data').size > 0) ?
                orderer.get('data').map( (data, index) => {
                    return (<OrdererItem key={index} name={data.get('name')} to={data.get('_id')} onItemClick={handleOrdererListClick} />);
                }) : (<OrdererItem>No Results...</OrdererItem>);

        let index = ( orderer.get('selected') !== null)
                        ? orderer.get('data').findIndex( (d) => d.get('_id') === orderer.get('selected') )
                        : -1;
        
        let selected = ( index !== -1 ) ? orderer.get('data').get(index).toJS()['name'] : '';
        console.log(index, selected);

		return (
			<div className="orderer-wrapper">
                <OrdererWidget>
                    <OrdererAdd onAdd={handleModal.open} />
                    <OrdererList
                        active={listActive}
                        selected={selected}
                        count={orderers.size ? orderers.size : 0}
                        onListClick={handleOrdererListClick}
                    >
                        {orderers}
                    </OrdererList>
                </OrdererWidget>
                {children}
                {orderer.getIn(['modal', 'open']) &&
                    <OrdererAddModal
                        open={orderer.getIn(['modal', 'open'])}
                        mode={orderer.getIn(['modal', 'mode'])}
                        info={orderer.get('info')}
                        className="bounceInUp"
                        onClose={handleModal.close}
                        onOrdererAdd={handleOrdererAdd}
                    />
                }
			</div>
		);
	}
};

OrdererRoute = connect(
    state => ({
        status: {
            header: state.base.header,
            orderer: state.base.orderer
        }
    }),
    dispatch => ({
        HeaderActions: bindActionCreators(headerAction, dispatch),
        OrdererActions: bindActionCreators(ordererAction, dispatch)
    })
 )(OrdererRoute);

export default OrdererRoute;