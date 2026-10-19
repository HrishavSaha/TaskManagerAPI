import type { Request } from "express";

export interface RegisterInput {
	email: string;
	username: string;
	password: string;
}

type ValidationResult = { success: true; data: RegisterInput } | { success: false; message: string };

export function validateRegisterBody(req: Request): ValidationResult {
	const body: unknown = req.body;

	if (typeof body !== "object" || body === null || Array.isArray(body)) {
		return {
			success: false,
			message: "Request body must be a JSON object.",
		};
	}

	const input = body as Record<string, unknown>;

	const allowedFields = new Set([
		"email",
		"username",
		"password",
	]);

	const unknownFields = Object.keys(input).filter((key) => !allowedFields.has(key));

	if (unknownFields.length > 0) {
		return {
			success: false,
			message: `Unknown field(s): ${unknownFields.join(", ")}.`,
		};
	}

	if (typeof input.email !== "string") {
		return {
			success: false,
			message: "email is required and must be a string.",
		};
	}

	if (input.email.trim().length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim().toLowerCase())) {
		return {
			success: false,
			message: "A valid email address is required.",
		};
	}

	const email = input.email.trim().toLowerCase();

	if (typeof input.username !== "string") {
		return {
			success: false,
			message: "username is required and must be a string.",
		};
	}

	if (!/^[a-z0-9_]{3,30}$/.test(input.username.trim().toLowerCase())) {
		return {
			success: false,
			message: "username must contain 3-30 letters, numbers, or underscores.",
		};
	}

	const username = input.username.trim().toLowerCase();

	if (typeof input.password !== "string") {
		return {
			success: false,
			message: "password is required and must be a string.",
		};
	}

	const passwordBytes = Buffer.byteLength(input.password, "utf8");

	if (passwordBytes < 12 || passwordBytes > 72) {
		return {
			success: false,
			message: "password must be between 12 and 72 UTF-8 bytes.",
		};
	}

	const password = input.password;

	return {
		success: true,
		data: {
			email,
			username,
			password,
		},
	};
}