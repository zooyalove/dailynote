import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';
import { Link } from 'react-router';

const MenuItem = ({ children, color, content, icon, to, onClick }) => {
    return (
    	<Popup
        	trigger={
	          	<Link to={to} activeClassName="active" className={`menuitem ${color}`} onClick={onClick} >
	            	<Icon name={icon} />
	        	</Link>
	        }
        	content={content}
        	position='right center' />
    );
};

export default MenuItem;