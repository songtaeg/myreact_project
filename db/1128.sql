-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        8.0.39 - MySQL Community Server - GPL
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- reactdb 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `reactdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `reactdb`;

-- 테이블 reactdb.tbl_transaction 구조 내보내기
CREATE TABLE IF NOT EXISTS `tbl_transaction` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(50) NOT NULL,
  `description` varchar(100) NOT NULL,
  `amount` int NOT NULL DEFAULT '0',
  `type` enum('수입','지출') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '수입',
  `category` varchar(50) NOT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `tbl_transaction_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 reactdb.tbl_transaction:~5 rows (대략적) 내보내기
INSERT INTO `tbl_transaction` (`id`, `user_id`, `description`, `amount`, `type`, `category`, `date`) VALUES
	(7, 'hong1', '월급', 3000000, '수입', '급여', '2024-10-25'),
	(8, 'hong1', '점심', 7900, '지출', '외식', '2024-11-26'),
	(9, 'hong1', '대중교통비', 51000, '지출', '교통', '2024-11-27'),
	(10, 'hong1', '점심', 8800, '지출', '외식', '2024-11-27'),
	(16, 'hong1', '병원', 16000, '지출', '의료비', '2024-11-09');

-- 테이블 reactdb.tbl_user 구조 내보내기
CREATE TABLE IF NOT EXISTS `tbl_user` (
  `user_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `name` varchar(50) NOT NULL,
  `pwd` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 reactdb.tbl_user:~0 rows (대략적) 내보내기
INSERT INTO `tbl_user` (`user_id`, `name`, `pwd`, `email`) VALUES
	('hong1', '홍', '$2b$10$qBSH3iG2MK91r1OAdfo8eOkRI/hQtH53284T9j1/GeV9Bvs2hhNHK', 'gdl35da@gmail.com');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
