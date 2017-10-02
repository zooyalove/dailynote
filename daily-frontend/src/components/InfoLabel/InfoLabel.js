import React from 'react';
import classNames from 'classnames';
import styles from './InfoLabel.scss';

const cx = classNames.bind(styles);

const InfoLabel = ({
    label,
    info
}) => {
    return (
        <div className={cx('info_label')}>
            <div className={cx('label')}>{label}</div>
            <div className={cx('info')}>{info}</div>
        </div>
    );
};

export default InfoLabel;