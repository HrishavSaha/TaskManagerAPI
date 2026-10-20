import type { Request } from "express";

export interface LoginInput {
	email: string;
	password: string;
}

type ValidationResult = { success: true; data: LoginInput } | { success: false; message: string };

export function validateLoginBody(req: Request): ValidationResult {
	const body: unknown = req.body;

	if (typeof body !== "object" || body === null || Array.isArray(body)) {
		return {
			success: false,
			message: "Request body must be a JSON object.",
		};
	}

	const input = body as LoginInput;

	const allowedFields = new Set([
		"email",
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
			password,
		},
	};
}