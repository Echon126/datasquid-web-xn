-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               5.6.14 - MySQL Community Server (GPL)
-- Server OS:                    Win64
-- HeidiSQL version:             7.0.0.4053
-- Date/time:                    2017-02-03 10:14:34
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET FOREIGN_KEY_CHECKS=0 */;

-- Dumping database structure for test
DROP DATABASE IF EXISTS `test`;
CREATE DATABASE IF NOT EXISTS `test` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `test`;


-- Dumping structure for table test.flow_model
DROP TABLE IF EXISTS `flow_model`;
CREATE TABLE IF NOT EXISTS `flow_model` (
  `modelId` int(11) NOT NULL,
  `modelName` varchar(100) NOT NULL,
  `modelData` text,
  `isUse` varchar(10) NOT NULL DEFAULT 'Y',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`modelId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table test.flow_model: ~0 rows (approximately)
DELETE FROM `flow_model`;
/*!40000 ALTER TABLE `flow_model` DISABLE KEYS */;
INSERT INTO `flow_model` (`modelId`, `modelName`, `modelData`, `isUse`, `createTime`) VALUES
	(1, 'aaa', 'aaaaaaaaaa', 'Y', '2016-09-19 20:45:51');
/*!40000 ALTER TABLE `flow_model` ENABLE KEYS */;


-- Dumping structure for table test.hms_user
DROP TABLE IF EXISTS `hms_user`;
CREATE TABLE IF NOT EXISTS `hms_user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'uuid',
  `username` varchar(20) NOT NULL,
  `userpwd` varchar(20) NOT NULL,
  `birthdy` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- Dumping data for table test.hms_user: ~15 rows (approximately)
DELETE FROM `hms_user`;
/*!40000 ALTER TABLE `hms_user` DISABLE KEYS */;
INSERT INTO `hms_user` (`id`, `username`, `userpwd`, `birthdy`) VALUES
	(1, '张山', '123456', '2013-11-07 14:30:44'),
	(2, '李四', '123456', '2013-10-29 14:30:48'),
	(3, '王五', '123456', '2013-11-07 02:30:44'),
	(4, 'ttt', 'aaa', '2016-01-01 12:21:21'),
	(5, 'ttt', 'aaa', '2016-01-01 12:21:21'),
	(6, 'ttt', 'aaa', '2016-01-01 12:21:21'),
	(7, 'ttt', 'aaa', '2016-01-01 12:21:21'),
	(8, 'ttt', 'aaa', '2016-01-01 12:21:21'),
	(9, 'ttt', 'aaa', '2016-01-01 12:21:21'),
	(10, 'ttt', 'aaa', '2016-01-01 12:21:21'),
	(11, 'ttt', 'aaa', '2016-01-01 12:21:21'),
	(12, 'ttt', 'aaa', '2016-01-01 12:21:21'),
	(13, 'ttt', 'aaa', '2016-01-01 12:21:21'),
	(14, 'ttt', 'aaa', '2016-01-01 12:21:21'),
	(15, 'ttt', 'aaa', '2016-01-01 12:21:21'),
	(16, 'ttt', 'aaa', '2016-01-01 12:21:21');
/*!40000 ALTER TABLE `hms_user` ENABLE KEYS */;


-- Dumping structure for table test.model
DROP TABLE IF EXISTS `model`;
CREATE TABLE IF NOT EXISTS `model` (
  `modelId` int(11) NOT NULL,
  `modelName` varchar(100) NOT NULL,
  `modelData` text,
  `isUse` varchar(10) NOT NULL DEFAULT 'Y',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`modelId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table test.model: ~0 rows (approximately)
DELETE FROM `model`;
/*!40000 ALTER TABLE `model` DISABLE KEYS */;
/*!40000 ALTER TABLE `model` ENABLE KEYS */;


-- Dumping structure for table test.model_node
DROP TABLE IF EXISTS `model_node`;
CREATE TABLE IF NOT EXISTS `model_node` (
  `nodeId` int(11) NOT NULL,
  `nodeName` varchar(100) NOT NULL,
  `nodeData` text,
  `nodeSource` varchar(500) DEFAULT NULL,
  `nodeTarget` varchar(500) DEFAULT NULL,
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modelId` int(11) DEFAULT NULL,
  `methodId` int(11) DEFAULT NULL,
  PRIMARY KEY (`nodeId`),
  KEY `modelId` (`modelId`),
  CONSTRAINT `model_node_ibfk_1` FOREIGN KEY (`modelId`) REFERENCES `flow_model` (`modelId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table test.model_node: ~0 rows (approximately)
DELETE FROM `model_node`;
/*!40000 ALTER TABLE `model_node` DISABLE KEYS */;
INSERT INTO `model_node` (`nodeId`, `nodeName`, `nodeData`, `nodeSource`, `nodeTarget`, `createTime`, `modelId`, `methodId`) VALUES
	(1, 'node1', '1111', NULL, NULL, '2016-09-19 20:47:23', 1, NULL);
/*!40000 ALTER TABLE `model_node` ENABLE KEYS */;


-- Dumping structure for table test.test_sql
DROP TABLE IF EXISTS `test_sql`;
CREATE TABLE IF NOT EXISTS `test_sql` (
  `id` int(11) DEFAULT NULL,
  `num` int(11) DEFAULT NULL
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

-- Dumping data for table test.test_sql: 0 rows
DELETE FROM `test_sql`;
/*!40000 ALTER TABLE `test_sql` DISABLE KEYS */;
/*!40000 ALTER TABLE `test_sql` ENABLE KEYS */;
/*!40014 SET FOREIGN_KEY_CHECKS=1 */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
