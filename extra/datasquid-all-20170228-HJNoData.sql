-- --------------------------------------------------------
-- Host:                         10.100.130.156
-- Server version:               5.7.17-0ubuntu0.16.04.1 - (Ubuntu)
-- Server OS:                    Linux
-- HeidiSQL version:             7.0.0.4053
-- Date/time:                    2017-02-28 10:42:36
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET FOREIGN_KEY_CHECKS=0 */;

-- Dumping structure for table datasquid.all_node_calc_time_mh
DROP TABLE IF EXISTS `all_node_calc_time_mh`;
CREATE TABLE IF NOT EXISTS `all_node_calc_time_mh` (
  `orderno` varchar(50) DEFAULT NULL,
  `bill_id` varchar(20) DEFAULT NULL,
  `customs_code` char(4) DEFAULT NULL,
  `ieport` varchar(20) DEFAULT NULL,
  `ie_type` char(2) DEFAULT NULL,
  `billmode` varchar(10) DEFAULT NULL,
  `cbe_code` varchar(20) DEFAULT NULL,
  `cbe_name` varchar(200) DEFAULT NULL,
  `hgcy` char(4) DEFAULT NULL,
  `gjcy` char(4) DEFAULT NULL,
  `xdzf_min` datetime DEFAULT NULL,
  `xdzf_max` datetime DEFAULT NULL,
  `qysb_min` datetime DEFAULT NULL,
  `qysb_max` datetime DEFAULT NULL,
  `hgsb_min` datetime DEFAULT NULL,
  `hgsb_max` datetime DEFAULT NULL,
  `hgfx_min` datetime DEFAULT NULL,
  `hgfx_max` datetime DEFAULT NULL,
  `gjsb_min` datetime DEFAULT NULL,
  `gjsb_max` datetime DEFAULT NULL,
  `gjfx_min` datetime DEFAULT NULL,
  `gjfx_max` datetime DEFAULT NULL,
  `fjfx_min` datetime DEFAULT NULL,
  `fjfx_max` datetime DEFAULT NULL,
  `qdhx_min` datetime DEFAULT NULL,
  `qdhx_max` datetime DEFAULT NULL,
  `dssb_time` bigint(20) DEFAULT NULL,
  `qysb_time` bigint(20) DEFAULT NULL,
  `hgtg_time` bigint(20) DEFAULT NULL,
  `gjtg_time` bigint(20) DEFAULT NULL,
  `cyfj_time` bigint(20) DEFAULT NULL,
  `zjcg_time` bigint(20) DEFAULT NULL,
  `all_time` bigint(20) DEFAULT NULL,
  `cyfj_start` datetime DEFAULT NULL,
  `all_time_start` datetime DEFAULT NULL,
  `all_time_end` datetime DEFAULT NULL,
  `zyq_time` bigint(20) DEFAULT NULL,
  `zyq_time_start` datetime DEFAULT NULL,
  `zyq_time_end` datetime DEFAULT NULL,
  `status` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '状态，个位=1时为异常数据',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `orderno` (`orderno`),
  KEY `ieport` (`ieport`),
  KEY `ie_type` (`ie_type`),
  KEY `billmode` (`billmode`),
  KEY `customs_code` (`customs_code`),
  KEY `IDX_ALL_TM_MH_CTM` (`create_time`),
  KEY `gjfx_max` (`gjfx_max`),
  KEY `gjfx_min` (`gjfx_min`),
  KEY `hgfx_max` (`hgfx_max`),
  KEY `hgfx_min` (`hgfx_min`),
  KEY `xdzf_min` (`xdzf_min`),
  KEY `xdzf_max` (`xdzf_max`),
  KEY `cbe_code` (`cbe_code`),
  KEY `zyq_time` (`zyq_time`),
  KEY `all_time` (`all_time`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for table datasquid.all_node_calc_time_wt
DROP TABLE IF EXISTS `all_node_calc_time_wt`;
CREATE TABLE IF NOT EXISTS `all_node_calc_time_wt` (
  `order_no` varchar(50) DEFAULT NULL,
  `head_guid` varchar(36) DEFAULT NULL,
  `customs_code` char(4) DEFAULT NULL,
  `port_code` varchar(20) DEFAULT NULL,
  `traf_mode` varchar(10) DEFAULT NULL,
  `ie_flag` char(2) DEFAULT NULL,
  `ebc_code` varchar(20) DEFAULT NULL,
  `ebc_name` varchar(200) DEFAULT NULL,
  `hgcy` char(4) DEFAULT NULL,
  `gjcy` char(4) DEFAULT NULL,
  `xdzf_min` datetime DEFAULT NULL,
  `xdzf_max` datetime DEFAULT NULL,
  `ydrc_min` datetime DEFAULT NULL,
  `ydrc_max` datetime DEFAULT NULL,
  `hgsb_min` datetime DEFAULT NULL,
  `hgsb_max` datetime DEFAULT NULL,
  `hgfx_min` datetime DEFAULT NULL,
  `hgfx_max` datetime DEFAULT NULL,
  `gjsb_min` datetime DEFAULT NULL,
  `gjsb_max` datetime DEFAULT NULL,
  `gjfx_min` datetime DEFAULT NULL,
  `gjfx_max` datetime DEFAULT NULL,
  `fjfx_min` datetime DEFAULT NULL,
  `fjfx_max` datetime DEFAULT NULL,
  `hfsb_min` datetime DEFAULT NULL,
  `hfsb_max` datetime DEFAULT NULL,
  `hfcq_min` datetime DEFAULT NULL,
  `hfcq_max` datetime DEFAULT NULL,
  `tuotou_min` datetime DEFAULT NULL,
  `tuotou_max` datetime DEFAULT NULL,
  `gjwl_time` bigint(20) DEFAULT NULL,
  `qysb_time` bigint(20) DEFAULT NULL,
  `hgtg_time` bigint(20) DEFAULT NULL,
  `gjtg_time` bigint(20) DEFAULT NULL,
  `cyfj_time` bigint(20) DEFAULT NULL,
  `shcq_time` bigint(20) DEFAULT NULL,
  `gnwl_time` bigint(20) DEFAULT NULL,
  `all_time` bigint(20) DEFAULT NULL,
  `cyfj_start` datetime DEFAULT NULL,
  `all_time_start` datetime DEFAULT NULL,
  `all_time_end` datetime DEFAULT NULL,
  `zyq_time` bigint(20) DEFAULT NULL,
  `zyq_time_start` datetime DEFAULT NULL,
  `zyq_time_end` datetime DEFAULT NULL,
  `status` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '状态，个位=1时为异常数据',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `IDX_ALL_TM_WT_CTM` (`create_time`),
  KEY `IDX_ALL_TM_ORDNO` (`order_no`),
  KEY `IDX_ALL_TM_PORT` (`port_code`),
  KEY `IDX_ALL_TM_IEFLG` (`ie_flag`),
  KEY `IDX_ALL_TM_TRF` (`traf_mode`),
  KEY `IDX_ALL_TM_CUSC` (`customs_code`),
  KEY `hgfx_max` (`hgfx_max`),
  KEY `hgfx_min` (`hgfx_min`),
  KEY `gjfx_max` (`gjfx_max`),
  KEY `gjfx_min` (`gjfx_min`),
  KEY `xdzf_min` (`xdzf_min`),
  KEY `xdzf_max` (`xdzf_max`),
  KEY `ebc_code` (`ebc_code`),
  KEY `hgcy` (`hgcy`),
  KEY `gjcy` (`gjcy`),
  KEY `zyq_time` (`zyq_time`),
  KEY `all_time` (`all_time`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for table datasquid.area_info
DROP TABLE IF EXISTS `area_info`;
CREATE TABLE IF NOT EXISTS `area_info` (
  `custom_code` char(4) DEFAULT NULL,
  `custom_name` varchar(100) DEFAULT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `IDX_AREA_CTM` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for table datasquid.ds_result_13r110cba
DROP TABLE IF EXISTS `ds_result_13r110cba`;
CREATE TABLE IF NOT EXISTS `ds_result_13r110cba` (
  `rxid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `rexid` int(10) unsigned NOT NULL,
  `hyear` smallint(5) unsigned NOT NULL,
  `hseason` tinyint(3) unsigned NOT NULL,
  `hmonth` tinyint(3) unsigned NOT NULL,
  `hweek` tinyint(3) unsigned NOT NULL,
  `hday` tinyint(3) unsigned NOT NULL,
  `hhour` tinyint(3) unsigned NOT NULL,
  `hminute` tinyint(3) unsigned NOT NULL,
  `hit` int(10) unsigned NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `hash_code` char(32) NOT NULL,
  `last_update` datetime DEFAULT NULL,
  PRIMARY KEY (`rxid`),
  UNIQUE KEY `un_hash_code` (`hash_code`),
  KEY `hyear` (`hyear`),
  KEY `hseason` (`hseason`),
  KEY `hmonth` (`hmonth`),
  KEY `hweek` (`hweek`),
  KEY `hday` (`hday`),
  KEY `hhour` (`hhour`),
  KEY `hminute` (`hminute`),
  KEY `last_update` (`last_update`),
  KEY `rexid` (`rexid`),
  KEY `hash_code` (`hash_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for table datasquid.ds_result_14r14f9b
DROP TABLE IF EXISTS `ds_result_14r14f9b`;
CREATE TABLE IF NOT EXISTS `ds_result_14r14f9b` (
  `rxid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `rexid` int(10) unsigned NOT NULL,
  `hyear` smallint(5) unsigned NOT NULL,
  `hseason` tinyint(3) unsigned NOT NULL,
  `hmonth` tinyint(3) unsigned NOT NULL,
  `hweek` tinyint(3) unsigned NOT NULL,
  `hday` tinyint(3) unsigned NOT NULL,
  `hhour` tinyint(3) unsigned NOT NULL,
  `hminute` tinyint(3) unsigned NOT NULL,
  `hit` int(10) unsigned NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `hash_code` char(32) NOT NULL,
  `last_update` datetime DEFAULT NULL,
  PRIMARY KEY (`rxid`),
  UNIQUE KEY `hash_code` (`hash_code`),
  KEY `hyear` (`hyear`),
  KEY `hseason` (`hseason`),
  KEY `hmonth` (`hmonth`),
  KEY `hweek` (`hweek`),
  KEY `hday` (`hday`),
  KEY `hhour` (`hhour`),
  KEY `hminute` (`hminute`),
  KEY `last_update` (`last_update`),
  KEY `rexid` (`rexid`),
  KEY `unihash_code` (`hash_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for table datasquid.ds_result_15r11426e
DROP TABLE IF EXISTS `ds_result_15r11426e`;
CREATE TABLE IF NOT EXISTS `ds_result_15r11426e` (
  `rxid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `rexid` int(10) unsigned NOT NULL,
  `hyear` smallint(5) unsigned NOT NULL,
  `hseason` tinyint(3) unsigned NOT NULL,
  `hmonth` tinyint(3) unsigned NOT NULL,
  `hweek` tinyint(3) unsigned NOT NULL,
  `hday` tinyint(3) unsigned NOT NULL,
  `hhour` tinyint(3) unsigned NOT NULL,
  `hminute` tinyint(3) unsigned NOT NULL,
  `hit` int(10) unsigned NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `hash_code` char(32) NOT NULL,
  `last_update` datetime DEFAULT NULL,
  PRIMARY KEY (`rxid`),
  UNIQUE KEY `hash_code` (`hash_code`),
  KEY `hyear` (`hyear`),
  KEY `hseason` (`hseason`),
  KEY `hmonth` (`hmonth`),
  KEY `hweek` (`hweek`),
  KEY `hday` (`hday`),
  KEY `hhour` (`hhour`),
  KEY `hminute` (`hminute`),
  KEY `last_update` (`last_update`),
  KEY `rexid` (`rexid`),
  KEY `unihash_code` (`hash_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for table datasquid.ds_result_17r17f35
DROP TABLE IF EXISTS `ds_result_17r17f35`;
CREATE TABLE IF NOT EXISTS `ds_result_17r17f35` (
  `rxid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `rexid` int(10) unsigned NOT NULL,
  `hyear` smallint(5) unsigned NOT NULL,
  `hseason` tinyint(3) unsigned NOT NULL,
  `hmonth` tinyint(3) unsigned NOT NULL,
  `hweek` tinyint(3) unsigned NOT NULL,
  `hday` tinyint(3) unsigned NOT NULL,
  `hhour` tinyint(3) unsigned NOT NULL,
  `hminute` tinyint(3) unsigned NOT NULL,
  `hit` int(10) unsigned NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `hash_code` char(32) NOT NULL,
  `last_update` datetime DEFAULT NULL,
  PRIMARY KEY (`rxid`),
  UNIQUE KEY `hash_code` (`hash_code`),
  KEY `hyear` (`hyear`),
  KEY `hseason` (`hseason`),
  KEY `hmonth` (`hmonth`),
  KEY `hweek` (`hweek`),
  KEY `hday` (`hday`),
  KEY `hhour` (`hhour`),
  KEY `hminute` (`hminute`),
  KEY `last_update` (`last_update`),
  KEY `rexid` (`rexid`),
  KEY `unihash_code` (`hash_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for table datasquid.ds_result_18r1160ea
DROP TABLE IF EXISTS `ds_result_18r1160ea`;
CREATE TABLE IF NOT EXISTS `ds_result_18r1160ea` (
  `rxid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `rexid` int(10) unsigned NOT NULL,
  `hyear` smallint(5) unsigned NOT NULL,
  `hseason` tinyint(3) unsigned NOT NULL,
  `hmonth` tinyint(3) unsigned NOT NULL,
  `hweek` tinyint(3) unsigned NOT NULL,
  `hday` tinyint(3) unsigned NOT NULL,
  `hhour` tinyint(3) unsigned NOT NULL,
  `hminute` tinyint(3) unsigned NOT NULL,
  `hit` int(10) unsigned NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `hash_code` char(32) NOT NULL,
  `last_update` datetime DEFAULT NULL,
  PRIMARY KEY (`rxid`),
  UNIQUE KEY `hash_code` (`hash_code`),
  KEY `hyear` (`hyear`),
  KEY `hseason` (`hseason`),
  KEY `hmonth` (`hmonth`),
  KEY `hweek` (`hweek`),
  KEY `hday` (`hday`),
  KEY `hhour` (`hhour`),
  KEY `hminute` (`hminute`),
  KEY `last_update` (`last_update`),
  KEY `rexid` (`rexid`),
  KEY `unihash_code` (`hash_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for table datasquid.ds_result_19r1f6c1
DROP TABLE IF EXISTS `ds_result_19r1f6c1`;
CREATE TABLE IF NOT EXISTS `ds_result_19r1f6c1` (
  `rxid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `rexid` int(10) unsigned NOT NULL,
  `hyear` smallint(5) unsigned NOT NULL,
  `hseason` tinyint(3) unsigned NOT NULL,
  `hmonth` tinyint(3) unsigned NOT NULL,
  `hweek` tinyint(3) unsigned NOT NULL,
  `hday` tinyint(3) unsigned NOT NULL,
  `hhour` tinyint(3) unsigned NOT NULL,
  `hminute` tinyint(3) unsigned NOT NULL,
  `hit` int(10) unsigned NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_update` datetime DEFAULT NULL,
  `hash_code` char(32) NOT NULL,
  PRIMARY KEY (`rxid`),
  UNIQUE KEY `hash_code` (`hash_code`),
  KEY `hyear` (`hyear`),
  KEY `hseason` (`hseason`),
  KEY `hmonth` (`hmonth`),
  KEY `hweek` (`hweek`),
  KEY `hday` (`hday`),
  KEY `hhour` (`hhour`),
  KEY `hminute` (`hminute`),
  KEY `last_update` (`last_update`),
  KEY `rexid` (`rexid`),
  KEY `unihash_code` (`hash_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for table datasquid.ds_result_1r11129
DROP TABLE IF EXISTS `ds_result_1r11129`;
CREATE TABLE IF NOT EXISTS `ds_result_1r11129` (
  `rxid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `rexid` int(10) unsigned NOT NULL,
  `hyear` smallint(5) unsigned NOT NULL,
  `hseason` tinyint(3) unsigned NOT NULL,
  `hmonth` tinyint(3) unsigned NOT NULL,
  `hweek` tinyint(3) unsigned NOT NULL,
  `hday` tinyint(3) unsigned NOT NULL,
  `hhour` tinyint(3) unsigned NOT NULL,
  `hminute` tinyint(3) unsigned NOT NULL,
  `hit` int(10) unsigned NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `hash_code` char(32) NOT NULL,
  `last_update` datetime DEFAULT NULL,
  PRIMARY KEY (`rxid`),
  UNIQUE KEY `hash_code` (`hash_code`),
  KEY `hyear` (`hyear`),
  KEY `hseason` (`hseason`),
  KEY `hmonth` (`hmonth`),
  KEY `hweek` (`hweek`),
  KEY `hday` (`hday`),
  KEY `hhour` (`hhour`),
  KEY `hminute` (`hminute`),
  KEY `last_update` (`last_update`),
  KEY `rexid` (`rexid`),
  KEY `unihash_code` (`hash_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for table datasquid.ds_result_2r18d61
DROP TABLE IF EXISTS `ds_result_2r18d61`;
CREATE TABLE IF NOT EXISTS `ds_result_2r18d61` (
  `rxid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `rexid` int(10) unsigned NOT NULL,
  `hyear` smallint(5) unsigned NOT NULL,
  `hseason` tinyint(3) unsigned NOT NULL,
  `hmonth` tinyint(3) unsigned NOT NULL,
  `hweek` tinyint(3) unsigned NOT NULL,
  `hday` tinyint(3) unsigned NOT NULL,
  `hhour` tinyint(3) unsigned NOT NULL,
  `hminute` tinyint(3) unsigned NOT NULL,
  `hit` int(10) unsigned NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `hash_code` char(32) NOT NULL,
  `last_update` datetime DEFAULT NULL,
  PRIMARY KEY (`rxid`),
  UNIQUE KEY `hash_code` (`hash_code`),
  KEY `hyear` (`hyear`),
  KEY `hseason` (`hseason`),
  KEY `hmonth` (`hmonth`),
  KEY `hweek` (`hweek`),
  KEY `hday` (`hday`),
  KEY `hhour` (`hhour`),
  KEY `hminute` (`hminute`),
  KEY `last_update` (`last_update`),
  KEY `rexid` (`rexid`),
  KEY `unihash_code` (`hash_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for table datasquid.ds_result_e_13r110cba
DROP TABLE IF EXISTS `ds_result_e_13r110cba`;
CREATE TABLE IF NOT EXISTS `ds_result_e_13r110cba` (
  `rexid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `hash_code` char(32) NOT NULL,
  `qiye_id` varchar(20) DEFAULT NULL,
  `qiye_name` varchar(200) DEFAULT NULL,
  `qiye_type` char(4) NOT NULL DEFAULT '',
  `customs_code` char(4) DEFAULT NULL,
  `ieport` varchar(20) DEFAULT NULL,
  `sys_type` char(2) NOT NULL DEFAULT '',
  PRIMARY KEY (`rexid`),
  UNIQUE KEY `un_hash_code` (`hash_code`),
  KEY `IDX_QIYE_INF_ID` (`qiye_id`,`qiye_type`),
  KEY `qiye_name` (`qiye_name`),
  KEY `sys_type` (`sys_type`),
  KEY `ieport` (`ieport`),
  KEY `customs_code` (`customs_code`),
  KEY `create_time` (`create_time`),
  KEY `hash_code` (`hash_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for table datasquid.ds_result_e_14r14f9b
DROP TABLE IF EXISTS `ds_result_e_14r14f9b`;
CREATE TABLE IF NOT EXISTS `ds_result_e_14r14f9b` (
  `rexid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `hash_code` char(32) NOT NULL,
  `order_no` varchar(50) DEFAULT NULL,
  `country` varchar(10) DEFAULT NULL,
  `total_price` decimal(20,6) DEFAULT NULL,
  `calc_total_price` decimal(20,6) DEFAULT NULL,
  `currency` varchar(10) NOT NULL DEFAULT '',
  `customs_code` char(4) DEFAULT NULL,
  `ie_port` varchar(20) DEFAULT NULL,
  `ie_type` char(2) DEFAULT NULL,
  `sys_type` char(4) NOT NULL DEFAULT '',
  `order_time` datetime DEFAULT NULL,
  PRIMARY KEY (`rexid`),
  UNIQUE KEY `unihash_code` (`hash_code`),
  KEY `country` (`country`),
  KEY `sys_type` (`sys_type`),
  KEY `ie_port` (`ie_port`),
  KEY `customs_code` (`customs_code`),
  KEY `create_time` (`create_time`),
  KEY `hash_code` (`hash_code`),
  KEY `ie_type` (`ie_type`),
  KEY `order_time` (`order_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for table datasquid.ds_result_e_15r11426e
DROP TABLE IF EXISTS `ds_result_e_15r11426e`;
CREATE TABLE IF NOT EXISTS `ds_result_e_15r11426e` (
  `rexid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `hash_code` char(32) NOT NULL,
  `order_no` varchar(50) DEFAULT NULL,
  `province` varchar(20) DEFAULT NULL,
  `total_price` decimal(20,6) DEFAULT NULL,
  `calc_total_price` decimal(20,6) DEFAULT NULL,
  `currency` varchar(10) NOT NULL DEFAULT '',
  `customs_code` char(4) DEFAULT NULL,
  `ie_port` varchar(20) DEFAULT NULL,
  `ie_type` char(2) DEFAULT NULL,
  `sys_type` char(4) NOT NULL DEFAULT '',
  `order_time` datetime DEFAULT NULL,
  PRIMARY KEY (`rexid`),
  UNIQUE KEY `unihash_code` (`hash_code`),
  KEY `province` (`province`),
  KEY `sys_type` (`sys_type`),
  KEY `ie_port` (`ie_port`),
  KEY `customs_code` (`customs_code`),
  KEY `create_time` (`create_time`),
  KEY `hash_code` (`hash_code`),
  KEY `order_time` (`order_time`),
  KEY `ie_type` (`ie_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for table datasquid.ds_result_e_17r17f35
DROP TABLE IF EXISTS `ds_result_e_17r17f35`;
CREATE TABLE IF NOT EXISTS `ds_result_e_17r17f35` (
  `rexid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `hash_code` char(32) NOT NULL,
  `order_no` varchar(50) DEFAULT NULL,
  `country` varchar(10) DEFAULT NULL,
  `total_price` decimal(20,6) DEFAULT NULL,
  `calc_total_price` decimal(20,6) DEFAULT NULL,
  `currency` varchar(10) NOT NULL DEFAULT '',
  `customs_code` char(4) DEFAULT NULL,
  `ie_port` varchar(20) DEFAULT NULL,
  `ie_type` char(2) DEFAULT NULL,
  `sys_type` char(4) NOT NULL DEFAULT '',
  `order_time` datetime DEFAULT NULL,
  PRIMARY KEY (`rexid`),
  UNIQUE KEY `unihash_code` (`hash_code`),
  KEY `country` (`country`),
  KEY `sys_type` (`sys_type`),
  KEY `ie_port` (`ie_port`),
  KEY `customs_code` (`customs_code`),
  KEY `create_time` (`create_time`),
  KEY `hash_code` (`hash_code`),
  KEY `ie_type` (`ie_type`),
  KEY `order_time` (`order_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for table datasquid.ds_result_e_18r1160ea
DROP TABLE IF EXISTS `ds_result_e_18r1160ea`;
CREATE TABLE IF NOT EXISTS `ds_result_e_18r1160ea` (
  `rexid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `hash_code` char(32) NOT NULL,
  `order_no` varchar(50) DEFAULT NULL,
  `type_level_1` varchar(100) DEFAULT NULL,
  `type_level_2` varchar(100) DEFAULT NULL,
  `qty` decimal(20,6) DEFAULT NULL,
  `goods_type` decimal(20,6) DEFAULT NULL,
  `total_price` varchar(100) DEFAULT NULL,
  `calc_total_price` decimal(20,6) DEFAULT NULL,
  `currency` varchar(10) NOT NULL DEFAULT '',
  `customs_code` char(4) DEFAULT NULL,
  `ie_port` varchar(20) DEFAULT NULL,
  `ie_type` char(2) DEFAULT NULL,
  `sys_type` char(4) NOT NULL DEFAULT '',
  `order_time` datetime DEFAULT NULL,
  PRIMARY KEY (`rexid`),
  UNIQUE KEY `unihash_code` (`hash_code`),
  KEY `type_level_1` (`type_level_1`),
  KEY `type_level_2` (`type_level_2`),
  KEY `sys_type` (`sys_type`),
  KEY `ie_port` (`ie_port`),
  KEY `customs_code` (`customs_code`),
  KEY `create_time` (`create_time`),
  KEY `hash_code` (`hash_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for table datasquid.ds_result_e_19r1f6c1
DROP TABLE IF EXISTS `ds_result_e_19r1f6c1`;
CREATE TABLE IF NOT EXISTS `ds_result_e_19r1f6c1` (
  `rexid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `hash_code` char(32) NOT NULL,
  `order_no` varchar(50) DEFAULT NULL,
  `type_level_1` varchar(100) DEFAULT NULL,
  `type_level_2` varchar(100) DEFAULT NULL,
  `qty` decimal(20,6) DEFAULT NULL,
  `goods_type` varchar(100) DEFAULT NULL,
  `total_price` decimal(20,6) DEFAULT NULL,
  `calc_total_price` decimal(20,6) DEFAULT NULL,
  `currency` varchar(10) NOT NULL DEFAULT '',
  `customs_code` char(4) DEFAULT NULL,
  `ie_port` varchar(20) DEFAULT NULL,
  `ie_type` char(2) DEFAULT NULL,
  `sys_type` char(4) NOT NULL DEFAULT '',
  `order_time` datetime DEFAULT NULL,
  PRIMARY KEY (`rexid`),
  UNIQUE KEY `unihash_code` (`hash_code`),
  KEY `type_level_1` (`type_level_1`),
  KEY `type_level_2` (`type_level_2`),
  KEY `sys_type` (`sys_type`),
  KEY `ie_port` (`ie_port`),
  KEY `customs_code` (`customs_code`),
  KEY `create_time` (`create_time`),
  KEY `hash_code` (`hash_code`),
  KEY `order_time` (`order_time`),
  KEY `ie_type` (`ie_type`),
  KEY `order_no` (`order_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for table datasquid.ds_result_e_1r11129
DROP TABLE IF EXISTS `ds_result_e_1r11129`;
CREATE TABLE IF NOT EXISTS `ds_result_e_1r11129` (
  `rexid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `hash_code` char(32) NOT NULL,
  `name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`rexid`),
  UNIQUE KEY `unihash_code` (`hash_code`),
  KEY `create_time` (`create_time`),
  KEY `hash_code` (`hash_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for table datasquid.ds_result_e_2r18d61
DROP TABLE IF EXISTS `ds_result_e_2r18d61`;
CREATE TABLE IF NOT EXISTS `ds_result_e_2r18d61` (
  `rexid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `hash_code` char(32) NOT NULL,
  `birthday` datetime NOT NULL,
  PRIMARY KEY (`rexid`),
  UNIQUE KEY `unihash_code` (`hash_code`),
  KEY `create_time` (`create_time`),
  KEY `hash_code` (`hash_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for table datasquid.ds_script_execute
DROP TABLE IF EXISTS `ds_script_execute`;
CREATE TABLE IF NOT EXISTS `ds_script_execute` (
  `seid` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `sid` int(10) unsigned NOT NULL COMMENT '脚本ID',
  `success` tinyint(10) NOT NULL COMMENT '是否成功',
  `result` text NOT NULL COMMENT '执行结果',
  `cost` int(11) NOT NULL COMMENT '耗时',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `complete_time` datetime DEFAULT NULL COMMENT '完成时间',
  PRIMARY KEY (`seid`),
  KEY `create_time` (`create_time`),
  KEY `sid` (`sid`),
  KEY `success` (`success`),
  KEY `cost` (`cost`),
  KEY `complete_time` (`complete_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='脚本执行记录';

-- Data exporting was unselected.


-- Dumping structure for table datasquid.order_info
DROP TABLE IF EXISTS `order_info`;
CREATE TABLE IF NOT EXISTS `order_info` (
  `sys_type` char(4) NOT NULL DEFAULT '',
  `ie_type` char(2) NOT NULL DEFAULT '',
  `order_no` varchar(50) DEFAULT NULL,
  `cbe_code` varchar(20) DEFAULT NULL,
  `hgcy` varchar(4) DEFAULT NULL,
  `gjcy` varchar(4) DEFAULT NULL,
  `cbe_code_insp` varchar(20) DEFAULT NULL,
  `cbe_name` varchar(200) DEFAULT NULL,
  `ecp_code` varchar(20) DEFAULT NULL,
  `ecp_name` varchar(200) DEFAULT NULL,
  `coll_ccib_countryno` varchar(20) DEFAULT NULL,
  `coll_address` varchar(200) DEFAULT NULL,
  `province` varchar(20) DEFAULT NULL,
  `order_sum` decimal(20,6) DEFAULT NULL,
  `submit_time` datetime DEFAULT NULL,
  `stime` datetime DEFAULT NULL,
  `qdstime` datetime DEFAULT NULL,
  `consignee` varchar(100) DEFAULT NULL,
  `consignee_telephone` varchar(20) DEFAULT NULL,
  `buyer_id_number` varchar(60) DEFAULT NULL,
  `sys_date` datetime DEFAULT NULL,
  `app_time` datetime DEFAULT NULL,
  `head_guid` varchar(36) DEFAULT NULL,
  `total_price` decimal(20,6) DEFAULT NULL,
  `calc_total_price` decimal(20,6) DEFAULT NULL,
  `relation_no` varchar(36) DEFAULT NULL,
  `biz_no` varchar(50) DEFAULT NULL,
  `ie_port` varchar(20) DEFAULT NULL,
  `customs_code` char(4) DEFAULT NULL,
  `country` varchar(10) DEFAULT NULL,
  `currency` varchar(10) DEFAULT NULL,
  `fumal` varchar(4) DEFAULT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `logistics_code` varchar(20) DEFAULT NULL,
  `logistics_name` varchar(200) DEFAULT NULL,
  KEY `IDX_ORDER_INFO_TM` (`sys_type`,`app_time`),
  KEY `IDX_ORDER_INFO_TM2` (`sys_type`,`stime`),
  KEY `IDX_ORDER_INFO_CTM` (`create_time`),
  KEY `IDX_ORDER_INFO_IETP` (`ie_type`),
  KEY `IDX_ORDER_INFO_IEP` (`ie_port`),
  KEY `IDX_ORDER_INFO_CUSC` (`customs_code`),
  KEY `order_no` (`order_no`),
  KEY `fumal` (`fumal`),
  KEY `relation_no` (`relation_no`),
  KEY `hgcy` (`hgcy`),
  KEY `gjcy` (`gjcy`),
  KEY `cbe_code` (`cbe_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for table datasquid.product_info
DROP TABLE IF EXISTS `product_info`;
CREATE TABLE IF NOT EXISTS `product_info` (
  `sys_type` char(4) NOT NULL DEFAULT '',
  `relation_no` varchar(36) DEFAULT NULL,
  `goods_name` text,
  `qty` decimal(20,6) DEFAULT NULL,
  `total_price` decimal(20,6) DEFAULT NULL,
  `calc_total_price` decimal(20,6) DEFAULT NULL,
  `goods_type` varchar(100) DEFAULT NULL,
  `order_time` datetime DEFAULT NULL,
  `order_no` varchar(100) DEFAULT NULL,
  `currency` varchar(10) DEFAULT NULL,
  `type_level_1` varchar(100) DEFAULT NULL,
  `type_level_2` varchar(100) DEFAULT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `IDX_PRD_INF_CTM` (`create_time`),
  KEY `IDX_PRD_INF_ID` (`relation_no`,`sys_type`),
  KEY `type_level_1` (`type_level_1`),
  KEY `type_level_2` (`type_level_2`),
  KEY `order_no` (`order_no`),
  KEY `order_time` (`order_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for table datasquid.qiye_info
DROP TABLE IF EXISTS `qiye_info`;
CREATE TABLE IF NOT EXISTS `qiye_info` (
  `qiye_id` varchar(20) DEFAULT NULL,
  `qiye_name` varchar(200) DEFAULT NULL,
  `qiye_type` char(4) NOT NULL DEFAULT '',
  `customs_code` char(4) DEFAULT NULL,
  `ieport` varchar(20) DEFAULT NULL,
  `sys_type` char(2) NOT NULL DEFAULT '',
  `order_no` varchar(50) NOT NULL DEFAULT '',
  `order_time` datetime DEFAULT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `IDX_QIYE_INF_CTM` (`create_time`),
  KEY `IDX_QIYE_INF_ID` (`qiye_id`,`qiye_type`),
  KEY `qiye_name` (`qiye_name`),
  KEY `sys_type` (`sys_type`),
  KEY `ieport` (`ieport`),
  KEY `customs_code` (`customs_code`),
  KEY `order_time` (`order_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
/*!40014 SET FOREIGN_KEY_CHECKS=1 */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
