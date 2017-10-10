import React, { Component } from 'react';
import { core as ZingChart } from 'zingchart-react';

import Card from 'components/Card';

const myConfig = {
    type: "bar",
    series : [
        {
            values : [35,42,67,89,25,34,67,85]
        },
        {
            values : [12,34,25,68,94,25,16,37]
        }

    ]
};

class ChartCard extends Component {

    render() {
        return (
            <Card>
                <ZingChart id="orderer-chart" data={myConfig} height="300" width="600" />
            </Card>
        );
    }
}

export default ChartCard;