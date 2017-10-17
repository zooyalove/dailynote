import React from 'react';
import classNames from 'classnames';
import styles from './AnimMoreButton.scss';

const cx = classNames.bind(styles);

const AnimMoreButton = ({
    active,
    onMoreClick
}) => {
    return (
        <div className={cx('anim-more-wrapper')}>
            <div className={cx('circle-wrapper', {active})} onClick={onMoreClick}>
                <div className={cx('circle')}>
                    <div className={cx('more-icon')}>
                        <div className={cx('center-chevron')} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnimMoreButton;