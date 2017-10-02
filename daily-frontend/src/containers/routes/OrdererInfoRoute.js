import React, { Component } from 'react';

import { OrdererInfo, InfoCard } from 'components/Orderer';
import * as api from 'helpers/WebApi/orderer';

import back1 from 'static/images/beach-love.jpg';
import back2 from 'static/images/Blossom-Tree.jpg';
import back3 from 'static/images/chamomile_flowers.jpg';
import back4 from 'static/images/circles_artwork.jpg';
import back5 from 'static/images/Palm-Trees.jpg';

const backImages = [back1, back2, back3, back4, back5];

class OrdererInfoRoute extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ordererInfo: {},
            data: null
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

        // console.log(res);
        if (res.status === 200 && !!(res.data)) {
            const { data } = res;
            this.setState({
                ordererInfo: data.ordererInfo,
                data: data.data
            });
        }
    }

    render() {
        const random = Math.floor(Math.random() * 5);
        const { ordererInfo } = this.state;
        const label = ordererInfo.name ? ordererInfo.name : '';

        return (
            <OrdererInfo>
                <InfoCard backgroundImage={backImages[random]} label={label} />
            </OrdererInfo>
        );
    }
}
 
export default OrdererInfoRoute;