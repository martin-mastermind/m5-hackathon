import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../database/schema";

export { sql, eq, and, or } from "drizzle-orm";

export const tables = schema;

const sql = neon(process.env.DATABASE_URL as string);
export const useDrizzle = () => drizzle({ client: sql, schema });

export type User = typeof schema.users.$inferSelect;

export type UserClaim = typeof schema.userClaims.$inferSelect;

export type UserCar = typeof schema.userCar.$inferSelect;

export type UserFriend = typeof schema.userFriends.$inferSelect;

export type UserTask = typeof schema.userTasks.$inferSelect;

export type Game = typeof schema.games.$inferSelect;

export type Task = typeof schema.tasks.$inferSelect;
