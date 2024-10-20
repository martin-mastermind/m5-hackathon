import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  telegramId: integer('telegram_id').notNull(),
  avatar: text('avatar').notNull().default(''),
  secondName: text('second_name').notNull().default(''),
  firstName: text('first_name').notNull().default(''),
  gas: integer('gas').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
})

export const userClaims = sqliteTable('user-claims', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  claimedAt: integer('claimed_at', { mode: 'timestamp' }).notNull().default(new Date()),
  amount: integer('amount').notNull().default(0),
})

export const userCar = sqliteTable('user-car', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  engineLvl: integer('engine_lvl').notNull().default(1),
  chassisLvl: integer('chassis_lvl').notNull().default(1),
  brakesLvl: integer('brakes_lvl').notNull().default(1),
  visualLvl: integer('visual_lvl').notNull().default(1),
})

export const userFriends = sqliteTable('user-friends', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  friendId: integer('friend_id')
    .notNull()
    .references(() => users.id),
})

export const tasks = sqliteTable('tasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  logo: text('text').notNull(),
  name: text('text').notNull(),
  reward: integer('reward').notNull(),
  url: text('url').notNull(),
})

export const userTasks = sqliteTable('user-tasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  taskId: integer('task_id')
    .notNull()
    .references(() => tasks.id),
  status: integer('status').notNull().default(0), // 0 - not completed, 1 - completed
})

export const games = sqliteTable('games', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  playedAt: integer('played_at', { mode: 'timestamp' }).notNull().default(new Date()),
  winnerId: integer('winner_id')
    .notNull()
    .references(() => users.id),
  loserId: integer('loser_id')
    .notNull()
    .references(() => users.id),
})
