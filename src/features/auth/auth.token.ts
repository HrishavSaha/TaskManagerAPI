import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
	throw new Error("JWT_SECRET is not configured.");
}

const issuer = "task-management-api";
const audience = "task-management-api";

export function createAccessToken(userId: string): string {
	return jwt.sign({}, jwtSecret!, {
		subject: userId,
		expiresIn: "15m",
		issuer,
		audience,
		algorithm: "HS256",
	});
}