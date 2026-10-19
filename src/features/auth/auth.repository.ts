import { pool } from "../../config/database.js";

export interface PublicUser {
	id: string;
	email: string;
	username: string;
	createdAt: Date;
}

export async function createUser(email: string, username: string, passwordHash: string) {
	const insertSql = `
		INSERT INTO users (email, username, password_hash)
		VALUES ($1, $2, $3)
		RETURNING
			id,
			email,
			username,
			created_at as "createdAs"
	`

	const values = [email, username, passwordHash];

	const insertResult = await pool.query(insertSql, values);

	return insertResult.rows[0];
}