import React, { Component } from 'react';
import { OrdererInfo } from 'components/Orderer';
import Card from 'components/Card';
import ChartCard from 'components/ChartCard';

class NullInfoRoute extends Component {
    render() {
        return (
            <OrdererInfo noid>
                <ChartCard/>
            </OrdererInfo>
        );
    }
}

export default NullInfoRoute;