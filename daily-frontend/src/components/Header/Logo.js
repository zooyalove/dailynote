import React from 'react';
import { Link } from 'react-router';
import { Icon } from 'semantic-ui-react';

const Logo = ({
	active,
	onSidebarClick
}) => {
	return (
		<div className="logo-wrapper">
			<div className={`hamburger${active ? ' active': ''}`} onClick={onSidebarClick}>
				<Icon name="sidebar" size="large" />
			</div>
			<Link to="/" className="logo">DailyNote</Link>
		</div>
	);
}

export default Logo;