import type { Request } from "express";
import type { TaskStatus } from "./task.repository.js";

type ValidationResult = { success: true; data: { status: TaskStatus } } | { success: false; message: string };

const statuses: TaskStatus[] = [
	"open",
	"in_progress",
	"completed",
]

export function validateUpdateTaskBody(req: Request): ValidationResult {
	const body: unknown = req.body;

	if (typeof body !== "object" || body === null || Array.isArray(body)) {
		return {
			success: false,
			message: "Request body must be a JSON object.",
		};
	}

	const input = body as Record<string, unknown>;

	const unknownFields = Object.keys(input).filter((key) => key !== "status");

	if (unknownFields.length > 0) {
		return {
			success: false,
			message: `Unknown field(s): ${unknownFields.join(", ")}.`,
		};
	}

	if (typeof input.status !== "string" || !statuses.includes(input.status as TaskStatus)) {
		return {
			success: false,
			message: "status must be open, in_progress, or completed.",
		};
	}

	return {
		success: true,
		data: {
			status: input.status as TaskStatus,
		},
	};
}