delimiter $$

CREATE DATABASE `wordtoth_a2b` /*!40100 DEFAULT CHARACTER SET utf8 */$$

delimiter $$

CREATE TABLE `task` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `parentTaskId` int(10) unsigned DEFAULT NULL,
  `category` varchar(45) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `start` bigint(20) unsigned DEFAULT NULL,
  `end` bigint(20) unsigned DEFAULT NULL,
  `duration` bigint(20) unsigned DEFAULT NULL,
  `inProgress` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8$$

delimiter $$

CREATE TABLE `todolist` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8$$

delimiter $$

CREATE TABLE `todotask` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(100) NOT NULL,
  `notes` longtext,
  `created` bigint(20) unsigned NOT NULL,
  `isComplete` tinyint(4) NOT NULL,
  `downstreamTaskId` int(11) DEFAULT NULL,
  `todoCollectionId` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=563 DEFAULT CHARSET=utf8$$

