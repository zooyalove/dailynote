import React from 'react';
import { Icon } from 'semantic-ui-react';
import classNames from 'classnames';
import styles from './Pager.scss';

const cx = classNames.bind(styles);

const PageNumber = ({
    page,
    className,
    children,
    onClick
}) => {
    return (
        <li
            className={`${className ? className : 'pager-number'}`}
            onClick={() => onClick(page)}
        >
            {children ? children : page}
        </li>
    );
}

const FirstPage = () => {
    return <PageNumber page={1} className="pager-first"><Icon name="fast backward" /></PageNumber>
}

const LastPage = ({page}) => {
    return <PageNumber page={page} className="pager-last"><Icon name="fast forward" /></PageNumber>
}

const PrevPage = ({page}) => {
    return <PageNumber page={page} className="pager-prev"><Icon name="" /></PageNumber>
}

const NextPage = ({page}) => {
    return <PageNumber page={page} className="pager-next"><Icon name="" /></PageNumber>
}

const Pager = ({
    current,
    countPerPage=10,
    displayPage=5,
    datas=[],
    onPageClick
}) => {

    const dataLength = (datas.length > 0) ? datas.length : 0;
    const totalPage = Math.ceil(dataLength/countPerPage);

    return (
        <ul className={cx('pager-wrapper')}>
            <FirstPage />
            <PrevPage page={(current === 1 ? 1 : (current - 1))} />
            <NextPage page={(current === totalPage ? totalPage : (current + 1))} />
            <LastPage page={totalPage} />
        </ul>
    );
};

export default Pager;