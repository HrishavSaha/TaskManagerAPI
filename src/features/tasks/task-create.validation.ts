import { type Request } from "express";
import { type TaskStatus } from "./task.repository.js";

export interface CreateTaskInput {
	title: string;
	description?: string;
	status: TaskStatus;
	dueDate?: string;
}

type ValidationResult = { success: true; data: CreateTaskInput } | { success: false; message: string };

const allowedFields = new Set([
	'title',
	'description',
	'status',
	'dueDate',
]);

const statuses: TaskStatus[] = [
	"open",
	"in_progress",
	"completed",
];

function isValidDate(value: string): boolean {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
		return false;
	}
	
	const date = new Date(`${value}T00:00:00.000Z`);

	return (!Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value);
}

export function validateCreateTaskBody(req: Request): ValidationResult {
	const body: unknown = req.body;

	if (typeof body !== "object" || body === null || Array.isArray(body)) {
		return {
			success: false,
			message: "Request body must be a JSON object."
		};
	}

	const input = body as Record<string, unknown>;

	const unknownFields = Object.keys(input).filter((key) => !allowedFields.has(key));

	if (unknownFields.length > 0) {
		return {
			success: false,
			message: `Unknown field(s): ${unknownFields.join(", ")}.`,
		};
	}

	if (typeof input.title !== "string") {
		return {
			success: false,
			message: "title is required and must be a string.",
		};
	}
	
	if (input.title.trim().length < 1 || input.title.trim().length > 120) {
		return {
			success: false,
			message: "title must be between 1 and 120 characters."
		};
	}
	
	const title = input.title.trim();

	if (input.description !== undefined) {
		if (typeof input.description !== "string") {
			return {
				success: false,
				message: "description must be a string.",
			};
		}

		if (input.description.length > 2000) {
			return {
				success: false,
				message: "description must not exceed 2000 characters.",
			};
		}

	}
	
	const description = input.description;

	if (typeof input.status !== "string" || !statuses.includes(input.status as TaskStatus)) {
		return {
			success: false,
			message: "status must be open, in_progress, or completed.",
		};
	}

	const status = input.status as TaskStatus;

	if (input.dueDate !== undefined) {
		if (typeof input.dueDate !== "string" || !isValidDate(input.dueDate)) {
			return {
				success: false,
				message: "dueDate must be a valid date in YYYY-MM-DD format.",
			};
		}
	}

	const dueDate = input.dueDate;

	return {
		success: true,
		data: {
			title,
			description,
			status,
			dueDate
		},
	};
}