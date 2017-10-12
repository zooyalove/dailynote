import React, { Component } from 'react';
import { OrdererInfo } from 'components/Orderer';
import ChartCard from 'components/ChartCard';

class NullInfoRoute extends Component {
    render() {
        return (
            <OrdererInfo noid>
                <div style={{display:'flex'}}>
                    <ChartCard id="orderer-chart"/>
                    <ChartCard id="orderer-chart2"/>
                </div>
            </OrdererInfo>
        );
    }
}

export default NullInfoRoute;