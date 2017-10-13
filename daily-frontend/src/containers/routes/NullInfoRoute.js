import React, { Component } from 'react';
import { Loader } from 'semantic-ui-react';

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
                    <ChartCard id="orderer-chart" title="★ 1년간 데이터 비교" noData={<Loader />} width="100%"/>
                    <ChartCard id="orderer-chart2" width="100%"/>
                </div>
            </OrdererInfo>
        );
    }
}

export default NullInfoRoute;