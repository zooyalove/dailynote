import React from 'react';
import classNames from 'classnames';
import styles from './DataList.scss';

import ListRow from 'components/ListRow';
import ListColumn from 'components/ListColumn';

const cx = classNames.bind(styles);

const DataList = ({
    datalist,
    startIndex,
    ordererView,
    animation,
    hide,
    ...rest
}) => {
    const hList = ordererView
                    ? ['№', '주문자', '주문자연락처', '받는사람', '전화번호', '상품종류', '배달장소', '글씨', '배송일자', '가격']
                    : ['№', '받는사람', '전화번호', '상품종류', '배달장소', '배송일자', '가격']
    const header = hList.map((h, i) => {
        if ( h === '상품종류') {
            return (<ListColumn key={i} center bold className="category">{h}</ListColumn>);
        } else if ( h === '배달장소' ) {
            return (<ListColumn key={i} center bold address>{h}</ListColumn>);
        } else if ( h === '배송일자' ) {
            return (<ListColumn key={i} center bold date>{h}</ListColumn>);
        } else if ( h === '№') {
            return (<ListColumn key={i} center bold className="no">{h}</ListColumn>);
        }
        return (<ListColumn key={i} center bold>{h}</ListColumn>);
    });
    
    let datas;

    if (!datalist || datalist.length === 0) {
        datas = (<ListRow data={null} />);
    } else {
        let index = startIndex;

        datas = datalist.map((d, i) => {
            return (<ListRow key={i} index={index--} data={d} ordererView={ordererView} />);
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