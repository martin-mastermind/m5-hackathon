import { drizzle } from 'drizzle-orm/d1'
export { sql, eq, and, or } from 'drizzle-orm'

import * as schema from '../database/schema'

export const tables = schema

export const useDrizzle = () => drizzle(hubDatabase(), { schema })

export type User = typeof schema.users.$inferSelect

export type UserClaim = typeof schema.userClaims.$inferSelect

export type UserCar = typeof schema.userCar.$inferSelect

export type UserFriend = typeof schema.userFriends.$inferSelect

export type UserTask = typeof schema.userTasks.$inferSelect

export type Game = typeof schema.games.$inferSelect

export type Task = typeof schema.tasks.$inferSelect
