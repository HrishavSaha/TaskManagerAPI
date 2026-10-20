import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { isValidUUID } from "../tasks/task-id.validation.js";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
	throw new Error("JWT_SECRET is not configured.");
}

const issuer = "task-management-api";
const audience = "task-management-api";

interface AccessTokenClaims {
	sub: string;
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
	const authorisation = req.header("Authorization");

	if (!authorisation?.startsWith("Bearer ")) {
		res.status(401).json({
			error: {
				code: "UNAUTHORIZED",
				message: "A valid access token is required."
			}
		});
		return;
	}

	const token = authorisation.slice("Bearer ".length).trim();

	if (!token) {
		res.status(401).json({
			error: {
				code: "UNAUTHORIZED",
				message: "A valid access token is required."
			}
		});
		return;
	}

	try {
		const payload = jwt.verify(token, jwtSecret!, {
			algorithms: ["HS256"],
			issuer,
			audience,
		});

		if (typeof payload === "string" || typeof payload.sub !== "string" || !isValidUUID(payload.sub)) {
			res.status(401).json({
				error: {
					code: "UNAUTHORIZED",
					message: "A valid access token is required."
				}
			});
			return;
		}

		req.user = { id: payload.sub };
		next();
	} catch {
		res.status(401).json({
			error: {
				code: "UNAUTHORIZED",
				message: "A valid access token is required."
			}
		});
		return;
	}
}