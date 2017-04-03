import React from 'react';

const UserInfo = ({ username, onLogOut }) => {
	return (
		<div className="user-info">
			<div className="user-name">
				{username}
			</div>
			<div className="logout-btn" onClick={onLogOut}>
				LOGOUT
			</div>
		</div>
	);
};

export default UserInfo;