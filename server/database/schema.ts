import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  telegramId: integer("telegram_id").notNull().unique(),
  avatar: text("avatar").notNull().default(""),
  secondName: text("second_name").notNull().default(""),
  firstName: text("first_name").notNull(),
  gas: integer("gas").notNull().default(0),
  isPremium: boolean("is_premium").notNull(), // 0 - not premium, 1 - premium
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userClaims = pgTable("user-claims", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  claimedAt: timestamp("claimed_at").notNull().defaultNow(),
  amount: integer("amount").notNull().default(0),
});

export const userCar = pgTable("user-car", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  engineLvl: integer("engine_lvl").notNull().default(1),
  chassisLvl: integer("chassis_lvl").notNull().default(1),
  brakesLvl: integer("brakes_lvl").notNull().default(1),
  visualLvl: integer("visual_lvl").notNull().default(1),
});

export const userFriends = pgTable("user-friends", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  friendId: integer("friend_id")
    .notNull()
    .references(() => users.id),
});

export const userFriendRewards = pgTable("user-friend-rewards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  friendId: integer("friend_id")
    .notNull()
    .references(() => users.id),
  amount: integer("amount").notNull().default(0),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  logo: text("text").notNull(),
  name: text("text").notNull(),
  reward: integer("reward").notNull(),
  url: text("url").notNull(),
});

export const userTasks = pgTable("user-tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  taskId: integer("task_id")
    .notNull()
    .references(() => tasks.id),
  status: boolean("status").notNull().default(false),
});

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  playedAt: timestamp("played_at").notNull().defaultNow(),
  winnerId: integer("winner_id")
    .notNull()
    .references(() => users.id),
  loserId: integer("loser_id")
    .notNull()
    .references(() => users.id),
});
