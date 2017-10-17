import React from 'react';
import classNames from 'classnames';
import styles from './InfoList.scss';

import InfoLabel from 'components/InfoLabel';

import * as utils from 'helpers/utils';

const cx = classNames.bind(styles);

const info_maps = [
    'phone',
    'manager',
    'manager_phone',
    'address',
    'def_ribtext',
    'description'
];

const label_maps = {
    phone: '전화번호',
    manager: '담당자',
    manager_phone: '담당자 전화번호',
    address: '주 소',
    def_ribtext: '리본글씨',
    description: '설명'
};

const InfoList = ({
    list
}) => {
    const { ordererInfo, data } = list;
    const { date } = ordererInfo;

    const infos = info_maps.map((info, i) => {
        if (utils.empty(ordererInfo[info])) return "";
        return (<InfoLabel key={i} label={label_maps[info]} info={ordererInfo[info]} />);
    });

    return (
        <div className={cx('infolist_wrapper')}>
            {infos}
            <InfoLabel label="최근 1년간 주문상황" info={(utils.empty(data) ? '등록된 건수가 없습니다' : data.totalPrice.toLocaleString()+'원 ('+data.count+'건)')} />
            <InfoLabel label="등록일자" info={(date.created === undefined ? '' : new Date(date.created).toLocaleString())} />
        </div>
    );
};

export default InfoList;