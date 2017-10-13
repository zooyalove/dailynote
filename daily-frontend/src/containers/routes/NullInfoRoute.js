import React, { Component } from 'react';

import { OrdererInfo } from 'components/Orderer';
import ChartCard from 'components/ChartCard';

import * as api from 'helpers/WebApi/orderer';

class NullInfoRoute extends Component {
    componentDidMount() {
        api.getOrdererStatistics()
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        return (
            <OrdererInfo noid>
                <div className="statinfo_wrapper">
                    <ChartCard id="orderer-chart"
                            loading
                            type="bar"
                            options={{}}
                            series={[[3,5,1,6,67,7]]}
                            title="★ 1년간 데이터 비교"
                            width="100%"/>
                    <ChartCard id="orderer-chart2"
                            loading={false}
                            type="pie"
                            options={{}}
                            series=""
                            width="100%"/>
                </div>
            </OrdererInfo>
        );
    }
}

export default NullInfoRoute;