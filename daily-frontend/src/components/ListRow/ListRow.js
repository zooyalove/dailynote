import React from 'react';
import classNames from 'classnames';
import styles from './ListRow.scss';

import ListColumn from 'components/ListColumn';

const cx = classNames.bind(styles);

const ListRow = ({
    data
}) => {
    console.log('List Row data :', data);

    const columns = Object.keys(data).map((k, i) => {
        if ( k === '_id' || k === '__v' ) return '';
        // return (<ListColumn key={i} center >{c}</ListColumn>);
        return (<ListColumn key={i} text={data[k]} />);
    });

    return (
        <div className={cx('list-row')}>
            {columns}
        </div>
    );
};

export default ListRow;