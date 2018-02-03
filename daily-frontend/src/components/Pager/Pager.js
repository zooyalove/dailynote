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
            className={`pager ${className ? className : 'pager-number'}${active ? ' active' : ''}`}
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
    hide,
    onPageClick
}) => {

    const dataLength = (datas.length > 0) ? datas.length : 0;

    let totalPage = Math.ceil(dataLength/countPerPage);
    if (totalPage === 0) totalPage = 1;
    
    const pagenumber = [];

    if (dataLength === 0 || totalPage === 1) {
        pagenumber.push(<PageNumber key={1} page={1} active onClick={() => {}} style={{cursor: 'default'}} />);
    } else {
        let i, j;
        if (totalPage <= displayPage) {
            i = 1; j = totalPage + 1;
        } else {
            i = current; j = current + displayPage;
        }
        for(i; i<j; i++) {
            if (i > totalPage) {
                break;
            } else {
                pagenumber.push(<PageNumber key={i} page={i} active={(current === i) ? true : false} onClick={onPageClick} />);
            }
        }
    }

    return (
        <ul className={`pager-wrapper${hide ? ' hide' : ''}`}>
            { (current !== 1) && <FirstPage onClick={onPageClick} /> }
            { (current !== 1) && <PrevPage page={(current === 1 ? 1 : (current - 1))} onClick={onPageClick} /> }
            {pagenumber}
            { (current !== totalPage) && <NextPage page={(current === totalPage ? totalPage : (current + 1))} onClick={onPageClick} /> }
            { (current !== totalPage) && <LastPage page={totalPage} onClick={onPageClick} /> }
        </ul>
    );
};

export default Pager;