import { type Request } from "express";
import type { GetTasksOptions, TaskStatus, TaskSortField, SortOrder } from "./task.repository.js";

type ValidationResult = { success: true; data: Omit<GetTasksOptions, "ownerId"> } | { success: false; message: string };

const statuses: TaskStatus[] = [
	"open",
	"in_progress",
	"completed",
];

const sortFields: TaskSortField[] = [
	"status",
	"dueDate",
	"createdAt",
];

function parseInteger(
	value: unknown,
	defaultValue: number,
	field: string,
	minimum: number,
	maximum?: number,
): number {
	if (value === undefined) return defaultValue;

	if (typeof value !== "string" || !/^\d+$/.test(value)) {
		throw new Error(`${field} must be an integer.`);
	}

	const parsed = Number(value);

	if (!Number.isSafeInteger(parsed) || parsed < minimum || (maximum !== undefined && parsed > maximum)) {
		throw new Error(`${field} is outside the allowed range.`);
	}

	return parsed;
}

export function validateGetTasksQuery(req: Request): ValidationResult {
	try {
		const page = parseInteger(req.query.page, 1, "page", 1);
		const limit = parseInteger(req.query.limit, 10, "limit", 1, 100);

		const rawStatus = req.query.status;
		let status: TaskStatus | undefined;

		if (rawStatus !== undefined) {
			if (typeof rawStatus !== "string" || !statuses.includes(rawStatus as TaskStatus)) {
				return {
					success: false,
					message: "Invalid status.",
				};
			}

			status = rawStatus as TaskStatus;
		}

		const rawSortBy = req.query.sortBy ?? "createdAt";

		if (typeof rawSortBy !== "string" || !sortFields.includes(rawSortBy as TaskSortField)) {
			return {
				success: false,
				message: "Invalid sortBy value.",
			};
		}

		const rawOrder = req.query.order ?? "desc";

		if (typeof rawOrder !== "string" || !["asc", "desc"].includes(rawOrder)) {
			return {
				success: false,
				message: "Invalid order value",
			};
		}

		return {
			success: true,
			data: {
				page,
				limit,
				status,
				sortBy: rawSortBy as TaskSortField,
				order: rawOrder as SortOrder,
			}
		};
	} catch (error) {
		return {
			success: false,
			message: error instanceof Error ? error.message : "Invalid query parameters"
		}
	}
}