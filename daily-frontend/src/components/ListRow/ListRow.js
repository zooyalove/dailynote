import React from 'react';
import moment from 'moment';
import classNames from 'classnames';
import styles from './ListRow.scss';

import ListColumn from 'components/ListColumn';

const cx = classNames.bind(styles);

const ListRow = ({
    data,
    children
}) => {
    const { delivery, receiver } = data;
    // console.log('List Row data :', data);

    const deliveries = Object.keys(delivery).map((d, i) => {
        if (d === 'date') {
            let dates = moment(new Date(delivery[d])).format('YYYY-MM-DD A hh시 mm분');
            dates = dates.replace('AM', '오전').replace('PM', '오후');
            return <ListColumn key={i} text={dates} center date />;
        } else if (d === 'address') {
            return <ListColumn key={i} text={delivery[d]} address />;
        } else if (d === 'price') {
            return <ListColumn key={i} text={delivery[d].toLocaleString()} right />;
        }

        return <ListColumn key={i} text={delivery[d]} center />;
    });

    const recv = Object.keys(receiver).map((r, i) => {
        return <ListColumn key={i} text={receiver[r]} center />;
    });

    return (
        <div className={cx('list-row')}>
            {recv}
            {deliveries}
        </div>
    );
};

export default ListRow;