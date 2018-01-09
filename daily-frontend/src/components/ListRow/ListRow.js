import React from 'react';
import moment from 'moment';
import classNames from 'classnames';
import styles from './ListRow.scss';

import ListColumn from 'components/ListColumn';

const cx = classNames.bind(styles);

const ListRow = ({
    data,
    ordererView,
    children
}) => {
    if (!data) {
        return (
            <div className={cx('list-row')}>
                <ListColumn text="해당되는 내용이 없습니다!" center red />
            </div>
        );
    }

    const { delivery, receiver, orderer } = data;

    let oData = null;
    if (ordererView) {
        oData = Object.keys(orderer).map((o, i) => {
            if (o === '_id' || o === 'id') return null;
            return <ListColumn key={i} text={orderer[o]} center />;
        });
    }

    const deliveries = Object.keys(delivery).map((d, i) => {
        if (d === 'date') {
            let dates = moment(new Date(delivery[d])).format('YYYY-MM-DD A hh시 mm분');
            dates = dates.replace('AM', '오전').replace('PM', '오후');
            return <ListColumn key={i} text={dates} center date />;
        } else if (d === 'address') {
            return <ListColumn key={i} text={delivery[d]} address />;
        } else if (d === 'price') {
            return <ListColumn key={i} text={delivery[d].toLocaleString()} right />;
        } else if (d === 'category') {
            return <ListColumn key={i} text={delivery[d]} center className="category" />;
        }

        return <ListColumn key={i} text={delivery[d]} center />;
    });

    const recv = Object.keys(receiver).map((r, i) => {
        return <ListColumn key={i} text={receiver[r]} center />;
    });

    return (
        <div className={cx('list-row')}>
            {ordererView && oData}
            {recv}
            {deliveries}
        </div>
    );
};

export default ListRow;