import React from 'react';
import classNames from 'classnames';
import styles from './DataList.scss';

import ListRow from 'components/ListRow';
import ListColumn from 'components/ListColumn';

const cx = classNames.bind(styles);

const DataList = ({
    datalist,
    ordererView,
    animation,
    hide,
    ...rest
}) => {
    const hList = ordererView
                    ? ['주문자', '주문자연락처', '받는사람', '전화번호', '상품종류', '배달장소', '글씨', '배송일자', '가격']
                    : ['받는사람', '전화번호', '상품종류', '배달장소', '배송일자', '가격']
    const header = hList.map((h, i) => {
        if ( h === '배달장소' ) {
            return (<ListColumn key={i} center bold address>{h}</ListColumn>);
        } else if ( h === '배송일자' ) {
            return (<ListColumn key={i} center bold date>{h}</ListColumn>);
        }
        return (<ListColumn key={i} center bold>{h}</ListColumn>);
    });
    
    const oView = ordererView ? true : false;

    let datas;

    if (!datalist || datalist.length === 0) {
        datas = (<ListRow data={datalist} />);
    } else {
        datas = datalist.map((d, i) => {
            return (<ListRow key={i} data={d} ordererView={oView} />);
        });
    }

    const anim = (animation) ? (!hide ? 'flipInX' : '') : '';

    return (
        <div className={cx('data-list-wrapper', { hide }, anim)} {...rest}>
            <div className={cx('header-row')}>
                {header}
            </div>
            {datas}
        </div>
    );
};

export default DataList;