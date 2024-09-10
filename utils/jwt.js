import jwt from "jsonwebtoken";

const generateToken = (user) => {
	const payload = {
		id: user._id,
		email: user.email,
		role: user.role,
		iat: Math.floor(Date.now() / 1000),
		exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
	};

	const token = jwt.sign(payload, process.env.JWT_SECRET);

	return token;
};

export default generateToken;
