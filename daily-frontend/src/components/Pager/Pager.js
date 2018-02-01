import React from 'react';
import { Icon } from 'semantic-ui-react';
import './Pager.scss';

const PageNumber = ({
    page,
    active,
    className,
    children,
    onClick,
    ...rest
}) => {
    return (
        <li
            className={`${className ? className : 'pager-number'}${active ? ' active' : ''}`}
            onClick={() => onClick(page)}
            {...rest}
        >
            {children ? children : page}
        </li>
    );
}

const FirstPage = ({onClick}) => {
    return <PageNumber page={1} className="pager-first" onClick={onClick}><Icon name="fast backward" /></PageNumber>
}

const LastPage = ({page, onClick}) => {
    return <PageNumber page={page} className="pager-last" onClick={onClick}><Icon name="fast forward" /></PageNumber>
}

const PrevPage = ({page, onClick}) => {
    return <PageNumber page={page} className="pager-prev" onClick={onClick}><Icon name="chevron left" /></PageNumber>
}

const NextPage = ({page, onClick}) => {
    return <PageNumber page={page} className="pager-next" onClick={onClick}><Icon name="chevron right" /></PageNumber>
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
    const pagenumber = [];

    if (dataLength === 0) {
        pagenumber.push(<PageNumber key={1} page={1} active={true} style={{cursor: 'default'}} />);
    } else {
        var i;

        if (totalPage <= displayPage) {
            for(i=1; i<=totalPage; i++) {
                pagenumber.push(<PageNumber key={i} page={i} active={(current === i) ? true : false} onClick={onPageClick} />);
            }
        } else {
            for(i=current; i<(current+displayPage); i++) {
                if (i > totalPage) {
                    break;
                } else {
                    pagenumber.push(<PageNumber key={i} page={i} active={(current === i) ? true : false} onClick={onPageClick} />)
                }
            }
        }
    }

    return (
        <ul className="pager-wrapper">
            <FirstPage onClick={onPageClick} />
            <PrevPage page={(current === 1 ? 1 : (current - 1))} onClick={onPageClick} />
            {pagenumber}
            <NextPage page={(current === totalPage ? totalPage : (current + 1))} onClick={onPageClick} />
            <LastPage page={totalPage} onClick={onPageClick} />
        </ul>
    );
};

export default Pager;