import React from 'react';
import { Link } from 'react-router';

const Logo = () => {
	return (
		<Link to="/"><div className="logo">DailyNote</div></Link>
	);
}

export default Logo;