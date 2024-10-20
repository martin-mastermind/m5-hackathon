PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_games` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`played_at` integer DEFAULT '"2024-10-20T13:46:53.169Z"' NOT NULL,
	`winner_id` integer NOT NULL,
	`loser_id` integer NOT NULL,
	FOREIGN KEY (`winner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`loser_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_games`("id", "played_at", "winner_id", "loser_id") SELECT "id", "played_at", "winner_id", "loser_id" FROM `games`;--> statement-breakpoint
DROP TABLE `games`;--> statement-breakpoint
ALTER TABLE `__new_games` RENAME TO `games`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_user-claims` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`claimed_at` integer DEFAULT '"2024-10-20T13:46:53.169Z"' NOT NULL,
	`amount` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_user-claims`("id", "user_id", "claimed_at", "amount") SELECT "id", "user_id", "claimed_at", "amount" FROM `user-claims`;--> statement-breakpoint
DROP TABLE `user-claims`;--> statement-breakpoint
ALTER TABLE `__new_user-claims` RENAME TO `user-claims`;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`telegram_id` integer NOT NULL,
	`avatar` text DEFAULT '' NOT NULL,
	`second_name` text DEFAULT '' NOT NULL,
	`first_name` text NOT NULL,
	`gas` integer DEFAULT 0 NOT NULL,
	`is_premium` integer NOT NULL,
	`created_at` integer DEFAULT '"2024-10-20T13:46:53.168Z"' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "telegram_id", "avatar", "second_name", "first_name", "gas", "is_premium", "created_at") SELECT "id", "telegram_id", "avatar", "second_name", "first_name", "gas", "is_premium", "created_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_telegram_id_unique` ON `users` (`telegram_id`);