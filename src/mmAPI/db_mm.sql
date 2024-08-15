-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Aug 15, 2024 at 12:48 PM
-- Server version: 8.0.39
-- PHP Version: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_mm`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
CREATE TABLE IF NOT EXISTS `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `postId` int NOT NULL,
  `postedBy` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `postId` (`postId`),
  KEY `postedBy` (`postedBy`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
CREATE TABLE IF NOT EXISTS `posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `img` varchar(255) NOT NULL,
  `postedBy` varchar(255) NOT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `visibility` varchar(10) DEFAULT 'public',
  `views` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `username`, `password`, `profile_picture`, `created_at`) VALUES
(1, 'John', 'Doe', 'johndoe', '$2y$10$2Hp90KedKonZEFYOGJibD.DTTrQnUnEvbQLNIQC/LeamYz4GW5ddK', NULL, '2024-08-14 01:27:29'),
(2, 'Test', '1', 'test1', '$2y$10$6jfnWBaU.hVi9hWRBaqNG.eaUFmmX/atcqMTdjCT0RkXgOqfho4Ku', NULL, '2024-08-14 01:32:39'),
(3, 'Test', '2', 'test2', '$2y$10$xthU5.w6A5GjUL.Ax8jl6eX1RzjGqIQMjzijaL4HtFMGAMFl8CL3y', NULL, '2024-08-14 01:50:46'),
(4, 'Test', '3', 'test3', '$2y$10$Oa9VFmH5DpouC2ufWDp4fuR5828bfL/hDAS9MOosTR1dy6HFxZ.dC', NULL, '2024-08-14 04:42:54'),
(5, 'Test', '4', 'test4', '$2y$10$n7ABVf7c7.ZATsuBArTdPeLUw/UaMg9KusG5BL3RsnhNhnyn0KhZK', NULL, '2024-08-14 04:47:55'),
(6, 'Test', '5', 'test5', '$2y$10$aI6xTmzzcOyfK4SCls6P7.2FQpy9i4aOvsBbWPzZlUVZ3mIJTgxwS', NULL, '2024-08-14 04:48:29'),
(7, 'Test', '6', 'test6', '$2y$10$WToYHPsJCqjpDtFGiGXdku8Bm8svr2wwzp4t/8LO94eWxlAQYS.gC', NULL, '2024-08-14 15:02:36'),
(8, 'Test', '7', 'test7', '$2y$10$Rz5p7y3/IhtCLv32ZgGtRexeher9WWy948yWjHjiP6zy2GDThadxy', NULL, '2024-08-14 15:03:00'),
(9, 'Test', '8', 'test8', '$2y$10$wVJEoRTW9ULQXCjGSX43qefuqRKz5pJp9WJj2nol0wYwAj9ZgB/8W', NULL, '2024-08-14 15:15:31');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`postedBy`) REFERENCES `users` (`username`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
