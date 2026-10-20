import { pool } from "../../config/database.js";

export interface PublicUser {
	id: string;
	email: string;
	username: string;
	createdAt: Date;
}

export interface LoginUser {
	id: string;
	email: string;
	username: string;
	password: string;
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

export async function findUserByEmail(email: string) {
	const searchSql = `
		SELECT
			id,
			email,
			username,
			password_hash as "passwordHash"
		FROM users
		WHERE email = $1
		LIMIT 1
	`

	const searchResult = await pool.query(searchSql, [email]);

	return searchResult.rows[0] ?? null;
}