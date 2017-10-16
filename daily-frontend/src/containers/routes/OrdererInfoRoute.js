import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Modal, Message, Icon, Loader } from 'semantic-ui-react';

import { OrdererInfo, InfoCard } from 'components/Orderer';
import InfoList from 'components/InfoList';
import AnimMoreButton from 'components/AnimMoreButton';

import * as api from 'helpers/WebApi/orderer';
import * as ordererAction from 'redux/modules/base/orderer';

import back1 from 'static/images/beach-love.jpg';
import back2 from 'static/images/Blossom-Tree.jpg';
import back3 from 'static/images/chamomile_flowers.jpg';
import back4 from 'static/images/circles_artwork.jpg';
import back5 from 'static/images/Palm-Trees.jpg';

const backImages = [back1, back2, back3, back4, back5];

class OrdererInfoRoute extends Component {

    static contextTypes = {
        router: React.PropTypes.object
    }

    constructor(props) {
        super(props);

        this.state = {
            ordererInfo: {
                name: '',
                phone: '',
                manager: '',
                manager_phone: '',
                address: '',
                def_ribtext: '',
                description: '',
                date: ''
            },
            data: null,
            del_open: false
        };
    }
    componentWillMount() {
        const { userid } = this.props.params;
       
        this.handleOrdererInfo(userid);
    }

    componentWillReceiveProps(nextProps) {
        const { userid } = this.props.params;

        if (userid !== nextProps.params.userid &&
            nextProps.params.userid !== undefined) {
            this.handleOrdererInfo(nextProps.params.userid);
        }
    }

    handleOrdererInfo = async (id) => {
        const res = await api.getOrdererById({id});

        if (res.status === 200 && !!(res.data)) {
            const { data } = res;
            this.setState({
                ordererInfo: data.ordererInfo,
                data: data.data
            });
        }
    }

    handleModify = () => {

    }

    handleDelete = async () => {
        const { OrdererActions, status: { orderer }, params: { userid } } = this.props;
        const { ordererInfo } = this.state;

        this.setState({del_open: false});

        OrdererActions.fetchingOrdererData({fetch: true, message: (<Loader>{ordererInfo.name} 님의 정보를 삭제중...</Loader>)});

        api.deleteOrderer({id: userid})
            .then((res) => {
                console.log('res :', res);
                
                OrdererActions.fetchingOrdererData({fetch: true, message: (<div><Icon name="checkmark" size="big" color="green" />{ordererInfo.name} 님의 정보를 삭제했습니다...</div>)});

                setTimeout(() => {
                    const restList = orderer.get('data').filter((d) => d.get('_id') !== userid);
                    
                    OrdererActions.setOrdererData({orderer: restList});

                    OrdererActions.fetchingOrdererData({fetch: false, message: ''});

                    this.context.router.push('/orderer');
                }, 3000);
            })
            .catch((err) => {
                console.log(err);                
                OrdererActions.fetchingOrdererData({fetch: true, message: (<div><Icon name="cancel" size="big" color="red" />{ordererInfo.name} 님의 정보를 삭제하지 못했습니다...</div>)});

                setTimeout(() => OrdererActions.fetchingOrdererData({fetch: false, message: ''}), 3000);
            });
    }

    handleCancel = () => {
        this.setState({del_open: false});
    }

    render() {
        const random = Math.floor(Math.random() * 5);
        const { ordererInfo, data, del_open } = this.state;
        const { handleModify, handleDelete, handleCancel } = this;

        return (
            <OrdererInfo>
                <InfoCard backgroundImage={backImages[random]}
                        name={ordererInfo.name}
                        moreButton={<AnimMoreButton />}
                        onDelete={() => this.setState({del_open: true})}
                        onModify={handleModify}>
                    <InfoList datalist={{ordererInfo, data}} />
                </InfoCard>
				{del_open && (
					<Modal dimmer='blurring'
                        open={del_open}
                        closeOnEscape={true}
                        closeOnRootNodeClick={false}
                        onClose={handleCancel}>
						<Modal.Header>정말로 삭제하시겠습니까?</Modal.Header>
						<Modal.Content>
							<Message error icon>
								<Icon name="warning sign" color="red" size="huge"/>
								<Message.Content>
									<Message.Header style={{marginBottom: '1rem', fontSize: '1.5rem'}}><b>'{ordererInfo.name}'</b> 님의 정보를 삭제하시겠습니까?</Message.Header>
                                    <p style={{color: 'red'}}>삭제를 하실 경우에는 신중히 고려하신 후에 결정하십시요!!!</p>
								</Message.Content>
							</Message>
						</Modal.Content>
                        <Modal.Actions>
                            <Button negative onClick={handleCancel}>아니오</Button>
                            <Button positive icon="delete" labelPosition="right" content="삭제" onClick={handleDelete}></Button>
                        </Modal.Actions>
					</Modal>
				)}
            </OrdererInfo>
        );
    }
}

OrdererInfoRoute = connect(
    state => ({
        status: {
            orderer: state.base.orderer
        }
    }),
    dispatch => ({
        OrdererActions: bindActionCreators(ordererAction, dispatch)
    })
 )(OrdererInfoRoute);

export default OrdererInfoRoute;