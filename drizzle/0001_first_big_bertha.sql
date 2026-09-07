CREATE TABLE `foreignNumbers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`phoneNumber` varchar(40) NOT NULL,
	`country` varchar(80) NOT NULL,
	`service` varchar(50) NOT NULL,
	`otpCode` varchar(16),
	`status` varchar(30) NOT NULL DEFAULT 'waiting',
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `foreignNumbers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productType` varchar(40) NOT NULL,
	`packageName` varchar(120) NOT NULL,
	`priceUsd` decimal(12,2) NOT NULL,
	`status` varchar(30) NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`fullName` text,
	`email` varchar(320),
	`walletBalance` decimal(12,2) NOT NULL DEFAULT '0.00',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `proxies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`ip` varchar(64) NOT NULL,
	`port` int NOT NULL,
	`username` varchar(128),
	`password` varchar(128),
	`country` varchar(80) NOT NULL,
	`type` varchar(30) NOT NULL,
	`status` varchar(30) NOT NULL DEFAULT 'active',
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `proxies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tempEmailMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tempEmailId` int NOT NULL,
	`fromEmail` varchar(320),
	`subject` text,
	`body` text,
	`otpCode` varchar(16),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tempEmailMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tempEmails` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`email` varchar(320) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tempEmails_id` PRIMARY KEY(`id`),
	CONSTRAINT `tempEmails_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `walletTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` varchar(30) NOT NULL,
	`amountUsd` decimal(12,2) NOT NULL,
	`method` varchar(40),
	`status` varchar(30) NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `walletTransactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `walletBalance` decimal(12,2) DEFAULT '0.00' NOT NULL;--> statement-breakpoint
ALTER TABLE `foreignNumbers` ADD CONSTRAINT `foreignNumbers_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `profiles` ADD CONSTRAINT `profiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `proxies` ADD CONSTRAINT `proxies_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tempEmailMessages` ADD CONSTRAINT `tempEmailMessages_tempEmailId_tempEmails_id_fk` FOREIGN KEY (`tempEmailId`) REFERENCES `tempEmails`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tempEmails` ADD CONSTRAINT `tempEmails_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `walletTransactions` ADD CONSTRAINT `walletTransactions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;