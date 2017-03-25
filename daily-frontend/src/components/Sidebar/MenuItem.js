import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';
import { Link } from 'react-router';

const MenuItem = ({ children, color, content, icon, to }) => {
    return (
    	<Popup
        	trigger={
	          	<Link to={to} activeClassName="active" className={`menuitem ${color}`} >
	            	<Icon name={icon} />
	        	</Link>
	        }
        	content={content}
        	positioning='right center' />
    );
};

export default MenuItem;