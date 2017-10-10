import React, { Component } from 'react';
import { OrdererInfo } from 'components/Orderer';
import Card from 'components/Card';
import ChartCard from 'components/ChartCard';

class NullInfoRoute extends Component {
    render() {
        return (
            <OrdererInfo noid>거래처 정보 메인페이지입니다...
                <Card title="Statistics">
                    지금은 테스트중입니다...
                </Card>
                <Card title="Statistics" transparent>
                    지금은 테스트중입니다...
                </Card>
                <ChartCard/>
            </OrdererInfo>
        );
    }
}

export default NullInfoRoute;