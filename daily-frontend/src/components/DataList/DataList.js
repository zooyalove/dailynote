import React from 'react';
import classNames from 'classnames';
import styles from './DataList.scss';

import ListRow from 'components/ListRow';

const cx = classNames.bind(styles);

const DataList = ({
    datalist
}) => {
    const datas = datalist.map((d, i) => {
        return (<ListRow key={i} data={d} />);
    });

    return (
        <div className={cx('data-list-wrapper')}>
            {datas}
        </div>
    );
};

export default DataList;