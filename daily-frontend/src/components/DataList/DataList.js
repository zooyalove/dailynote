import React from 'react';
import classNames from 'classnames';
import styles from './DataList.scss';

import ListRow from 'components/ListRow';
import ListColumn from 'components/ListColumn';

const cx = classNames.bind(styles);

const header = ['받는사람', '전화번호', '상품종류', '배달장소', '배송일자', '가격'].map((h, i) => {
    if ( h === '배달장소' ) {
        return (<ListColumn key={i} center bold address>{h}</ListColumn>);
    } else if ( h === '배송일자' ) {
        return (<ListColumn key={i} center bold date>{h}</ListColumn>);
    }
    return (<ListColumn key={i} center bold>{h}</ListColumn>);
});

const DataList = ({
    datalist,
    hide
}) => {
    const datas = datalist.map((d, i) => {
        return (<ListRow key={i} data={d} />);
    });

    const animation = !hide ? 'flipInX' : '';

    return (
        <div className={cx('data-list-wrapper', { hide }, animation)}>
            <div className={cx('header_row')}>
                {header}
            </div>
            {datas}
        </div>
    );
};

export default DataList;