import React, { Component } from 'react';
import * as api from 'helpers/WebApi/orderer';

class OrdererInfo extends Component {

    componentDidMount() {
        const { userid } = this.props.params;

        if (userid !== undefined) {
            this.handleOrdererInfo(userid);
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

    render() {
        const { userid } = this.props.params;

        if (userid === undefined) {
            return (
                <div className="orderer_info">거래처 정보 메인페이지입니다...</div>
            );
        }

        console.log(this.state);
        
        return (
            <div className="orderer_info">거래처 정보 {userid} 상세페이지입니다...</div>
        );
    }
}
 
export default OrdererInfo;