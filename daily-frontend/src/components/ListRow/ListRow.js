import React from 'react';
import classNames from 'classnames';
import styles from './ListRow.scss';

import ListColumn from 'components/ListColumn';

const cx = classNames.bind(styles);

const ListRow = ({
    data
}) => {
    const columns = data.map((c, i) => {
        if ( i === 0 ) return (<ListColumn key={i} center >{c}</ListColumn>);
        return (<ListColumn key={i}>{c}</ListColumn>);
    });

    return (
        <div className={cx('list-row')}>
            {columns}
        </div>
    );
};

export default ListRow;