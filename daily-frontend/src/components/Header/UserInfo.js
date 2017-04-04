import React from 'react';
import { Icon } from 'semantic-ui-react';

const UserInfo = ({ username, onLogOut }) => {
	return (
		<div className="user-info">
			<div className="user-name">
				<Icon name="user" />{username}
			</div>
			<div className="logout-btn" onClick={() => onLogOut()}>
				<Icon name="log out" />LOGOUT
			</div>
		</div>
	);
};

export default UserInfo;